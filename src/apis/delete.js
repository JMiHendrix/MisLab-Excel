import { request } from "@/utils";

const delContent = (id) => {
    return request({
        url: `/text/delete/${id}`,
        method: 'DELETE'
    })
}

const delExcel = (id) => {
    return request({
        url: `/excel/delete/${id}`,
        method: 'DELETE'
    })
}

const delFolder = (id) => {
    return request({
        url: `/folder/delete/${id}`,
        method: 'DELETE'
    })
}

export {
    delContent,
    delExcel,
    delFolder
}