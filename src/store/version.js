import {defineStore} from 'pinia'

export const useVersionStore = defineStore('version', {
    state: () => ({
        isBeta: "",
        Release: "",
        Beta: "",
        version: "",
    }),
    actions: {
        setIsBeta(data) {
            this.isBeta = data
        },
        setRelease(data) {
            this.Release = data
        },
        setBeta(data) {
            this.Beta = data
        },
        setVersion(data) {
            this.version = data
        },
    },
    persist: {
        key: 'TempData',
        storage: sessionStorage,
    },
})

