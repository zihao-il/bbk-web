<script setup>
import {get_version, search_version} from "../api/index.js";
import {onMounted, reactive, ref} from "vue";
import {ActionSheet, Snackbar} from "@varlet/ui";


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
            return Snackbar.error("无此版本号！")
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
            sessionStorage.setItem('version', sessionStorage.getItem('Beta'));

            break;
        case "正式版":
        case 1 :

            sessionStorage.setItem('version', sessionStorage.getItem('Release'));

            break;
        case "测试版":
        case 2 :
            sessionStorage.setItem('version', sessionStorage.getItem('Beta'));

            break;
    }

}


async function getLastData() {
    let vData

    const {data} = await get_version({"v": "larversion"})
    if (data.status === 201) {
        return Snackbar.error("获取总版本号失败！")
    } else {
        vData = data.message
        sessionStorage.setItem('isBeta', '');
        sessionStorage.setItem('Release', vData[0].Release);
        sessionStorage.setItem('Beta', vData[0].Beta);
        skeletonLoading.value = false

    }

}


async function getNewMcList() {

    const {data} = await get_version({"v": "last"})
    newMcList.splice(0, mcList.length, ...data.message)
    for (let li of newMcList) {
        console.log(li)
        if (li.is_beta === 0) {
            NewRelease.value = `最新正式版：${li.version}\n`
        } else {
            NewBeta.value = `最新测试版：${li.version}\n`

        }
    }
    // console.log(newMcList)


}

onMounted(() => {
    getLastData()
    getNewMcList()
    let intervalId = setInterval(function () {
        let betaValue = sessionStorage.getItem('Beta');
        if (betaValue !== null) {
            clearInterval(intervalId);
            getMcData({"v": betaValue});
            sessionStorage.setItem('version', betaValue);
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
        getMcData({"v": sessionStorage.getItem('version'), "b": b}, true, false)
        loading.value = true
        finished.value = false
        load()
    }


}


const setItem = (B, D) => {
    sessionStorage.setItem('isBeta', B);
    getMcData({"v": sessionStorage.getItem(D), "b": B}, true)
    sessionStorage.setItem('version', sessionStorage.getItem(D));
}

function handleClick(isBeta) {
    searchValue.value = ''
    sessionStorage.setItem('version', sessionStorage.getItem('Beta'));
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
        let is_b = sessionStorage.getItem('isBeta');
        let ver = sessionStorage.getItem('version');
        if (ver === "1.2.x") {
            loading.value = false
            finished.value = true
            return
        }
        let v = parseInt(ver.split('.')[1]) - 1;
        v = `1.${v}.x`;
        sessionStorage.setItem('version', v);
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
        return `https://zh.minecraft.wiki/w/%E5%9F%BA%E5%B2%A9%E7%89%88${version}`;
    } else {
        return `https://zh.minecraft.wiki/w/%E6%90%BA%E5%B8%A6%E7%89%88${version}`;
    }
};


async function createSheet(li, vv) {
    const d = JSON.parse(li.link)
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
        title: '下载推荐(OneDrive_365>OneDrive_E5>123盘)'
    })

    if (action !== 'close') {

        if (vv === 'v7') {
            window.open(d[action.name].ARMv7, '_blank');
        } else {
            if (d[action.name].ARMv8 === '') {
                Snackbar.warning(`此版本没有ARMv8架构的安装包(>≈1.16.X版本才有)`)
            } else {
                window.open(d[action.name].ARMv8, '_blank');
            }

        }
    }

}

const convertUTCDateToLocalDate = (utcDateString) => {
    if (utcDateString === null) {
        return "未确定时间"
    } else {
        const date = new Date(utcDateString);
        date.setDate(date.getDate() + 1);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

</script>

<template>

    <var-tabs v-model:active="isBeta" @click="handleClick">
        <var-tab name="全版本">全版本</var-tab>
        <var-tab name="正式版">正式版</var-tab>
        <var-tab name="测试版">测试版</var-tab>

    </var-tabs>


    <var-row justify="center">
        <var-col :span="22">
            <var-input variant="outlined" placeholder="请输入版本号" @input="searchInput" v-model="searchValue"/>
            <var-checkbox @click="mSwitch" v-model="mSearch" class="mSwitch">模糊搜索</var-checkbox>
        </var-col>

        <var-list loading-text="正在努力输出中..."
                  finished-text="一滴都没有了"
                  error-text="出错了出错了"
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
                        :subtitle="li.is_beta===0 ? '正式版' : '测试版'"
                        layout="column"
                        ripple
                        outline="outline"
                        :class="li.is_beta === 0 ? 'card-R' : 'card-B'"
                    >
                        <template #description>
                            <var-space>
                                <ul>
                                    <li>更新日志：
                                        <var-link type="primary" target="_blank"
                                                  v-bind:href="generateLink(li.version)"
                                                  underline="none">Minecraft Wiki
                                        </var-link>
                                    </li>
                                    <li>
                                        更新时间：{{ convertUTCDateToLocalDate(li.update_time) }}
                                    </li>
                                    <li>
                                        文件大小：{{ li.file_size }}
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
        <var-result class="result" type="empty" title="无法获取版本列表">
            <template #description>
                <p>请联系管理员修复！</p>
            </template>
            <template #footer>
                <var-button
                    color="var(--result-empty-color)"
                    text-color="#fff"
                    @click="errorPop = false">
                    知道了
                </var-button>

            </template>
        </var-result>
    </var-popup>


    <var-snackbar type="danger" v-model:show="show" :vertical="true">
        <div>
            <h3>有能力者请支持正版！</h3>
            <p>本站所有的安装包仅供交流学习，禁止分享到任何平台，下载后请24小时内及时删除！</p>
            <p>如需要游玩请前往 Minecraft官网 购买正版！！！</p>

            <p>{{ NewRelease }}</p>
            <p>{{ NewBeta }}</p>

        </div>

        <template #action>

            <var-link type="primary" href="https://www.minecraft.net/">
                <var-button type="primary" size="small">Minecraft官网</var-button>
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

</style>