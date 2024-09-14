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

const getFolderTree = () => {
    return request({
        url: '/folder/tree',
        method: 'GET'
    })
}

export {
    getLayer,
    getFolderTree
}