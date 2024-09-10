import { configureStore } from '@reduxjs/toolkit'

import userReducer from './modules/user'

 const conF =  configureStore({
  reducer: {
    // 注册子模块
    user: userReducer
  }
})

export default conF