import { request } from "@/utils";

const uploadFile = ({ id, file }) => {
    let data = new FormData()
    data.append('id', id)
    data.append('file', file)
    return request({
        url: '/minio/upload',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        data
    })
}

const downloadFile = (id) => {
    return request({
        url: `/minio/download/${id}`,
        method: 'GET',
        responseType: 'blob',
    })
    .then(response => {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `file_${id}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    })
    .catch(error => {
        console.error('Error downloading file:', error);
    });
}

export {
    uploadFile,
    downloadFile
}