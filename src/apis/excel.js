import { request } from "@/utils";

const getExcelDetail = (id) => {
    return request({
        url: `/excel/get/${id}`,
        method: 'GET'
    })
}

export {
    getExcelDetail
}