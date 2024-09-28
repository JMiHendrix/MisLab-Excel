import { request } from "@/utils";

const getCaptcha = () => {
    return request({
        url: '/captcha',
        method: 'GET',
        responseType: 'blob'
    })
}

export {
    getCaptcha
}