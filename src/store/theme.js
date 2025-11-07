import {defineStore} from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        ThemeMod: "Md3亮色",
        ThemeColor: "",
        language: "zh",

    }),
    actions: {
        setThemeMod(data) {
            this.ThemeMod = data
        },
        setThemeColor(data) {
            this.ThemeColor = data
        },
        setLanguage(data) {
            this.language = data
        },
    },
    persist: {
        key: 'ThemeData',
    },
})

