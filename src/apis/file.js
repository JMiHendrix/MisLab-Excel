import { request } from "@/utils";

const uploadFile = ({ id, file }) => {
    let data = new FormData()
    data.append('id', id)
    data.append('file', file)
    return request({
        url: '/upload',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        data
    })
}

export {
    uploadFile
}