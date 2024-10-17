// 使用usecallback封装message，达到缓存函数以及对不同类型的消息进行封装，提升复用性
import { useCallback } from 'react'
import { message } from 'antd'
export const useMessage = () => {
    const [messageApi, contextHolder] = message.useMessage()

    /**
     * 请求成功
     * @param {Object} option - 选项对象
     * @param {string} [option.content = '请求成功！'] - 提示文本
     * @param {number} [option.delayTime = 2000] - 回调函数延迟执行时间 
     * @param {boolean} [option.show = true] - 是否展示message
     * @param {successCallBack} [option.callBack] - 成功回调函数 
     */
    // const success = ({ content = '请求成功！', callBack, delayTime = 0, show = true } = {}) => {
    //     if (show)
    //     messageApi.open({
    //         type: 'success',
    //         content
    //     })
    //     if (callBack) setTimeout(callBack, delayTime)
    // }

    /**
    * 提示失败
    *
    * @param {Object} options - 选项对象。
    * @param {string} [options.content='登录失败！'] - 失败消息的内容。
    * @param {successCallback} [options.callBack] - 失败后的回调函数。
    */
    // const error = ({ content = '请求失败！', callBack } = {}) => {
    //     messageApi.open({
    //         type: 'error',
    //         content,
    //     })
    //     if (callBack) {
    //         callBack()
    //     }
    // }
    /**
     * 提示警告
     *
     * @param {Object} options - 选项对象。
     * @param {string} [options.content='登录失败！'] - 警告消息的内容。
     * @param {successCallback} [options.callBack] - 警告后的回调函数。
     */
//     const warn = ({ content = '请求警告', callBack } = {}) => {
//         messageApi.open({
//             type: 'warning',
//             content,
//         })
//         if (callBack) {
//             callBack()
//         }
//     }

//     return {
//         success,
//         error,
//         warn,
//         contextHolder
//     }
// }

// 通用的消息处理函数
const openMessage = useCallback(({type = 'info', content, callBack,delayTime = 0 , show = true} ={}) => {
    if(show) {
        messageApi.open({type,content});
    }
    if(callBack) {
        setTimeout(callBack,delayTime) // 回调函数支持延时执行
    }
},[messageApi]);

// 使用 useCallback 封装的消息类型处理函数
  const success = useCallback(
    (options) => openMessage({ ...options, type: 'success', content: options.content || '请求成功！' }),
    [openMessage]
  );

  const error = useCallback(
    (options) => openMessage({ ...options, type: 'error', content: options.content || '请求失败！' }),
    [openMessage]
  );

  const warn = useCallback(
    (options) => openMessage({ ...options, type: 'warning', content: options.content || '请求警告' }),
    [openMessage]
  );
    return {
    success,
    error,
    warn,
    contextHolder,
  };
};