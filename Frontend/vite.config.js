import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      include: ["**/*.jsx", "**/*.js"], // Handles .js and .jsx
    }),
  ],
  esbuild: {
    loader: "jsx",
    include: [/src\/.*\.js$/, /src\/.*\.jsx$/], // ✅ Add .jsx here
  },
});
