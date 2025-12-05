import { defineConfig } from "vite";

export default defineConfig({
    server: {
        cors: {
            origin: "http://localhost:8000"
        }
    }
})