# FOSSCU Domain

Get a subdomain under fosscu.org for your next amazing projects.

## Feedback and Support

If you'd like to give feedback or need support, please see our [discord](https://discord.com/invite/hJ2utJX2j5).

## Get started

You can use docker to run it locally for development purpose

### With Docker

This is the recommended and only supported method of developing FOSSCU Subdomain Checker.

**Note** - You'll need `NETLIFY_ACCESS_KEY` value in `.env` in order to run this project, you can get in via [Netlfiy Docs](https://docs.netlify.com/api/get-started/)

```bash
git clone https://github.com/FOSS-Community/fosscu-subdomain-checker
cp fosscu-subdomain-checker/app/.env.example fosscu-subdomain-checker/app/.env
cd fosscu-subdomain-checker
docker-compose up -d --build
```

* Frontend can be accessed via: <http://0.0.0.0:8020>
* Backend can be accessed via: <http://0.0.0.0:5173>



## Contributing

Contributions are very welcome. Please lint/format code before creating PRs.

