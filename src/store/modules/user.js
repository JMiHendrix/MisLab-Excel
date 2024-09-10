import { createSlice } from '@reduxjs/toolkit'
import { request } from '../../utils'
import { setToken as _setToken, getToken, clearToken } from '@/utils'
const userStore = createSlice({
    name: 'user',
    // 数据状态
    initialState: {
        token: getToken() || ''
    },
    // 同步修改方法
    reducers: {
        setToken(state, action) {
            state.userInfo = action.payload
            _setToken(action.payload)
        },
        clearUserInfo(state) {
            state.token = ''
            clearToken()
        }
    }
})

// 解构出actionCreater
const { setToken, clearUserInfo } = userStore.actions

// 获取reducer函数
const userReducer = userStore.reducer

// 异步方法封装
const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        const res = await request.post('/user/login', loginForm)
        dispatch(setToken(res.data.token))
    }
}

export { setToken, fetchLogin, clearUserInfo }
export default userReducer