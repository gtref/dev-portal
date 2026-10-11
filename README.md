# Dev Portal

Dev Portal is a static Astro site backed by Supabase Auth and Postgres.

## Local development

1. Copy `.env.example` to `.env` and set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` from Supabase project settings.
2. Install packages with `npm ci`.
3. Run the schema migration using the Supabase CLI:

	```sh
	npx --yes supabase@latest login
	npx --yes supabase@latest link --project-ref YOUR_PROJECT_REF
	npx --yes supabase@latest db push
	```

	The migration creates `public.profiles` and applies its RLS policies. It is also applied automatically by the deployment workflow.
4. Start the site with `npm run dev`.

## GitHub Pages deployment

The workflow deploys on pushes to `main` or `master`. In the repository, set these under **Settings > Secrets and variables > Actions**:

Repository variables:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_GITHUB_REDIRECT_URL` (optional; defaults to the Pages callback URL)

Repository secrets:

- `SUPABASE_ACCESS_TOKEN` (a Supabase personal access token)
- `SUPABASE_DB_PASSWORD` (the database password for the project)

Enable **Settings > Pages > Build and deployment > GitHub Actions**. The workflow applies pending Supabase migrations before building the static site.

## GitHub OAuth

Enable GitHub under **Supabase Dashboard > Authentication > Sign In / Providers** and add the GitHub OAuth application's client ID and secret there. Set the GitHub OAuth application's callback URL to the Supabase Auth callback shown in that provider's settings. Add `https://gtref.github.io/dev-portal/callback` to Supabase's allowed redirect URLs.
