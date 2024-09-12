import { configureStore } from '@reduxjs/toolkit'

import userReducer from './modules/user'
import messageReducer from './modules/message'

 const conF =  configureStore({
  reducer: {
    // 注册子模块
    user: userReducer,
    message: messageReducer
  }
})

export default conF