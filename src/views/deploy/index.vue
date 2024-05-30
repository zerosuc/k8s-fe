<template>
  <div class="deploy">
    <el-row>
      <!-- 头部1 -->
      <el-col :span="24">
        <div>
          <el-card class="deploy-head-card" shadow="never" :body-style="{ padding: '10px' }">
            <el-row>
              <!-- 命名空间的下拉框 -->
              <el-col :span="6">
                <div>
                  <span>命名空间: </span>
                  <el-select v-model="namespaceValue" filterable placeholder="请选择">
                    <el-option
                      v-for="(item, index) in namespaceList"
                      :key="index"
                      :label="item.metadata.name"
                      :value="item.metadata.name"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <!-- 刷新按钮 -->
              <el-col :span="2" :offset="16">
                <div>
                  <el-button
                    style="border-radius: 2px"
                    icon="Refresh"
                    plain
                    @click="getDeployments()"
                    >刷新</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 头部2 -->
      <el-col :span="24">
        <div>
          <el-card class="deploy-head-card" shadow="never" :body-style="{ padding: '10px' }">
            <el-row>
              <!-- 创建按钮 -->
              <el-col :span="2">
                <div>
                  <el-button
                    style="border-radius: 2px"
                    icon="Edit"
                    type="primary"
                    @click="createDeploymentDrawer = true"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    >创建</el-button
                  >
                </div>
              </el-col>
              <!-- 搜索框和搜索按钮 -->
              <el-col :span="6">
                <div>
                  <el-input
                    class="deploy-head-search"
                    clearable
                    placeholder="请输入"
                    v-model="searchInput"
                  ></el-input>
                  <el-button
                    style="border-radius: 2px"
                    icon="Search"
                    type="primary"
                    plain
                    @click="getDeployments()"
                    >搜索</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 数据表格 -->
      <el-col :span="24">
        <div>
          <el-card class="deploy-body-card" shadow="never" :body-style="{ padding: '5px' }">
            <el-table
              style="width: 100%; font-size: 12px; margin-bottom: 10px"
              :data="deploymentList"
              v-loading="appLoading"
            >
              <el-table-column width="20"></el-table-column>
              <!-- deployment名字 -->
              <el-table-column align="left" label="Deployment名">
                <template v-slot="scope">
                  <a class="deploy-body-deployname">{{ scope.row.metadata.name }}</a>
                </template>
              </el-table-column>
              <!-- 标签 -->
              <el-table-column align="center" label="标签">
                <template v-slot="scope">
                  <div v-for="(val, key) in scope.row.metadata.labels" :key="key">
                    <el-popover
                      placement="right"
                      :width="200"
                      trigger="hover"
                      :content="key + ':' + val"
                    >
                      <template #reference>
                        <el-tag style="margin-bottom: 5px" type="warning">{{
                          ellipsis(key + ':' + val)
                        }}</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <!-- 容器组 -->
              <el-table-column align="center" label="容器组">
                <template v-slot="scope">
                  <span
                    >{{
                      scope.row.status.availableReplicas > 0
                        ? scope.row.status.availableReplicas
                        : 0
                    }}
                    / {{ scope.row.spec.replicas > 0 ? scope.row.spec.replicas : 0 }}
                  </span>
                </template>
              </el-table-column>
              <!-- 创建时间 -->
              <el-table-column align="center" min-width="100" label="创建时间">
                <template v-slot="scope">
                  <el-tag type="info">{{ timeTrans(scope.row.metadata.creationTimestamp) }}</el-tag>
                </template>
              </el-table-column>
              <!-- 容器镜像 -->
              <el-table-column align="center" label="镜像">
                <template v-slot="scope">
                  <div v-for="(val, key) in scope.row.spec.template.spec.containers" :key="key">
                    <el-popover placement="right" :width="200" trigger="hover" :content="val.image">
                      <template #reference>
                        <el-tag style="margin-bottom: 5px">{{
                          ellipsis(
                            val.image.split('/')[2] === undefined
                              ? val.image
                              : val.image.split('/')[2]
                          )
                        }}</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <!-- 操作列，放按钮 -->
              <el-table-column align="center" label="操作" width="400">
                <template v-slot="scope">
                  <el-button
                    size="small"
                    style="border-radius: 2px"
                    icon="Edit"
                    type="primary"
                    plain
                    @click="getDeploymentDetail(scope)"
                    >YAML</el-button
                  >
                  <el-button
                    size="small"
                    style="border-radius: 2px"
                    icon="Plus"
                    type="primary"
                    @click="handleScale(scope)"
                    >扩缩</el-button
                  >
                  <el-button
                    size="small"
                    style="border-radius: 2px"
                    icon="RefreshLeft"
                    type="primary"
                    @click="handleConfirm(scope, '重启', restartDeployment)"
                    >重启</el-button
                  >
                  <el-button
                    size="small"
                    style="border-radius: 2px"
                    icon="Delete"
                    type="danger"
                    @click="handleConfirm(scope, '删除', delDeployment)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pagesize"
              :page-sizes="pagesizeList"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="deploymentTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 抽屉：创建Deployment的表单 -->
    <el-drawer v-model="createDeploymentDrawer" :direction="direction" :before-close="handleClose">
      <template #header>
        <h4>创建Deployment</h4>
      </template>
      <template #default>
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <el-form
              ref="createDeploymentForm"
              :rules="createDeploymentRules"
              :model="createDeployment"
              label-width="80px"
            >
              <el-form-item class="deploy-create-form" label="名称" prop="name">
                <el-input v-model="createDeployment.name"></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="命名空间" prop="namespace">
                <el-select v-model="createDeployment.namespace" filterable placeholder="请选择">
                  <el-option
                    v-for="(item, index) in namespaceList"
                    :key="index"
                    :label="item.metadata.name"
                    :value="item.metadata.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="副本数" prop="replicas">
                <el-input-number
                  v-model="createDeployment.replicas"
                  :min="1"
                  :max="10"
                ></el-input-number>
                <el-popover
                  placement="top"
                  :width="100"
                  trigger="hover"
                  content="申请副本数上限为10个"
                >
                  <template #reference>
                    <el-icon style="width: 2em; font-size: 18px; color: #4795ee"
                      ><WarningFilled
                    /></el-icon>
                  </template>
                </el-popover>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="镜像" prop="image">
                <el-input v-model="createDeployment.image"></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="标签" prop="label_str">
                <el-input
                  v-model="createDeployment.label_str"
                  placeholder="示例: project=ms,app=gateway"
                ></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="资源配额" prop="resource">
                <el-select v-model="createDeployment.resource" placeholder="请选择">
                  <el-option value="0.5/1" label="0.5C1G"></el-option>
                  <el-option value="1/2" label="1C2G"></el-option>
                  <el-option value="2/4" label="2C4G"></el-option>
                  <el-option value="4/8" label="4C8G"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="容器端口" prop="container_port">
                <el-input
                  v-model="createDeployment.container_port"
                  placeholder="示例: 80"
                ></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="健康检查" prop="health">
                <el-switch v-model="createDeployment.health_check" />
              </el-form-item>
              <el-form-item class="deploy-create-form" label="检查路径" prop="healthPath">
                <el-input
                  v-model="createDeployment.health_path"
                  placeholder="示例: /health"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <el-button @click="createDeploymentDrawer = false">取消</el-button>
        <el-button type="primary" @click="submitForm('createDeploymentForm')">立即创建</el-button>
      </template>
    </el-drawer>
    <el-dialog title="YAML信息" v-model="yamlDialog" width="45%" top="2%">
      <codemirror
        v-model:value="contentYaml"
        border
        :options="cmOptions"
        :style="{ height: '500px' }"
        :autofocus="true"
        :tab-size="2"
        @change="onChange"
      >
      </codemirror>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="yamlDialog = false">取消</el-button>
          <el-button type="primary" @click="updateDeployment()">更新</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="副本数调整" v-model="scaleDialog" width="25%">
      <div style="text-align: center">
        <span>实例数: </span>
        <el-input-number
          :step="1"
          v-model="scaleNum"
          :min="0"
          :max="30"
          label="描述文字"
        ></el-input-number>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scaleDialog = false">取消</el-button>
          <el-button type="primary" @click="scaleDeployment()">更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
