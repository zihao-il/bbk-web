import request from "../utils/request.js"

export const get_version = function (data) {
    return request({
        url: '/api/get_version',
        method: 'post',
        data: data
    })
}
export const search_version = function (data) {
    return request({
        url: `/api/search_version`,
        method: 'get',
        params: data,

    })
}




