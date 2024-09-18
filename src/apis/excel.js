import { request } from "@/utils";

const getExcelDetail = (id) => {
    return request({
        url: `/excel/get/${id}`,
        method: 'GET'
    })
}

const updateExcel = ({ id, title, url }) => {
    return request({
        url: '/excel/update',
        method: 'PUT',
        data: {
            id,
            title,
            url
        }
    })
}

const addExcel = ({ folderId, title, url }) => {
    return request({
        url: '/excel/upload',
        method: 'POST',
        data: {
            folderId,
            title,
            url
        }
    })
}

export {
    getExcelDetail,
    updateExcel,
    addExcel
}