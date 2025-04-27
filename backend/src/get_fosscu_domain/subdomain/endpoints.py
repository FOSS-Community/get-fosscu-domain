from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from ..auth.auth import get_current_user
from ..config import get_settings
from ..models.subdomain import Subdomain
from ..models.user import User
from ..postgres import get_db
from ..subdomain.schema import SubdomainCreate, SubdomainResponse
from ..utils.netlify import Netlify
from ..utils.profanity_filter import is_profanity_found
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter(tags=["subdomains"])


def get_netlify_client():
    settings = get_settings()
    return Netlify(access_token=settings.NETLIFY_ACCESS_KEY)


@router.post("/", response_model=SubdomainResponse, status_code=status.HTTP_201_CREATED)
async def create_subdomain(
    subdomain_data: SubdomainCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    netlify: Netlify = Depends(get_netlify_client),
):
    """Create a new subdomain for the authenticated user"""

    # Check if user has reached the maximum limit of 5 domains
    domain_count = (
        db.query(func.count(Subdomain.id))
        .filter(Subdomain.user_id == current_user.id)
        .scalar()
    )

    if domain_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum limit of 5 domains reached",
        )

    # Check for profanity in subdomain
    if is_profanity_found(subdomain_data.subdomain):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain contains inappropriate content",
        )

    # Check if subdomain already exists in database
    existing_subdomain = (
        db.query(Subdomain)
        .filter(Subdomain.subdomain == subdomain_data.subdomain)
        .first()
    )

    if existing_subdomain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain already exists in database",
        )

    # Get Netlify zone ID
    base_domain = get_settings().NETLIFY_DOMAIN
    zone_id = netlify.get_zone_id_by_domain(base_domain)
    if not zone_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get DNS zone ID",
        )

    # Check if record exists in Netlify
    record_id = netlify.get_record_id_by_subdomain(
        zone_id, f"{subdomain_data.subdomain}.{base_domain}"
    )

    if record_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain already exists in Netlify DNS",
        )

    # Create DNS record on Netlify
    dns_record = netlify.create_dns_record(
        zone_id=zone_id,
        record_type=subdomain_data.record_type,
        hostname=f"{subdomain_data.subdomain}.{base_domain}",
        value=subdomain_data.target_domain,
        ttl=subdomain_data.ttl,
        priority=(
            subdomain_data.priority if subdomain_data.record_type == "MX" else None
        ),
    )

    if not dns_record:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create DNS record on Netlify",
        )

    # Create new subdomain in database
    new_subdomain = Subdomain(
        subdomain=subdomain_data.subdomain,
        target_domain=subdomain_data.target_domain,
        record_type=subdomain_data.record_type,
        ttl=subdomain_data.ttl,
        priority=subdomain_data.priority,
        user_id=current_user.id,
    )

    db.add(new_subdomain)
    db.commit()
    db.refresh(new_subdomain)

    return new_subdomain


@router.get("/", response_model=List[SubdomainResponse], status_code=status.HTTP_200_OK)
async def get_user_subdomains(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get all subdomains for the authenticated user"""

    subdomains = db.query(Subdomain).filter(Subdomain.user_id == current_user.id).all()

    return subdomains


@router.get(
    "/{subdomain_id}", response_model=SubdomainResponse, status_code=status.HTTP_200_OK
)
async def get_subdomain(
    subdomain_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific subdomain by ID"""

    subdomain = (
        db.query(Subdomain)
        .filter(Subdomain.id == subdomain_id, Subdomain.user_id == current_user.id)
        .first()
    )

    if not subdomain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subdomain not found"
        )

    return subdomain


@router.put(
    "/{subdomain_id}", response_model=SubdomainResponse, status_code=status.HTTP_200_OK
)
async def update_subdomain(
    subdomain_id: int,
    subdomain_data: SubdomainCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    netlify: Netlify = Depends(get_netlify_client),
):
    """Update a specific subdomain"""

    # Check for profanity in new subdomain
    if is_profanity_found(subdomain_data.subdomain):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain contains inappropriate content",
        )

    subdomain = (
        db.query(Subdomain)
        .filter(Subdomain.id == subdomain_id, Subdomain.user_id == current_user.id)
        .first()
    )

    if not subdomain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subdomain not found"
        )

    base_domain = get_settings().BASE_DOMAIN
    zone_id = netlify.get_zone_id_by_domain(base_domain)
    if not zone_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get DNS zone ID",
        )

    # If subdomain name is being changed
    if subdomain_data.subdomain != subdomain.subdomain:
        # Check if new subdomain name already exists in database
        existing_subdomain = (
            db.query(Subdomain)
            .filter(
                Subdomain.subdomain == subdomain_data.subdomain,
                Subdomain.id != subdomain_id,
            )
            .first()
        )

        if existing_subdomain:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Subdomain already exists in database",
            )

        # Check if new subdomain exists in Netlify
        new_record_id = netlify.get_record_id_by_subdomain(
            zone_id, f"{subdomain_data.subdomain}.{base_domain}"
        )

        if new_record_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Subdomain already exists in Netlify DNS",
            )

        # Delete old DNS record
        old_record_id = netlify.get_record_id_by_subdomain(
            zone_id, f"{subdomain.subdomain}.{base_domain}"
        )
        if old_record_id:
            netlify.remove_dns_record(zone_id, old_record_id)

    # Create or update DNS record
    record_id = netlify.get_record_id_by_subdomain(
        zone_id, f"{subdomain.subdomain}.{base_domain}"
    )

    if record_id:
        # Update existing record
        netlify.update_dns_record(
            zone_id=zone_id,
            record_id=record_id,
            record_type=subdomain_data.record_type,
            hostname=f"{subdomain_data.subdomain}.{base_domain}",
            value=subdomain_data.target_domain,
            ttl=subdomain_data.ttl,
            priority=(
                subdomain_data.priority if subdomain_data.record_type == "MX" else None
            ),
        )
    else:
        # Create new record
        dns_record = netlify.create_dns_record(
            zone_id=zone_id,
            record_type=subdomain_data.record_type,
            hostname=f"{subdomain_data.subdomain}.{base_domain}",
            value=subdomain_data.target_domain,
            ttl=subdomain_data.ttl,
            priority=(
                subdomain_data.priority if subdomain_data.record_type == "MX" else None
            ),
        )

        if not dns_record:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create DNS record on Netlify",
            )

    # Update database record
    subdomain.subdomain = subdomain_data.subdomain
    subdomain.target_domain = subdomain_data.target_domain
    subdomain.record_type = subdomain_data.record_type
    subdomain.ttl = subdomain_data.ttl
    subdomain.priority = subdomain_data.priority
    subdomain.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(subdomain)

    return subdomain


@router.delete("/{subdomain_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subdomain(
    subdomain_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    netlify: Netlify = Depends(get_netlify_client),
):
    """Delete a specific subdomain"""

    subdomain_instance = (
        db.query(Subdomain)
        .filter(Subdomain.id == subdomain_id, Subdomain.user_id == current_user.id)
        .first()
    )

    if not subdomain_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subdomain not found"
        )

    # Delete DNS record from Netlify
    base_domain = get_settings().BASE_DOMAIN
    zone_id = netlify.get_zone_id_by_domain(base_domain)
    if zone_id:
        record_id = netlify.get_record_id_by_subdomain(
            zone_id, f"{subdomain_instance.subdomain}.{base_domain}"
        )
        if record_id:
            netlify.remove_dns_record(zone_id, record_id)

    # Delete from database
    db.delete(subdomain_instance)
    db.commit()

    return None
