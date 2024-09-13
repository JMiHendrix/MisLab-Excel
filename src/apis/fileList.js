import { request } from "@/utils";

/**
 * id
 * 1 - 在线文档
 * 2 - 文件夹
 * 3 - excel
 * 4 - word
 */

const getFileList = (id = '') => {
    return request({
        url: `/home/get`,
        method: 'POST',
        data: {
            id
        }
    })
}

export {
    getFileList
}