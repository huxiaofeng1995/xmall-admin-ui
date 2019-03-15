import request from '@/utils/request'

export function fetchFirstCateList() {
  return request({
    url:'/category/first',
    method:'get',
  })
}

export function addFirstCate(data){
  return request({
    url: '/category/first',
    method: 'post',
    data: data
  })
}

export function updateFirstCate(data){
  return request({
    url: '/category/first',
    method: 'put',
    data: data
  })
}

export function deleteFirstCate(id){
  return request({
    url: '/category/first/' + id,
    method: 'delete',
  })
}
export function fetchSecondCateList(flbh1) {
  return request({
    url: '/category/second/' + flbh1,
    method: 'get'
  })
}

export function addSecondCate(data){
  return request({
    url: '/category/second',
    method: 'post',
    data: data
  })
}

export function updateSecondCate(data){
  return request({
    url: '/category/second',
    method: 'put',
    data: data
  })
}

export function deleteSecondCate(id){
  return request({
    url: '/category/second/' + id,
    method: 'delete',
  })
}

export function fetchTMList(flbh1) {
  return request({
    url: '/category/tm/' + flbh1,
    method: 'get',
  })
}

export function addTMCate(data) {
  return request({
    url: '/category/tm',
    method: 'post',
    data: data
  })
}
