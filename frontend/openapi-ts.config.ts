import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: 'fetch',
  input: 'http://localhost:8000/openapi.json',
  output: {
    path: 'src/api/client',
    format: 'prettier',
    clean: true,
  },
  plugins: ['@tanstack/react-query'],
})
