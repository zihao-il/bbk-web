import {defineStore} from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        ThemeMod: "Md2亮色",
        ThemeColor: ""
    }),
    actions: {
        setThemeMod(data) {
            this.ThemeMod = data
        },
        setThemeColor(data) {
            this.ThemeColor = data
        }
    },
    persist: {
        key: 'ThemeData',
    },
})

