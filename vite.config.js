import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import {VarletImportResolver} from '@varlet/import-resolver'
import viteCompression from "vite-plugin-compression2";
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
        viteCompression(),
        Sitemap({
            hostname: 'https://127.0.0.1/',  //你的域名
            robots: [{
                userAgent: '*',
                allow: '/',
                crawlDelay: 300
            }],
        }),
        components({
            resolvers: [VarletImportResolver()]
        }), autoImport({
            resolvers: [VarletImportResolver({autoImport: true})]
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
