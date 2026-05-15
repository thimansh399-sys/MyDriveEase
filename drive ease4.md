# TODO

## Module script MIME type fix (Vercel)
- [x] Confirm Vite build outputs correct module JS under `dist/assets/*`.
- [x] Find the likely cause: `frontend/vercel.json` rewrite sends ALL paths (including asset/module requests) to `/index.html`, which is served as `text/html`.
- [ ] Update `frontend/vercel.json` to avoid rewriting asset/module requests.
- [ ] Redeploy to Vercel and hard refresh.

