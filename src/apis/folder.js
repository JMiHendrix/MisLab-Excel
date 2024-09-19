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
        url: '/home/tree',
        method: 'GET'
    })
}

const addFolder = ({ name, parentId }) => {
    return request({
        url: '/folder/add',
        method: 'POST',
        data: {
            name,
            parentId
        }
    })
}

export {
    getLayer,
    getFolderTree,
    addFolder
}