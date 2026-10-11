// @ts-check
import { defineConfig } from 'astro/config';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
	base: process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/',
});