// import common from '../common/Config'
import yaml2obj from 'js-yaml'
import json2yaml from 'json2yaml'
import {
  createDeployment as createDeploymentAPI,
  deleteDeployment,
  getdeploymentdetail,
  getdeploymentlist,
  restartdeployment,
  scaledeployment,
  updatedeployment
} from '@/api/deploy.js'
import { getNamespecelist } from '@/api/ns'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'

const cmOptions = {
  mode: 'text/yaml',
  theme: 'darcula',
  lineNumbers: true,
  smartIndent: true,
  indentUnit: 4,
  styleActiveLine: true,
  matchBrackets: true,
  readOnly: false,
  lineWrapping: true
}

const contentYaml = ref('')
const currentPage = ref(1)
const pagesize = ref(10)
const pagesizeList = [10, 20, 30]
const searchInput = ref('')
const namespaceValue = ref('default')
const namespaceList = ref([])
const appLoading = ref(false)
const deploymentList = ref([])
const deploymentTotal = ref(0)
const createDeploymentDrawer = ref(false)
const fullscreenLoading = ref(false)
const direction = ref('rtl')
const yamlDialog = ref(false)
const scaleDialog = ref(false)
const scaleNum = ref(0)

const createDeployment = reactive({
  name: '',
  namespace: '',
  replicas: 1,
  image: '',
  resource: '',
  health_check: false,
  health_path: '',
  label_str: '',
  label: {},
  container_port: ''
})

