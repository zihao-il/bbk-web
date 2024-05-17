import {createI18n} from 'vue-i18n';
import zh from './src/zh';
import en from './src/en';

let i18n;

const createI18nInstance = (locale) => {
    i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: locale,
        fallbackLocale: 'zh',
        messages: {
            zh,
            en
        }
    });
    return i18n;
};

const setLocale = (locale) => {
    if (i18n) {
        i18n.global.locale.value = locale;
    }
};

export {createI18nInstance, setLocale};
