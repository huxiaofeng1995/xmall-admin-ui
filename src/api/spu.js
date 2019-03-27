import request from '@/utils/request'

export function fetchSpuList(params) {
  return request({
    url:'/spu-list',
    method:'get',
    params: params
  })
}

export function fetchSpuColors(id) {
  return request({
    url:'/spu-colors/' + id,
    method:'get',
  })
}

export function fetchSpuVersions(id) {
  return request({
    url:'/spu-versions/' + id,
    method:'get',
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

export function getSpuImgs(id){
  return request({
    url:'/spu-imgs/' + id,
    method:'get'
  })
}

export function addSpuImg(data){
  return request({
    url:'/spu-img',
    method:'post',
    data:data
  })
}

export function updateSpuImg(data) {
  return request({
    url: '/spu-img',
    method: 'put',
    data: data
  })
}

export function setMainImg(data) {
  return request({
    url: '/spu-img/main',
    method: 'put',
    data: data
  })
}

