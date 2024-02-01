<script setup>
import Index from './components/index.vue'
import {StyleProvider, Themes} from '@varlet/ui'
import {onBeforeMount, ref} from 'vue';

let currentTheme = null
const darkMode = ref(false);
const show = ref(false)

function toggleTheme() {
    currentTheme = currentTheme ? null : Themes.dark
    darkMode.value = !darkMode.value;
    StyleProvider(currentTheme)
}

const setTheme = (color) => {
    window.localStorage.setItem("ThemeColor", color)
    const rootStyle = document.documentElement.style
    rootStyle.setProperty('--color-primary', color)

}


onBeforeMount(() => {
    let themeColor = window.localStorage.getItem("ThemeColor")
    if (themeColor) {
        setTheme(themeColor)
    }

})
const openMC = () => {
    window.location.href = "minecraft://";
}
</script>

<template>
    <var-app-bar title="MC版本库" title-position="center">
        <template #left>
            <var-button
                color="transparent"
                text-color="#fff"
                round
                text
                @click="show = true"
            >
                <var-icon name="github" :size="24"/>
            </var-button>
        </template>

        <template #right>
            <var-menu>
                <var-button
                    color="transparent"
                    text-color="#fff"
                    round
                    text
                    @click="toggleTheme"
                >
                    <var-icon :name="darkMode ? 'weather-night' : 'white-balance-sunny'" :size="24"/>
                </var-button>
            </var-menu>
        </template>
    </var-app-bar>
    <Index/>

    <var-overlay v-model:show="show">
        <div class="overlay-content" @click.stop>
            <p>
                开源地址：
                <var-link type="primary" href="https://github.com/zihao-il/bbk-web" target="_blank"
                          underline="none">GitHub
                </var-link>
            </p>
            <p>by：zihao_il</p>
            <p>版本：1.13</p>
            <div class="set-color">
            <span v-for="c in ['#3A7AFE','#A5E68A','#E67A7A','#FBD3BB','#D8B6EB','#F9C0C9','#A2D4E6']">
            <var-chip :round="false" :color='c' @click="setTheme(c)"></var-chip>
            </span>
            </div>
            <var-button
                class="fixed-button"
                round
                block
                type="primary"
                @click="openMC"
            >
                MC启动！
            </var-button>
        </div>
    </var-overlay>
</template>

<style scoped>
.overlay-content {
    padding: 20px 24px;
    width: 250px;
    background: var(--button-default-color);
}

.var-app-bar {
    position: sticky;
    top: 0;
    z-index: 99;
}

.fixed-button {
    border-radius: 10px;
    font-size: 0.8em;
    padding: 0.5em 0.5em;
    margin-top: 0.5em;
}

.set-color {
    display: flex;
    justify-content: space-between;

}

</style>
