import axios from 'axios'

const service = axios.create({
    // baseURL: 'http://bbk.endyun.ltd:9000/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default service