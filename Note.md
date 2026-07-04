## Deployment Notes

- Configure Railway PostgreSQL environment variables.
- Set FRONTEND_URL, APP_URL, and SANCTUM_STATEFUL_DOMAINS.
- Use Vercel rewrites so authenticated requests are same-origin.
- Reseed production after updating demo users.