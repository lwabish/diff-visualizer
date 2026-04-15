import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const isUserOrOrgPagesSite = repositoryName?.endsWith('.github.io')

// https://vite.dev/config/
export default defineConfig({
  base:
    isGitHubActions && repositoryName && !isUserOrOrgPagesSite
      ? `/${repositoryName}/`
      : '/',
  plugins: [react(), tailwindcss()],
})
