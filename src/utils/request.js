import axios from 'axios';

// 创建axios实例
const request = axios.create({
  // 网关地址
  baseURL: 'http://localhost:18080',
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token');
    // 如果token存在，则在请求头中添加token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('请求拦截器 - 准备发送请求:', config);
    return config;
  },
  error => {
    // 处理请求错误
    console.error('请求拦截器 - 请求错误:', error);
    console.error('请求拦截器 - 请求错误详情:', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 处理响应数据
    const res = response.data;
    console.log('响应拦截器 - 收到响应:', response);
    console.log('响应拦截器 - 响应数据:', res);
    // 如果返回的code不是成功的code，则抛出错误
    if (res.code !== 200) {
      console.error('响应拦截器 - 响应错误:', res.message || '请求失败');
      // 创建错误对象，包含响应数据
      const error = new Error(res.message || '请求失败');
      error.response = { data: res };
      return Promise.reject(error);
    } else {
      return res.data;
    }
  },
  error => {
    // 处理响应错误
    console.error('响应拦截器 - 响应错误:', error);
    // 打印更详细的错误信息
    if (error.response) {
      console.error('响应拦截器 - 响应状态:', error.response.status);
      console.error('响应拦截器 - 响应数据:', error.response.data);
      console.error('响应拦截器 - 响应头:', error.response.headers);
      // 如果后端返回了具体的错误信息，使用后端的错误信息
      if (error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
      }
    } else if (error.request) {
      console.error('响应拦截器 - 请求未收到响应:', error.request);
    } else {
      console.error('响应拦截器 - 请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;