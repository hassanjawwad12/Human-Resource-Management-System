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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxPZmZpY2UgV29ya1xcXFxFeGVyZ3lIUk1fZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE9mZmljZSBXb3JrXFxcXEV4ZXJneUhSTV9mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovT2ZmaWNlJTIwV29yay9FeGVyZ3lIUk1fZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgc3ZnciBmcm9tICdAc3Znci9yb2xsdXAnO1xyXG5cclxuLy9sb2NhbCBob3N0IGxpbmtcclxuLy9jb25zdCBCQVNFX1VSTCA9ICdodHRwOi8vMTkyLjE2OC4yNC4xNjI6ODA4MSc7XHJcbi8vY29uc3QgQkFTRV9VUkwgPSAnaHR0cDovLzE5Mi4xNjguMjQuMTQzOjgwODEnO1xyXG5cclxuLy9saXZlIGxpbmtcclxuY29uc3QgQkFTRV9VUkwgPSAnaHR0cDovLzEyMi4yNDguMTk0LjE0MDo4MDgxJztcclxuY29uc3QgU1VCX0FQSV9OQU1FID0gJy9FeGVyZ3lIUk0nO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiBTVUJfQVBJX05BTUUsXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgc3JjOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGVzYnVpbGQ6IHtcclxuICAgIGxvYWRlcjogJ2pzeCcsXHJcbiAgICBpbmNsdWRlOiAvc3JjXFwvLipcXC5qc3g/JC8sXHJcbiAgICBleGNsdWRlOiBbXSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgJy5qcyc6ICdqc3gnLFxyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogJ2xvYWQtanMtZmlsZXMtYXMtanN4JyxcclxuICAgICAgICAgIHNldHVwKGJ1aWxkKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkLm9uTG9hZCh7IGZpbHRlcjogL3NyY1xcXFwuKlxcLmpzJC8gfSwgYXN5bmMgKGFyZ3MpID0+ICh7XHJcbiAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcclxuICAgICAgICAgICAgICBjb250ZW50czogYXdhaXQgZnMucmVhZEZpbGUoYXJncy5wYXRoLCAndXRmOCcpLFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW3N2Z3IoKSwgcmVhY3QoKV0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0RPTUFJTic6IEpTT04uc3RyaW5naWZ5KEJBU0VfVVJMKSxcclxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9TVUJfQVBJX05BTUUnOiBKU09OLnN0cmluZ2lmeShTVUJfQVBJX05BTUUpLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZSLFNBQVMsb0JBQW9CO0FBQzFULE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBV3pDLElBQU0sV0FBVztBQUNqQixJQUFNLGVBQWU7QUFHckIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ1o7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ04sT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDWCxrQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsY0FDeEQsUUFBUTtBQUFBLGNBQ1IsVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLFlBQy9DLEVBQUU7QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFBQSxFQUN6QixRQUFRO0FBQUEsSUFDTixtQ0FBbUMsS0FBSyxVQUFVLFFBQVE7QUFBQSxJQUMxRCxxQ0FBcUMsS0FBSyxVQUFVLFlBQVk7QUFBQSxFQUNsRTtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
