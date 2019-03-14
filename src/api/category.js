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
