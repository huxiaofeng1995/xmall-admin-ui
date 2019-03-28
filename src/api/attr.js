import request from '@/utils/request'

export function fetchAttrList(params) {
  return request({
    url:'/attr-list',
    method:'get',
    params: params
  })
}

export function fetchAllAttrList(flbh2) {
  return request({
    url:'/attr-list/' + flbh2,
    method:'get',
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

export function addColor(data) {
  return request({
    url:'/color',
    method:'post',
    data: data
  })
}

export function delColor(id) {
  return request({
    url:'/color/' + id,
    method:'delete',
  })
}
export function addVersion(data) {
  return request({
    url:'/version',
    method:'post',
    data: data
  })
}
export function delVersion(id) {
  return request({
    url:'/version/' + id,
    method:'delete',
  })
}
