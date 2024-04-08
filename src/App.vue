<script setup>
import Index from './components/index.vue'
import {StyleProvider, Themes} from '@varlet/ui'
import {onBeforeMount, ref} from 'vue';


const show = ref(false)
const colorValue = ref(null)
const md2Color = ref('');
const md2DColor = ref('');
const md3Color = ref('');
const md3DColor = ref('');

const setTheme = (color) => {
    window.localStorage.setItem("ThemeColor", color)
    const rootStyle = document.documentElement.style
    rootStyle.setProperty('--color-primary', color)

}


const setThemeMod = () => {
    let themeMod = window.localStorage.getItem("ThemeMod")
    if (themeMod) {
        ThemeMod(themeMod, false)
    }
}

const setThemeColor = () => {
    let ThemeColor = window.localStorage.getItem("ThemeColor")
    if (ThemeColor) {
        setTheme(ThemeColor)
    }
}


onBeforeMount(() => {
    setThemeMod()
    setThemeColor()
})
const openMC = () => {
    window.location.href = "minecraft://";
}


const ThemeMod = (mod, isClear) => {
    md2DColor.value = md2Color.value = md3Color.value = md3DColor.value = '';
    switch (mod) {
        case 'Md2亮色':
            StyleProvider(null);
            md2Color.value = 'themeAct-color'
            break
        case 'Md2暗色':
            StyleProvider(Themes.dark);
            md2DColor.value = 'themeAct-color'
            break
        case 'Md3亮色':
            StyleProvider(Themes.md3Light);
            md3Color.value = 'themeAct-color'
            break
        case 'Md3暗色':
            StyleProvider(Themes.md3Dark);
            md3DColor.value = 'themeAct-color'
            break
    }
    window.localStorage.setItem("ThemeMod", mod)
    if (isClear) {
        window.localStorage.removeItem('ThemeColor')
    }

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

            <var-menu placement="bottom" :offset-y="6" :offset-x="-15">
                <var-button-group block text type="primary">

                    <var-icon name="palette" :size="24"/>
                    <var-icon name="chevron-down" :size="24"/>

                </var-button-group>

                <template #menu>
                    <var-cell :class="md2Color" @click="ThemeMod('Md2亮色',true)" ripple>Md2亮色</var-cell>
                    <var-cell :class="md2DColor" @click="ThemeMod('Md2暗色',true)" ripple>Md2暗色</var-cell>
                    <var-cell :class="md3Color" @click="ThemeMod('Md3亮色',true)" ripple>Md3亮色</var-cell>
                    <var-cell :class="md3DColor" @click="ThemeMod('Md3暗色',true)" ripple>Md3暗色</var-cell>

                </template>
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
            <p>版本：1.16</p>
            <div class="set-color">
            <span v-for="c in ['#3A7AFE','#A5E68A','#E67A7A','#FBD3BB','#D8B6EB','#F9C0C9','#A2D4E6']">
            <var-chip :round="false" :color='c' @click="setTheme(c)"></var-chip>
            </span>
            </div>
            <div class="diy-color">
                <var-input placeholder="自定义颜色"
                           :rules="[(v) => /^#[a-fA-F0-9]{6}$/.test(v)  || '格式错误！例如：#000000']"
                           v-model="colorValue">
                    <template #append-icon>
                        <var-chip :round="false" :color='colorValue' @click="setTheme(colorValue)"></var-chip>

                    </template>
                </var-input>
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

.diy-color {
    margin-top: 5px;
    margin-bottom: 10px;
}

.var-button-group {
    border-radius: 8px;
    padding: 5px;

}

.var-button-group:hover {
    background-color: rgba(255, 255, 255, .2);
}

.var-button-group {
    box-shadow: none;
}


.var-menu {
    text-align: center;

}

.themeAct-color {
    color: var(--color-primary);
}
</style>
