import { request } from "@/utils/service"
import * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
// export function loginApi(data: Login.LoginRequestData) {
//   return request<Login.LoginResponseData>({
//     url: "users/login",
//     method: "post",
//     data
//   })
// }

/** 获取用户详情 */
// export function getUserInfoApi() {
//   return request<Login.UserInfoResponseData>({
//     url: "users/info",
//     method: "get"
//   })
// }
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "user/login",
    method: "post",
    data
  })
}

export function userCreate(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "user/register",
    method: "post",
    data
  })
}
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "user/getUserInfoByToken",
    method: "get"
  })
}
export const getUsersByPage = (params: { pageNum: number; pageSize: number }) => {
  return request({
    url: `user/page/${params.pageNum}/${params.pageSize}`,
    method: "get"
  })
}