const createDeploymentRules = {
  name: [{ required: true, message: '请填写名称', trigger: 'change' }],
  image: [{ required: true, message: '请填写镜像', trigger: 'change' }],
  namespace: [{ required: true, message: '请选择命名空间', trigger: 'change' }],
  resource: [{ required: true, message: '请选择配额', trigger: 'change' }],
  label_str: [{ required: true, message: '请填写标签', trigger: 'change' }],
  container_port: [{ required: true, message: '请填写容器端口', trigger: 'change' }]
}

const deploymentDetail = ref({})
const getDeploymentDetailData = {
  params: {
    deployment_name: '',
    namespace: ''
  }
}
const updateDeploymentData = {
  params: {
    namespace: '',
    content: ''
  }
}
const scaleDeploymentData = {
  params: {
    deployment_name: '',
    namespace: '',
    scale_num: ''
  }
}
const restartDeploymentData = {
  params: {
    deployment_name: '',
    namespace: ''
  }
}
const delDeploymentData = {
  params: {
    deployment_name: '',
    namespace: ''
  }
}

const getNamespaces = () => {
  getNamespecelist()
    .then((res) => {
      namespaceList.value = res.data.items
      console.log(res.data)
      console.log(res.data.data)
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
}

const getDeployments = () => {
  appLoading.value = true
  const getDeploymentsData = {
    // url: common.k8sDeploymentList,
    params: {
      filter_name: searchInput.value,
      namespace: namespaceValue.value,
      page: currentPage.value,
      limit: pagesize.value
    }
  }
  console.log(getDeploymentsData)
  getdeploymentlist(getDeploymentsData.params.namespace)
    .then((res) => {
      deploymentList.value = res.data.items
      deploymentTotal.value = res.data.total
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
  appLoading.value = false
}

const getDeploymentDetail = (e) => {
  getDeploymentDetailData.params.deployment_name = e.row.metadata.name
  getDeploymentDetailData.params.namespace = namespaceValue.value
  getdeploymentdetail(getDeploymentDetailData.params)
    .then((res) => {
      deploymentDetail.value = res.data
      contentYaml.value = transYaml(deploymentDetail.value)
      yamlDialog.value = true
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
}

const updateDeployment = () => {
  const content = JSON.stringify(transObj(contentYaml.value))
  updateDeploymentData.params.namespace = namespaceValue.value
  updateDeploymentData.params.content = content
  updatedeployment(updateDeploymentData.params)
    .then((res) => {
      ElMessage.success({
        message: res.msg
      })
      getDeployments()
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
  yamlDialog.value = false
}

const handleScale = (e) => {
  scaleDialog.value = true
  deploymentDetail.value = e.row
  scaleNum.value = e.row.spec.replicas
}

const scaleDeployment = () => {
  scaleDeploymentData.params.deployment_name = deploymentDetail.value.metadata.name
  scaleDeploymentData.params.namespace = namespaceValue.value
  scaleDeploymentData.params.scale_num = scaleNum.value
  scaledeployment(scaleDeploymentData.params)
    .then((res) => {
      ElMessage.success({
        message: res.msg
      })
      getDeployments()
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
  scaleDialog.value = false
}

const restartDeployment = (e) => {
  restartDeploymentData.params.deployment_name = e.row.metadata.name
  restartDeploymentData.params.namespace = namespaceValue.value
  restartdeployment(restartDeploymentData.params)
    .then((res) => {
      ElMessage.success({
        message: res.msg
      })
      getDeployments()
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
}

const delDeployment = (e) => {
  delDeploymentData.params.deployment_name = e.row.metadata.name
  delDeploymentData.params.namespace = namespaceValue.value
  deleteDeployment(delDeploymentData.params)
    .then((res) => {
      ElMessage.success({
        message: res.msg
      })
      getDeployments()
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
}

const handleConfirm = (obj, operateName, fn) => {
  const confirmContent = '确认继续 ' + operateName + ' 操作吗？'
  ElMessageBox.confirm(confirmContent, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      fn(obj)
    })
    .catch(() => {
      ElMessage.info({
        message: '已取消操作'
      })
    })
}

const createDeployFunc = () => {
  const reg = new RegExp('(^[A-Za-z]+=[A-Za-z0-9]+).*')
  if (!reg.test(createDeployment.label_str)) {
    ElMessage.warning({
      message: '标签填写异常，请确认后重新填写'
    })
    return
  }
  fullscreenLoading.value = true
  const label = new Map()
  let cpu, memory
  const a = createDeployment.label_str.split(',')
  a.forEach((item) => {
    const b = item.split('=')
    label[b[0]] = b[1]
  })
  const resourceList = createDeployment.resource.split('/')
  cpu = resourceList[0]
  memory = resourceList[1] + 'Gi'
  createDeploymentData.params = createDeployment
  createDeploymentData.params.container_port = parseInt(createDeployment.container_port)
  createDeploymentData.params.label = label
  createDeploymentData.params.cpu = cpu
  createDeploymentData.params.memory = memory
  createDeploymentAPI(createDeploymentData.params)
    .then((res) => {
      ElMessage.success({
        message: res.msg
      })
      getDeployments()
    })
    .catch((res) => {
      ElMessage.error({
        message: res.msg
      })
    })
  resetForm('createDeploymentForm')
  fullscreenLoading.value = false
  createDeploymentDrawer.value = false
}

// 重置表单方法
const resetForm = () => {
  if (createDeploymentForm.value) {
    createDeploymentForm.value.resetFields()
  }
}
// const resetForm = (formName) => {
//   if (this.$refs[formName]) {
//     this.$refs[formName].resetFields()
//   }
// }

// const submitForm = (formName) => {
//   if (this.$refs[formName]) {
//     this.$refs[formName].validate((valid) => {
//       if (valid) {
//         createDeployFunc()
//       } else {
//         return false
//       }
//     })
//   }
// }
const submitForm = () => {
  if (createDeploymentForm.value) {
    createDeploymentForm.value.validate((valid) => {
      if (valid) {
        createDeployFunc()
      } else {
        return false
      }
    })
  }
}

const transYaml = (content) => {
  return json2yaml.stringify(content)
}

const transObj = (content) => {
  return yaml2obj.load(content)
}

const onChange = (val) => {
  contentYaml.value = val
}

const ellipsis = (value) => {
  return value.length > 15 ? value.substring(0, 15) + '...' : value
}

const timeTrans = (timestamp) => {
  let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
  date = date.toJSON()
  date = date.substring(0, 19).replace('T', ' ')
  return date
}

const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {})
}

watch(namespaceValue, (newVal) => {
  localStorage.setItem('namespace', newVal)
  currentPage.value = 1
  getDeployments()
})

onMounted(() => {
  if (
    localStorage.getItem('namespace') !== undefined &&
    localStorage.getItem('namespace') !== null
  ) {
    namespaceValue.value = localStorage.getItem('namespace')
  }
  getNamespaces()
  getDeployments()
})

const handleSizeChange = (size) => {
  pagesize.value = size
  getDeployments()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  getDeployments()
}
</script>

<style scoped>
/* 卡片属性 */
.deploy-head-card,
.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}
/* 搜索框 */
.deploy-head-search {
  width: 160px;
  margin-right: 10px;
}
/* 数据表格deployment名颜色 */
.deploy-body-deployname {
  color: #4795ee;
}
/* deployment名鼠标悬停 */
.deploy-body-deployname:hover {
  color: rgb(84, 138, 238);
  cursor: pointer;
  font-weight: bold;
}
</style>
