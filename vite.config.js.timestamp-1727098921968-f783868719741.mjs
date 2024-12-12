// vite.config.js
import { defineConfig } from "file:///D:/Office%20Work/ExergyHRM_frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Office%20Work/ExergyHRM_frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///D:/Office%20Work/ExergyHRM_frontend/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "D:\\Office Work\\ExergyHRM_frontend";
var BASE_URL = "http://122.248.194.140:8081";
var SUB_API_NAME = "/ExergyHRM";
var vite_config_default = defineConfig({
  base: SUB_API_NAME,
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      },
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await fs.readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  plugins: [svgr(), react()],
  define: {
    "import.meta.env.VITE_API_DOMAIN": JSON.stringify(BASE_URL),
    "import.meta.env.VITE_SUB_API_NAME": JSON.stringify(SUB_API_NAME)
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxPZmZpY2UgV29ya1xcXFxFeGVyZ3lIUk1fZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE9mZmljZSBXb3JrXFxcXEV4ZXJneUhSTV9mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovT2ZmaWNlJTIwV29yay9FeGVyZ3lIUk1fZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgc3ZnciBmcm9tICdAc3Znci9yb2xsdXAnO1xyXG5cclxuLy8gRGVmaW5lIHlvdXIgYmFzZSBVUkwgYW5kIHN1YiBVUkwgaGVyZVxyXG5jb25zdCBCQVNFX1VSTCA9ICdodHRwOi8vMTIyLjI0OC4xOTQuMTQwOjgwODEnO1xyXG5jb25zdCBTVUJfQVBJX05BTUUgPSAnL0V4ZXJneUhSTSc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6IFNVQl9BUElfTkFNRSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBzcmM6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZXNidWlsZDoge1xyXG4gICAgbG9hZGVyOiAnanN4JyxcclxuICAgIGluY2x1ZGU6IC9zcmNcXC8uKlxcLmpzeD8kLyxcclxuICAgIGV4Y2x1ZGU6IFtdLFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICAnLmpzJzogJ2pzeCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgc2V0dXAoYnVpbGQpIHtcclxuICAgICAgICAgICAgYnVpbGQub25Mb2FkKHsgZmlsdGVyOiAvc3JjXFxcXC4qXFwuanMkLyB9LCBhc3luYyAoYXJncykgPT4gKHtcclxuICAgICAgICAgICAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnRzOiBhd2FpdCBmcy5yZWFkRmlsZShhcmdzLnBhdGgsICd1dGY4JyksXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbc3ZncigpLCByZWFjdCgpXSxcclxuICBkZWZpbmU6IHtcclxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9BUElfRE9NQUlOJzogSlNPTi5zdHJpbmdpZnkoQkFTRV9VUkwpLFxyXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX1NVQl9BUElfTkFNRSc6IEpTT04uc3RyaW5naWZ5KFNVQl9BUElfTkFNRSksXHJcbiAgfSxcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UixTQUFTLG9CQUFvQjtBQUMxVCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU96QyxJQUFNLFdBQVc7QUFDakIsSUFBTSxlQUFlO0FBR3JCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUM7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTSxPQUFPO0FBQ1gsa0JBQU0sT0FBTyxFQUFFLFFBQVEsZUFBZSxHQUFHLE9BQU8sVUFBVTtBQUFBLGNBQ3hELFFBQVE7QUFBQSxjQUNSLFVBQVUsTUFBTSxHQUFHLFNBQVMsS0FBSyxNQUFNLE1BQU07QUFBQSxZQUMvQyxFQUFFO0FBQUEsVUFDSjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQUEsRUFDekIsUUFBUTtBQUFBLElBQ04sbUNBQW1DLEtBQUssVUFBVSxRQUFRO0FBQUEsSUFDMUQscUNBQXFDLEtBQUssVUFBVSxZQUFZO0FBQUEsRUFDbEU7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
