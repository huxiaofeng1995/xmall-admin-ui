import request from '@/utils/request'

export function fetchAttrList(params) {
  return request({
    url:'/attr-list',
    method:'get',
    params: params
  })
}

export function addAttrValue(data) {
  return request({
    url:'/attr-value',
    method:'post',
    data: data
  })
}

export function deleteAttr(id) {
  return request({
    url:'/attr/' + id,
    method:'delete'
  })
}

export function deleteAttrValue(id) {
  return request({
    url:'/attr-value/' + id,
    method:'delete'
  })
}

export function addAttr(data) {
  return request({
    url:'/attr',
    method:'post',
    data: data
  })
}
