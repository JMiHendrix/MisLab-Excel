import axios from 'axios'
import { getToken, clearToken } from './token'
import store from '@/store'
import { clearUserInfo } from '@/store/modules/user'
import { showMessage } from '@/store/modules/message'
const request = axios.create({
    // node node_modules/cors-anywhere/server.js
    // 解决跨域问题
    // baseURL: 'http://localhost:8080/http://1.117.70.79:4529',
    baseURL: 'http://1.117.70.79:4529',
    timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
    // 按照后端格式做token拼接
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
        store.dispatch(clearUserInfo())
        clearToken()
        // const { message, type, visible } = store.getState().message
        store.dispatch(showMessage({ message: '未登录或登录已过期，请重新登录', type: 'warn' }))
        window.location.hash = '/login';
    }
    return Promise.reject(error)
})

export { request }