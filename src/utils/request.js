import axios from 'axios'

const service = axios.create({
    baseURL: 'https://api.mcarc.top/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default service