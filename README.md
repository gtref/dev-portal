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

## Enabling GitHub OAuth in Supabase

If you see `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`, GitHub sign-in has not been enabled in your Supabase project dashboard yet.

Follow these steps to configure GitHub OAuth:

1. **Create a GitHub OAuth App**:
   - Go to GitHub -> **Settings** -> **Developer settings** -> **OAuth Apps** -> **New OAuth App**.
   - Set **Application name** to `Dev Portal`.
   - Set **Homepage URL** to your site URL (e.g., `http://localhost:4321` or `https://gtref.github.io/dev-portal/`).
   - Copy your Supabase Auth Callback URL from the Supabase Dashboard (found under **Authentication > Providers > GitHub**).
   - Set **Authorization callback URL** in GitHub to the Supabase Auth Callback URL (e.g. `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`).
   - Click **Register application**.
   - Generate and copy a **Client Secret**, and copy the **Client ID**.

2. **Enable GitHub Provider in Supabase**:
   - Go to your **Supabase Dashboard** -> **Authentication** -> **Providers**.
   - Select **GitHub** under OAuth Providers.
   - Toggle **Enable GitHub provider** to ON.
   - Paste your GitHub **Client ID** and **Client Secret**.
   - Click **Save**.

3. **Configure Allowed Redirect URLs in Supabase**:
   - Under **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
   - Add your application callback URL to **Redirect URLs**:
     - Local dev: `http://localhost:4321/callback/`
     - Production / GitHub Pages: `https://gtref.github.io/dev-portal/callback`

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
