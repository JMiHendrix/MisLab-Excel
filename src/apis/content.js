import { request } from "@/utils";

const getContentDetail = (id) => {
    return request({
        url: `/text/get/${id}`,
        method: 'GET'
    })
}

export {
    getContentDetail
}