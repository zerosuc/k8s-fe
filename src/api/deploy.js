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

export function getdeploymentdetail(data) {
  const namespace = data.namespace
  const deploy = data.deployment_name
  return service({
    url: `/api/v1/proxy/apis/apps/v1/namespaces/${namespace}/deployments/${deploy}`,
    method: 'get'
    // params: data
  })
}

export function scaledeployment(data) {
  // const [namespace, name] = deploymentIdentifier.split('/')
  const namespace = data.namespace
  const name = data.deployment_name
  const replicas = data.scale_num
  return service.put(
    `/api/v1/proxy/apis/apps/v1/namespaces/${namespace}/deployments/${name}/scale`,
    {
      apiVersion: 'autoscaling/v1',
      kind: 'Scale',
      metadata: {
        name: name,
        namespace: namespace
      },
      spec: {
        replicas: replicas
      }
    }
  )
}

export function deleteDeployment(data) {
  const name = data.deployment_name
  const namespace = data.namespace
  return service({
    url: `/api/v1/proxy/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
    method: 'delete'
  })
}

export function getDeploymentByNs(data) {
  return service({
    url: '/api/v1/proxy/deployment/numnp',
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

export function restartdeployment(dataInput) {
  const name = dataInput.deployment_name
  const namespace = dataInput.namespace
  const url = `/api/v1/proxy/apis/apps/v1/namespaces/${namespace}/deployments/${name}`
  const data = {
    spec: {
      template: {
        metadata: {
          annotations: {
            'kubectl.kubernetes.io/restartedAt': new Date().toISOString()
          }
        }
      }
    }
  }

  return service({
    url: url,
    method: 'patch',
    headers: {
      'Content-Type': 'application/strategic-merge-patch+json'
    },
    data: data
  })
}

export function createDeployment(data) {
  return service({
    url: '/api/v1/proxy/deployment/create',
    method: 'post',
    data
  })
}
