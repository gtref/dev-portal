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

## Why GitHub OAuth redirected to `http://localhost:3000`

By default, new Supabase projects set the **Site URL** setting to `http://localhost:3000`.

When Supabase processes OAuth sign-in (`signInWithOAuth`), it compares the requested `redirectTo` URL against the allowed **Redirect URLs** list in your Supabase project settings. If the `redirectTo` URL is **not whitelisted** under **Authentication > URL Configuration**, Supabase ignores the invalid URL and falls back to redirecting the user to your default **Site URL** (`http://localhost:3000`).

### How to fix it in Supabase Dashboard

To ensure Supabase redirects to your actual app (`https://gtref.github.io/dev-portal/callback/` or `http://localhost:4321/callback/`):

1. Go to **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. **Site URL**: Update this to your deployed site URL (e.g. `https://gtref.github.io/dev-portal/` or `http://localhost:4321/`).
3. **Redirect URLs**: Add all allowed callback URLs:
   - `https://gtref.github.io/dev-portal/callback/`
   - `https://gtref.github.io/dev-portal/callback`
   - `http://localhost:4321/callback/`
   - `http://localhost:4321/callback`
4. Click **Save**.

## Enabling GitHub OAuth in Supabase

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
