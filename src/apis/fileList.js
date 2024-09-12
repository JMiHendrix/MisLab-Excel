import { request } from "@/utils";

/**
 * id
 * 1 - 在线文档
 * 2 - 文件夹
 * 3 - excel
 */

const getFileList = (data) => {
    return request({
        url: `/home/get`,
        method: 'POST',
        data
    })
}

export {
    getFileList
}