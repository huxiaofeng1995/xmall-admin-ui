import request from '@/utils/request'

export function fetchSpuList(params) {
  return request({
    url:'/spu-list',
    method:'get',
    params: params
  })
}

export function addSpu(data) {
  return request({
    url:'/spu',
    method:'post',
    data: data
  })
}
export function deleteSpu(id) {
  return request({
    url:'/spu/' + id,
    method:'delete'
  })
}

export function getSpu(id){
  return request({
    url:'/spu/' + id,
    method:'get'
  })
}

export function updateSpu(data){
  return request({
    url:'/spu',
    method:'put',
    data:data
  })
}
