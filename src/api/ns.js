import service from '@/utils/request'

export function getNamespecelist(query) {
  return service({
    url: '/api/v1/proxy/api/v1/namespaces',
    method: 'get',
    params: query
  })
}

export function GetNamespaceDetail(query) {
  return service({
    url: '/api/v1/proxy/api/v1/namespaces/{name}',
    method: 'get',
    params: query
  })
}

export function CreateNamespace(data) {
  return service({
    url: '/api/v1/proxy/api/v1/namespaces',
    method: 'post',
    data
  })
}

export function DeleteNamespace(name) {
  return service({
    url: `/api/v1/proxy/api/v1/namespaces/{name}`,
    method: 'delete'
    // params: query
  })
}

export function UpdateNamespace(query) {
  return service({
    url: '/api/k8s/namespace/update',
    method: 'put',
    params: query
  })
}
