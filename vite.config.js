import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 4000,
    watch: {
      ignored: [
        "**/ui/**",
        "**/docs/public/**",
        "**/dist/**",
        "**/playwright-report/**",
        "**/test-results/**",
      ],
    },
    proxy: {
      "/mock": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mock/, ""),
      },
    },
  },
});
