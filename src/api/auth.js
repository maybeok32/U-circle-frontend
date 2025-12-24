import request from '../utils/request';

// 用户登录
export function login(data) {
  console.log('登录请求数据:', data);
  return request({
    url: '/base/sso/login',
    method: 'post',
    data
  }).then(response => {
    console.log('登录响应数据:', response);
    return response;
  }).catch(error => {
    console.error('登录请求错误:', error);
    throw error;
  });
}

// 发送验证码
export function sendCode(phone) {
  console.log('发送验证码请求数据:', phone);
  console.log('请求路径:', `/base/sso/sendCode/${phone}`);
  return request({
    url: `/base/sso/sendCode/${phone}`,
    method: 'post'
  }).then(response => {
    console.log('发送验证码响应数据:', response);
    return response;
  }).catch(error => {
    console.error('发送验证码请求错误:', error);
    console.error('错误详情:', JSON.stringify(error, null, 2));
    throw error;
  });
}
