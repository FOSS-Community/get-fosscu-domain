from typing import Any, Dict, List, Optional, Tuple

import httpx


class Netlify:
    def __init__(self, access_token: str):
        """
        Initialize the checker with your Netlify personal access token
        Args:
            access_token (str): Your Netlify personal access token
        """
        self.base_url = "https://api.netlify.com/api/v1"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

    def get_dns_zones(self) -> List[Dict[str, Any]]:
        """
        Get all DNS zones associated with your account
        Returns:
            List[Dict[str, Any]]: List of DNS zones
        """
        try:
            response = httpx.get(f"{self.base_url}/dns_zones", headers=self.headers)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            print(f"Error fetching DNS zones: {str(e)}")
            return []

    def get_zone_id_by_domain(self, domain: str) -> Optional[str]:
        """
        Get the DNS zone ID for a specific domain
        Args:
            domain (str): The domain name to look up
        Returns:
            Optional[str]: The zone ID if found, None otherwise
        """
        try:
            zones = self.get_dns_zones()
            for zone in zones:
                if zone.get("name") == domain:
                    return zone.get("id")
            return None
        except Exception as e:
            print(f"Error getting zone ID for domain {domain}: {str(e)}")
            return None

    def get_site_info(self) -> List[dict]:
        """
        Get all sites and their custom domains owned by the user
        Returns:
            List[dict]: List of site information including domains
        """
        try:
            response = httpx.get(f"{self.base_url}/sites", headers=self.headers)
            response.raise_for_status()
            sites = response.json()
            # Filter sites with custom domains
            sites_with_domains = []
            for site in sites:
                # Custom domains are directly available in the site object
                custom_domain = site.get("custom_domain")
                if custom_domain:
                    sites_with_domains.append(
                        {
                            "name": site["name"],
                            "domain": custom_domain,
                            "url": site["url"],
                        }
                    )
            return sites_with_domains
        except httpx.RequestError as e:
            print(f"Error fetching sites: {str(e)}")
            return []

    def check_subdomain(self, subdomain: str, domain: str) -> Tuple[bool, str]:
        """
        Check if a subdomain is available for your custom domain
        Args:
            subdomain (str): The subdomain to check
            domain (str): Your custom domain
        Returns:
            Tuple[bool, str]: (is_available, message)
        """
        full_domain = f"{subdomain}.{domain}"
        try:
            # First try DNS resolution through a HEAD request
            response = httpx.head(
                f"https://{full_domain}", timeout=5, allow_redirects=True
            )
            return False, f"Subdomain '{full_domain}' is already in use."
        except httpx.RequestError:
            try:
                # Double check with HTTP in case HTTPS is not configured
                response = httpx.head(
                    f"http://{full_domain}", timeout=5, allow_redirects=True
                )
                return (
                    False,
                    f"Subdomain '{full_domain}' is already in use (HTTP only).",
                )
            except httpx.RequestError:
                return True, f"Subdomain '{full_domain}' appears to be available!"

    def create_dns_record(
        self,
        zone_id: str,
        record_type: str,
        hostname: str,
        value: str,
        ttl: int = 3600,
        priority: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Create a new DNS record for a domain
        Args:
            zone_id (str): The DNS zone ID
            record_type (str): DNS record type (A, CNAME, MX, TXT, etc.)
            hostname (str): The hostname for the record
            value (str): The value for the record
            ttl (int, optional): Time to live in seconds. Defaults to 3600.
            priority (int, optional): Priority for MX records. Defaults to None.
        Returns:
            Dict[str, Any]: The created DNS record information
        """
        try:
            payload = {
                "type": record_type.upper(),
                "hostname": hostname,
                "value": value,
                "ttl": ttl,
            }

            if priority is not None and record_type.upper() == "MX":
                payload["priority"] = priority

            response = httpx.post(
                f"{self.base_url}/dns_zones/{zone_id}/dns_records",
                headers=self.headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            print(f"Error creating DNS record: {str(e)}")
            return {}

    def get_record_id_by_subdomain(self, zone_id: str, subdomain: str) -> Optional[str]:
        """
        Get the DNS record ID for a specific subdomain
        Args:
            zone_id (str): The DNS zone ID
            subdomain (str): The subdomain name to look up (without the domain)
        Returns:
            Optional[str]: The record ID if found, None otherwise
        """
        try:
            # Get all DNS records for the zone
            response = httpx.get(
                f"{self.base_url}/dns_zones/{zone_id}/dns_records", headers=self.headers
            )
            response.raise_for_status()
            records = response.json()

            # Look for the record matching the subdomain
            for record in records:
                # The hostname in the record might be either just the subdomain
                # or the full domain name (subdomain.domain.com)
                hostname = record.get("hostname", "")
                if hostname == subdomain or hostname.startswith(f"{subdomain}."):
                    return record.get("id")

            return None
        except httpx.RequestError as e:
            print(f"Error getting record ID for subdomain {subdomain}: {str(e)}")
            return None

    def update_dns_record(
        self,
        zone_id: str,
        record_id: str,
        record_type: str,
        hostname: str,
        value: str,
        ttl: int = 3600,
        priority: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Update an existing DNS record
        Args:
            zone_id (str): The DNS zone ID
            record_id (str): The DNS record ID to update
            record_type (str): DNS record type (A, CNAME, MX, TXT, etc.)
            hostname (str): The hostname for the record
            value (str): The value for the record
            ttl (int, optional): Time to live in seconds. Defaults to 3600.
            priority (int, optional): Priority for MX records. Defaults to None.
        Returns:
            Dict[str, Any]: The updated DNS record information
        """
        try:
            payload = {
                "type": record_type.upper(),
                "hostname": hostname,
                "value": value,
                "ttl": ttl,
            }

            if priority is not None and record_type.upper() == "MX":
                payload["priority"] = priority

            response = httpx.put(
                f"{self.base_url}/dns_zones/{zone_id}/dns_records/{record_id}",
                headers=self.headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as e:
            print(f"Error updating DNS record: {str(e)}")
            return {}

    def remove_dns_record(self, zone_id: str, record_id: str) -> bool:
        """
        Remove a DNS record
        Args:
            zone_id (str): The DNS zone ID
            record_id (str): The DNS record ID to remove
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            response = httpx.delete(
                f"{self.base_url}/dns_zones/{zone_id}/dns_records/{record_id}",
                headers=self.headers,
            )
            response.raise_for_status()
            return True
        except httpx.RequestError as e:
            print(f"Error removing DNS record: {str(e)}")
            return False
