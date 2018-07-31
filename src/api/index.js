import http from './public'
const prefix = 'http://192.168.22.210:8080'
// 极验验证码
export const geetest = (params) => {
  return http.fetchGet(prefix + '/login/geetestInit?t=' + (new Date()).getTime(), params)
}
export const geetestReg = (params) => {
  return http.fetchGet(prefix + '/register/geetestInit?t=' + (new Date()).getTime(), params)
}
export const geetestAdmin = (params) => {
  return http.fetchGet(prefix + '/admin/geetestInit?t=' + (new Date()).getTime(), params)
}
// 用户登录
export const userLogin = (params) => {
  return http.fetchPost(prefix + '/login/dologin', params)
}
// 用户注册
export const userRegister = (params) => {
  return http.fetchPost(prefix + '/register/doRegister', params)
}
// 快速登录
export const userQuickLogin = (params) => {
  return http.fetchPost(prefix + '/login/quickLogin', params)
}
// 主页菜单
export const getIndexMenu = (params) => {
  return http.fetchPost(prefix + '/index/indexMenu', params)
}
// 检查登录状态
export const checkState = (params) => {
  return http.fetchPost(prefix + '/login/checkState', params)
}
// 检车管理员登录状态
export const checkAdminLogin = (params) => {
  return http.fetchPost(prefix + '/admin/checkLogin', params)
}
// 管理员登录
export const adminLogin = (params) => {
  return http.fetchPost(prefix + '/admin/adminLogin', params)
}
// 用户菜单
export const userMenu = (params) => {
  return http.fetchPost(prefix + '/user/userMenu', params)
}
// 退出登录
export const userQuit = (params) => {
  return http.fetchPost(prefix + '/user/quit', params)
}
// 检测文件存在
export const CheckFileExist = (params) => {
  return http.fetchPost(prefix + '/user/checkFileExist', params)
}
// 新建投票
export const createVote = (params) => {
  return http.fetchPost(prefix + '/user/createVote', params)
}
// 获取个人投票列表
export const userVoteList = (params) => {
  return http.fetchPost(prefix + '/user/userVoteList', params)
}
// 获取个人信息
export const userInfo = (params) => {
  return http.fetchPost(prefix + '/user/userInfo', params)
}
// 修改个人信息
export const updateUserInfo = (params) => {
  return http.fetchPost(prefix + '/user/updateUserInfo', params)
}
// 获取投票页面数据
export const getVoteInfo = (params) => {
  return http.fetchPost(prefix + '/common/vote', params)
}
// 获取某个投票所有选项
export const getVoteOptions = (params) => {
  return http.fetchPost(prefix + '/common/vote/options', params)
}
// 获取图片url
export const getFilename = (params) => {
  return http.fetchPost(prefix + '/common/fileName', params)
}
// 投票
export const doVote = (params) => {
  return http.fetchPost(prefix + '/vote/doVote', params)
}
// 查询用户是否投票
export const checkVote = (params) => {
  return http.fetchPost(prefix + '/vote/checkVote', params)
}
// 保存投票
export const saveVote = (params) => {
  return http.fetchPost(prefix + '/vote/saveVote', params)
}
// 删除投票
export const deleteVote = (params) => {
  return http.fetchPost(prefix + '/vote/deleteVote', params)
}

export const adminQuit = (params) => {
  return http.fetchPost(prefix + '/admin/quit', params)
}
