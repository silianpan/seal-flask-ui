import api from '@/libs/api'
// import md5 from 'js-md5'

export const login = ({ userName, password }) => {
  const url = '/api/auth/jwt/token'
  // TODO: 明文传输
  const data = {
    username: userName,
    password: password
  }
  return api.post(url, data)
}

export const getUserInfo = (token) => {
  const url = '/api/admin/user/front/info'
  return api.get(url, { token })
}

export const getMenus = (token) => {
  const url = '/api/admin/user/front/menus'
  return api.get(url, { token })
}
