import request from '@/utils/request'

export function fetchSpuList(params) {
  return request({
    url:'/spu-list',
    method:'get',
    params: params
  })
}
