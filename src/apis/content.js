import { request } from "@/utils";

const getContentDetail = (id) => {
    return request({
        url: `/text/get/${id}`,
        method: 'GET'
    })
}

const editContent = ({ title, author, content, id } = {}) => {
    const data = {
        title,
        author,
        content,
        id
    }
    return request({
        url: 'text/update',
        method: 'PUT',
        data
    })
}

export {
    getContentDetail,
    editContent
}