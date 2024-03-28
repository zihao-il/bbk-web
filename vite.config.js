import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import {VarletUIResolver} from 'unplugin-vue-components/resolvers'
import viteCompression from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
        viteCompression(),
        components({
            resolvers: [VarletUIResolver()]
        }), autoImport({
            resolvers: [VarletUIResolver({autoImport: true})]
        })],
    base: '/',
    server: {
        host: '0.0.0.0',
        proxy: {
            "/api": {
                target: 'http://bbk.endyun.ltd:9000/',
                changeOrigin: true,
            },
        }

    },
})
