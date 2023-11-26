import axios from 'axios'

const service = axios.create({
    // baseURL: 'https://bbk.endyun.ltd/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default service