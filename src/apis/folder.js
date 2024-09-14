import { request } from "@/utils";

const getLayer = (id) => {
    return request({
        url: '/folder/list',
        method: 'POST',
        data: {
            id,
            status: 2
        }
    })
}

export {
    getLayer
}