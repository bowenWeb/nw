
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import { Cookies, SESSION_TOKEN } from '@/utils/cookie'
import { ElMessage } from 'element-plus'

const _axios = () => {
  const service: AxiosInstance = axios.create({
    baseURL: 'http://192.168.1.62:30700', // process.env.VUE_APP_BASE_API,
    withCredentials: false,
    timeout: 60000,
    headers: {}
  })

  service.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      const token = Cookies.getKey(SESSION_TOKEN)
      if (token) {
        const headers = config.headers
        if (headers) {
          headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    (response: AxiosResponse) => {
      return new Promise((resolve, reject) => {
        const result = response.data
        if (result.code === 200) {
          resolve(result)
        } else {
          if (result.code === 403) {
            reject(result)
            ElMessage({
              showClose: true,
              message: '登录失效，即将跳转登录页面',
              type: 'error'
            })
            setTimeout(() => {
              window.location.href = './login'
            }, 3000)
          } else {
            reject(result)
          }
        }
      })
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  return service
}

export default _axios
