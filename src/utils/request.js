import axios from 'axios'
// import { getToken } from '@/utils/auth.js'
import { ElMessageBox } from 'element-plus'
import { ERRORNotification, message } from '@/utils/tips.js'
// import { useUserCenter } from '@/stores/user.js'

const service = axios.create({
  baseURL: '/',
  timeout: 10000,
  validateStatus(status) {
    return status >= 200 && status < 504
  }
})

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log(response)
    // console.log(response.data)
    return response.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default service
