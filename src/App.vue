<script setup>
import Index from './components/index.vue'
import {StyleProvider, Themes} from '@varlet/ui'
import {onBeforeMount, ref} from 'vue';
import {useThemeStore} from "./store/theme.js";
import {setLocale} from "./lang/index.js"

const store = useThemeStore()


const show = ref(false)
const colorValue = ref(null)
const md2Color = ref('themeAct-color');
const md2DColor = ref('');
const md3Color = ref('');
const md3DColor = ref('');
const langBtnZh = ref('themeAct-color');
const langBtnEh = ref('');

const setTheme = (color) => {
    store.setThemeColor(color)
    const rootStyle = document.documentElement.style
    rootStyle.setProperty('--color-primary', color)

}


const setThemeMod = () => {
    let themeMod = store.ThemeMod
    if (themeMod) {
        ThemeMod(themeMod, false)
    }
}

const setThemeColor = () => {
    let ThemeColor = store.ThemeColor
    if (ThemeColor) {
        setTheme(ThemeColor)
    }
}

const setInitLang = () => {
    let language = store.language
    if (language) {
        setLang(language)
    }
}


const setLang = (lang) => {
    store.setLanguage(lang)
    setLocale(lang)
    langBtnZh.value = langBtnEh.value = ""
    if (lang === 'zh') {
        langBtnZh.value = 'themeAct-color'
    } else {
        langBtnEh.value = 'themeAct-color'

    }
}

onBeforeMount(() => {
    setThemeMod()
    setThemeColor()
    setInitLang()
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
    store.setThemeMod(mod)
    if (isClear) {
        store.setThemeColor("")
    }

}

</script>

<template>
    <var-app-bar :title="$t('language.title')" fixed placeholder safe-area-top title-position="center">
        <template #left>
            <var-button
                color="transparent"
                round
                text
                text-color="#fff"
                @click="show = true"
            >
                <var-icon :size="24" name="github"/>
            </var-button>
        </template>

        <template #right>
            <var-menu :offset-x="0" :offset-y="6" class="langMenu" placement="bottom">
                <var-button-group block text type="primary">
                    <var-icon :size="24" name="translate"/>
                    <var-icon :size="24" name="chevron-down"/>
                </var-button-group>
                <template #menu>
                    <var-cell :class="langBtnZh" class="t-center" ripple @click="setLang('zh')">中文</var-cell>
                    <var-cell :class="langBtnEh" ripple @click="setLang('en')">English</var-cell>
                </template>
            </var-menu>

            <var-menu :offset-x="-15" :offset-y="6" placement="bottom">
                <var-button-group block text type="primary">
                    <var-icon :size="24" name="palette"/>
                    <var-icon :size="24" name="chevron-down"/>
                </var-button-group>
                <template #menu>
                    <var-cell :class="md2Color" ripple @click="ThemeMod('Md2亮色',true)">{{
                            $t('language.md2_light')
                        }}
                    </var-cell>
                    <var-cell :class="md2DColor" ripple @click="ThemeMod('Md2暗色',true)">{{
                            $t('language.md2_dark')
                        }}
                    </var-cell>
                    <var-cell :class="md3Color" ripple @click="ThemeMod('Md3亮色',true)">{{
                            $t('language.md3_light')
                        }}
                    </var-cell>
                    <var-cell :class="md3DColor" ripple @click="ThemeMod('Md3暗色',true)">{{
                            $t('language.md3_dark')
                        }}
                    </var-cell>
                </template>
            </var-menu>
        </template>
    </var-app-bar>
    <Index/>

    <var-overlay v-model:show="show">
        <div class="overlay-content" @click.stop>
            <p>
                {{ $t('language.open_source') }}
                <var-link href="https://github.com/zihao-il/bbk-web" target="_blank" type="primary"
                          underline="none">GitHub
                </var-link>
            </p>
            <p>By：zihao_il</p>
            <p>版本：1.20</p>
            <div class="set-color">
            <span v-for="c in ['#3A7AFE','#A5E68A','#E67A7A','#FBD3BB','#D8B6EB','#F9C0C9','#A2D4E6']">
            <var-chip :color='c' :round="false" @click="setTheme(c)"></var-chip>
            </span>
            </div>
            <div class="diy-color">
                <var-input v-model="colorValue"
                           :placeholder="$t('language.custom_color')"
                           :rules="[(v) => /^#[a-fA-F0-9]{6}$/.test(v)  || $t('language.incorrect_format')]">
                    <template #append-icon>
                        <var-chip :color='colorValue' :round="false" @click="setTheme(colorValue)"></var-chip>

                    </template>
                </var-input>
            </div>
            <div class="spacing-box">
                {{ $t('language.horizontal_spacing') }}
                <var-slider v-model="store.Spacing" max="24" min="13"/>
            </div>
            <div class="vertical-box">
                {{ $t('language.vertical_spacing') }}
                <var-slider v-model="store.Vertical" max="100" min="0"/>
            </div>
            <var-button
                block
                class="fixed-button"
                round
                type="primary"
                @click="openMC"
            >
                {{ $t('language.mc_start') }}
            </var-button>
        </div>
    </var-overlay>
</template>

<style scoped>
.overlay-content {
    width: 250px;
    padding: 20px 24px;
    background: var(--button-default-color);
}


.fixed-button {
    font-size: 0.8em;
    margin-top: 0.5em;
    padding: 0.5em 0.5em;
    border-radius: 10px;
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
    padding: 5px;
    border-radius: 8px;

}

.var-button-group:hover {
    background-color: rgba(255, 255, 255, .2);
}

.var-button-group {
    box-shadow: none;
}

.t-center {
    text-align: center;
}


.themeAct-color {
    color: var(--color-primary);
}

.langMenu {
    margin-right: 5px;
}

</style>
