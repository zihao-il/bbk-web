<script setup>
import {get_version, search_version} from "../api/index.js";
import {onMounted, reactive, ref} from "vue";
import {ActionSheet, Snackbar} from "@varlet/ui";
import {useVersionStore} from "../store/version.js";
import {useI18n} from 'vue-i18n';

const store = useVersionStore()
const {t} = useI18n();


const mcList = reactive([]);
const newMcList = reactive([]);
const searchValue = ref('')
let mSearch = ref(true)
const loading = ref(false)
const finished = ref(false)
const isBeta = ref(0)
let newCard = ref("")
let errorPop = ref(false)
const skeletonLoading = ref(true)
const show = ref(true)
const NewRelease = ref('');
const NewBeta = ref('');

async function getMcData(d, b, s) {
    let vData
    if (s === true) {
        const {data} = await search_version(d)
        if (data.status === 201) {
            return Snackbar.error(t('language.no_version'))

        }
        vData = data.message

    } else {

        try {
            const {data} = await get_version(d)
            vData = data.message
        } catch (e) {
            errorPop.value = true
            loading.value = false
            finished.value = true
            return
        }
    }
    if (b === true) {
        //重新刷新数据
        mcList.splice(0, mcList.length, ...vData)

    } else {
        //累加数据
        mcList.push(...vData);

    }

}

const Init = () => {

    switch (isBeta.value) {
        case "全版本":
        case 0:
            store.setVersion(store.Beta)
            break;
        case "正式版":
        case 1 :
            store.setVersion(store.Release)
            break;
        case "测试版":
        case 2 :
            store.setVersion(store.Beta)
            break;
    }

}

async function getLastData() {
    let vData

    const {data} = await get_version({"v": "larversion"})
    if (data.status === 201) {
        return Snackbar.error(t('language.fail_version'))
    } else {
        vData = data.message
        store.setIsBeta("")
        store.setRelease(vData[0].Release)
        store.setBeta(vData[0].Beta)
        skeletonLoading.value = false

    }

}


async function getNewMcList() {

    const {data} = await get_version({"v": "last"})
    newMcList.splice(0, mcList.length, ...data.message)
    for (let li of newMcList) {
        if (li.is_beta === 0) {
            NewRelease.value = t('language.latest_release', {version: li.version});
        } else {
            NewBeta.value = t('language.latest_beta', {version: li.version});
        }
    }
    // console.log(newMcList)


}

onMounted(() => {
    getLastData()
    getNewMcList()
    let intervalId = setInterval(function () {
        let betaValue = store.Beta;
        if (betaValue !== "") {
            clearInterval(intervalId);
            getMcData({"v": betaValue});
            store.setVersion(betaValue)
        }
    }, 100);
    window.scrollTo(0, 0);
});


function mSwitch() {
    mSearch.value = mSearch.value === false;
}

function searchInput() {
    let m
    let b
    switch (isBeta.value) {
        case "全版本":
            b = '2'
            break;
        case "正式版":
            b = '0'
            break;
        case "测试版":
            b = '1'
            break;
    }
    if (searchValue.value !== "") {
        if (searchValue.value.split('.')[1]) {

            if (mSearch.value === true) {
                m = '1'
            } else {
                m = '0'
            }

            newCard.value = "new-card"
            getMcData({"s": searchValue.value, "m": m, "b": b}, true, true)
            loading.value = false
            finished.value = true
        }
    } else {
        newCard.value = ""
        Init()
        getMcData({"v": store.version, "b": b}, true, false)
        loading.value = true
        finished.value = false
        load()
    }


}


const setItem = (B, D) => {
    let v = ""
    switch (D) {
        case "Beta":
            v = store.Beta
            break
        case "Release":
            v = store.Release
            break
    }
    store.setIsBeta(B)
    getMcData({"v": v, "b": B}, true)
    store.setVersion(v)
}

function handleClick(isBeta) {
    searchValue.value = ''
    store.setVersion(store.Beta)
    switch (isBeta) {
        case "全版本":
            setItem("", "Beta")
            break;
        case "正式版":
            setItem("0", "Release")
            break;
        case "测试版":
            setItem("1", "Beta")
            break;
    }

}


function load() {
    setTimeout(() => {
        let is_b = store.isBeta;
        let ver = store.version;
        if (ver === "1.2.x") {
            loading.value = false
            finished.value = true
            return
        }
        let v = parseInt(ver.split('.')[1]) - 1;

        if (isNaN(v)) {
            return Snackbar.error(t('language.fail_request'))
        }
        v = `1.${v}.x`;
        store.setVersion(v);
        let d;
        if (is_b === "") {
            d = {"v": v}
        } else {
            d = {"v": v, "b": is_b}

        }
        getMcData(d)
        loading.value = false
    }, 1000)
}

const generateLink = (version) => {
    const versionParts = version.split('.');
    let ver = `${versionParts[0]}.${versionParts[1]}`
    if (parseFloat(ver) > 1.1) {
        return t('language.wiki_be', {version: version});
    } else {
        return t('language.wiki_be', {version: version});
    }
};


