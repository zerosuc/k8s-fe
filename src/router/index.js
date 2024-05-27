import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login/index.vue'
import Layout from '@/components/layout/index.vue'
import HomeView from '@/views/home/index.vue'
import NotFound from '@/views/notfound/index.vue'

const asyncRoutes = [
  {
    path: '/workload',
    name: '工作负载',
    component: Layout,
    icon: 'menu',
    meta: { title: '工作负载', requireAuth: true },
    children: [
      {
        path: '/workload/deployment',
        name: 'Deployment',
        icon: 'el-icon-s-data',
        meta: { title: 'Deployment', requireAuth: true },
        component: () => import('@/views/deploy/index.vue')
      },
      {
        path: '/workload/pod',
        name: 'Pod',
        icon: 'el-icon-document-add',
        meta: { title: 'Pod', requireAuth: true },
        component: () => import('@/views/pod/index.vue')
      },
      {
        path: '/workload/daemonset',
        name: 'DaemonSet',
        icon: 'el-icon-document-add',
        meta: { title: 'DaemonSet', requireAuth: true },
        component: HomeView
      },
      {
        path: '/workload/statefulset',
        name: 'StatefulSet',
        icon: 'el-icon-document-add',
        meta: { title: 'StatefulSet', requireAuth: true },
        component: HomeView
      }
    ]
  },
  {
    path: '/loadbalance',
    name: '负载均衡',
    component: Layout,
    icon: 'files',
    meta: { title: '负载均衡', requireAuth: true },
    children: [
      {
        path: '/loadbalance/service',
        name: 'Service',
        icon: 'el-icon-s-data',
        meta: { title: 'Service', requireAuth: true },
        component: HomeView
      },
      {
        path: '/loadbalance/ingress',
        name: 'Ingress',
        icon: 'el-icon-document-add',
        meta: { title: 'Ingress', requireAuth: true },
        component: HomeView
      }
    ]
  },
  {
    path: '/storage',
    name: '存储与配置',
    component: Layout,
    icon: 'tickets',
    meta: { title: '存储与配置', requireAuth: true },
    children: [
      {
        path: '/storage/configmap',
        name: 'Configmap',
        icon: 'el-icon-document-add',
        meta: { title: 'Configmap', requireAuth: true },
        component: HomeView
      },
      {
        path: '/storage/secret',
        name: 'Secret',
        icon: 'el-icon-document-add',
        meta: { title: 'Secret', requireAuth: true },
        component: HomeView
      },
      {
        path: '/storage/persistentvolumeclaim',
        name: 'PVC',
        icon: 'el-icon-s-data',
        meta: { title: 'PersistentVolumeClaim', requireAuth: true },
        component: HomeView
      }
    ]
  },
  {
    path: '/cluster',
    name: '集群',
    component: Layout,
    icon: 'Cpu',
    meta: { title: '集群', requireAuth: true },
    children: [
      {
        path: '/cluster/node',
        name: 'Node',
        icon: 'el-icon-ship',
        meta: { title: 'Node', requireAuth: true },
        component: HomeView
      },
      {
        path: '/cluster/namespace',
        name: 'Namespace',
        icon: 'el-icon-ship',
        meta: { title: 'Namespace', requireAuth: true },
        component: HomeView
      },
      {
        path: '/cluster/persistentvolume',
        name: 'PersistentVolume',
        icon: 'el-icon-ship',
        meta: { title: 'PersistentVolume', requireAuth: true },
        component: HomeView
      }
    ]
  }
]

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: Layout,
    meta: { title: '概要', requireAuth: false },
    children: [
      {
        path: '',
        name: '概要',
        icon: 'Help',
        component: HomeView
      }
    ]
  },
  {
    path: '/workflow',
    component: Layout,
    icon: 'VideoPlay',
    children: [
      {
        path: '',
        name: '工作流',
        icon: 'VideoPlay',
        meta: { title: '工作流' },
        component: HomeView
      }
    ]
  },
  ...asyncRoutes,
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
