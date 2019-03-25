import request from '@/utils/request'

export function fetchAttrList(params) {
  return request({
    url:'/attr-list',
    method:'get',
    params: params
  })
}
