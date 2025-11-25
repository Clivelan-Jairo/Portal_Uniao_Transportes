import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      /* Proxy para desenvolvimento: encaminha chamadas locais /api/trackingdest
         para o endpoint externo https://ssw.inf.br/api/trackingdest, evitando
         problemas de CORS durante o desenvolvimento. */
      '/api/trackingdest': {
        target: 'https://ssw.inf.br',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/trackingdest/, '/api/trackingdest')
      },
    },
  },
})
