import { request } from "@/utils";

const getFileList = (data) => {
    return request({
        url: `/home/get`,
        method: 'POST',
        data
    })
}