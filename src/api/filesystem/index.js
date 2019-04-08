import api from '@/libs/api'

export const upload = file => {
  const url = '/filesystem/upload'
  return api.post(url, file)
}
