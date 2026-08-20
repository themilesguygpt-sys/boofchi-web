# Deployment

- GitHub (`themilesguygpt-sys/boofchi-web`) is the source-control repository.
- `Desktop/boofchi-web` is the primary permanent local working copy and local backup.
- Cloudflare will later host the client-facing demo; no deployment or production credentials are configured yet.
- Production hosting details and the public domain will be decided after client approval.

Keep runtime code portable and avoid unnecessary Node-specific APIs or provider lock-in. Cloudflare adapter and caching details should be selected only when deployment requirements are confirmed.