async function createSheet(li, vv) {
    const d = JSON.parse(li.link)
    if (d.hasOwnProperty("OneDrive_365")) {  // 删除OneDrive_365下载链接。
        delete d["OneDrive_365"];
    }
    const keys = Object.keys(d);
    keys.reverse();
    const transformedKeys = keys.map(key => {
        return {
            name: key,
            icon: 'download'
        };
    });

    const action = await ActionSheet({
        actions: transformedKeys,
        title: t('language.download_rec')
    })

    if (action !== 'close') {

        if (vv === 'v7') {
            window.open(d[action.name].ARMv7, '_blank');
        } else {
            if (d[action.name].ARMv8 === '') {
                Snackbar.warning(t('language.no_armv8'))
            } else {
                window.open(d[action.name].ARMv8, '_blank');
            }

        }
    }

}

const convertUTCDateToLocalDate = (utcDateString) => {
    if (utcDateString === null || utcDateString === "") {
        return t('language.undetermined_time')
    } else {
        const date = new Date(utcDateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

</script>

<template>

    <var-tabs v-model:active="isBeta" @click="handleClick">
        <var-tab name="全版本">{{ $t('language.all') }}</var-tab>
        <var-tab name="正式版">{{ $t('language.release') }}</var-tab>
        <var-tab name="测试版">{{ $t('language.beta') }}</var-tab>

    </var-tabs>


    <var-row justify="center">
        <var-col :span="22">
            <var-input variant="outlined" :placeholder="$t('language.search')" @input="searchInput"
                       v-model="searchValue"/>
            <var-checkbox @click="mSwitch" v-model="mSearch" class="mSwitch">{{
                    $t('language.fuzzy_search')
                }}
            </var-checkbox>
        </var-col>

        <var-list :loading-text="$t('language.t_loading')"
                  :finished-text="$t('language.t_finished')"
                  :error-text="$t('language.t_error')"
                  :finished="finished"
                  offset="30"
                  v-model:loading="loading"
                  check
                  @load="load">

            <var-skeleton
                title
                card
                :rows="3"
                :loading="skeletonLoading"
            >

                <var-col v-for="li in mcList" :key="li.version_all">
                    <var-card
                        :title=li.version
                        :subtitle="li.is_beta===0 ? t('language.release') : t('language.beta')"
                        layout="column"
                        ripple
                        outline="outline"
                        :class="li.is_beta === 0 ? 'card-R' : 'card-B'"
                    >
                        <template #description>
                            <var-space>
                                <ul>
                                    <li>{{ $t('language.change_log') }}

                                        <var-link type="primary" target="_blank"
                                                  v-bind:href="generateLink(li.version)"
                                                  underline="none">Minecraft Wiki
                                        </var-link>
                                    </li>
                                    <li>
                                        {{ $t('language.update_time') }}{{ convertUTCDateToLocalDate(li.update_time) }}

                                    </li>
                                    <li>
                                        {{ $t('language.file_size') }}{{ li.file_size }}

                                    </li>
                                </ul>
                            </var-space>

                        </template>

                        <template #extra>
                            <var-space>
                                <var-chip plain @click="createSheet(li,'v7')" type="primary">
                                    ARMv7
                                    <template #right>
                                        <var-icon name="download"/>
                                    </template>

                                </var-chip>

                                <var-chip plain @click="createSheet(li,'v8')" type="primary">
                                    ARMv8
                                    <template #right>
                                        <var-icon name="download"/>
                                    </template>
                                </var-chip>

                            </var-space>
                        </template>
                    </var-card>
                </var-col>
            </var-skeleton>

        </var-list>
        <var-col justify="center">
            <div>
                by：
                <var-link type="primary" href="https://github.com/zihao-il" target="_blank"
                          underline="none">zihao_il
                </var-link>
            </div>
        </var-col>
        <var-back-top :duration="300"/>
    </var-row>
    <var-popup :default-style="false" v-model:show="errorPop">
        <var-result class="result" type="empty" :title="$t('language.unable_version')">
            <template #description>
                <p>{{ $t('language.fix_web') }}</p>
            </template>
            <template #footer>
                <var-button
                    color="var(--result-empty-color)"
                    text-color="#fff"
                    @click="errorPop = false">
                    {{ $t('language.know') }}
                </var-button>

            </template>
        </var-result>
    </var-popup>


    <var-snackbar type="danger" v-model:show="show" :vertical="true">
        <div>
            <h3>{{ $t('language.support_genuine') }}</h3>
            <p>{{ $t('language.del_packages') }}</p>
            <p>{{ $t('language.get_genuine') }}</p>

            <p>{{ NewRelease }}</p>
            <p>{{ NewBeta }}</p>

        </div>

        <template #action>

            <var-link type="primary" href="https://www.minecraft.net/">
                <var-button type="primary" size="small">{{ $t('language.mc_website') }}</var-button>
            </var-link>


        </template>
    </var-snackbar>

</template>

<style scoped>
.var-input {
    width: 100%;
    margin-top: 1.25em;
    margin-bottom: 1.25em;
}

.var-card {
    margin-bottom: 1.25em;
}

.var-row {
    padding-bottom: 50px;
}


.var-list {
    width: 92%;

    min-height: 100vh;
}


ul {
    margin-left: 2em;
    margin-top: 0.75em;
    list-style-type: disc;

}

.mSwitch {
    margin-top: 25px;
    margin-left: 10px;
}

.new-card {
    display: none !important;
}

.b-radius {
    border-radius: 10px;
}
</style>