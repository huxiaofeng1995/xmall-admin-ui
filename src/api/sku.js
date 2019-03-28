import request from '@/utils/request'

export function addSku(data) {
  return request({
    url:'/sku',
    method:'post',
    data: data
  })
}
