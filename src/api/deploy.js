import service from '@/utils/request'

// @Tags api
// @Summary 分页获取deploy列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取deploy列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /api/getApiList [post]
// {
//  page     int
//	pageSize int
// }
export function getdeploymentlist(namespace) {
  return service({
    url: `/api/v1/proxy/apis/apps/v1/namespaces/${namespace}/deployments`,
    method: 'get'
    // data: namespace
  })
}

export function getDeploymentByNs(data) {
  return service({
    url: '/api/v1/proxy/deployment/numnp',
    method: 'get',
    params: data
  })
}

export function getdeploymentdetail(data) {
  return service({
    url: '/api/v1/proxy/deployment/detail',
    method: 'get',
    params: data
  })
}

export function updatedeployment(data) {
  return service({
    url: '/api/v1/proxy/deployment/update',
    method: 'put',
    params: data
  })
}

export function scaledeployment(data) {
  return service({
    url: '/api/v1/proxy/deployment/scale',
    method: 'get',
    params: data
  })
}

export function restartdeployment(data) {
  return service({
    url: '/api/v1/proxy/deployment/restart',
    method: 'put',
    params: data
  })
}

export function createDeployment(data) {
  return service({
    url: '/api/v1/proxy/deployment/create',
    method: 'post',
    data
  })
}

export function deleteDeployment(data) {
  return service({
    url: '/api/v1/proxy/deployment/del',
    method: 'delete',
    params: data
  })
}

export function deleteDeployment1(deploymentIdentifier) {
  const [namespace, name] = deploymentIdentifier.split('/')
  return service({
    url: `/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
    method: 'delete'
  })
}
