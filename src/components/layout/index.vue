<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-aside class="aside" :width="asideWidth">
        <el-affix class="aside-affix" :z-index="1200">
          <div class="aside-logo">
            <svg class="icon" aria-hidden="true" width="20" height="20">
              <use xlink:href="#icon-k8s"></use>
            </svg>
            <span :class="[isCollapse ? 'is-collapse' : '']">
              <span class="logo-name">云管平台</span>
            </span>
          </div>
        </el-affix>
        <el-menu
          class="aside-menu"
          router
          :default-active="$route.path"
          :collapse="isCollapse"
          background-color="#121b27"
          text-color="#bfcdb9"
          active-text-color="#20a0ff"
        >
          <div v-for="menu in routers" :key="menu">
            <el-menu-item
              class="aside-menu-item"
              v-if="menu.children && menu.children.length === 1"
              :index="menu.children[0].path"
            >
              <el-icon><component :is="menu.children[0].icon" /></el-icon>
              <template #title>{{ menu.children[0].name }}</template>
            </el-menu-item>
            <el-sub-menu
              class="aside-submenu"
              v-else-if="menu.children && menu.children.length > 1"
              :index="menu.path"
            >
              <template #title>
                <el-icon><component :is="menu.icon" /></el-icon>
                <span :class="[isCollapse ? 'is-collapse' : '']">{{ menu.name }}</span>
              </template>
              <el-menu-item
                class="aside-menu-childitem"
                v-for="child in menu.children"
                :key="child"
                :index="child.path"
              >
                <template #title>{{ child.name }}</template>
              </el-menu-item>
            </el-sub-menu>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <el-row :gutter="20">
            <el-col :span="1">
              <div class="header-collapse" @click="onCollapse">
                <el-icon><component :is="isCollapse ? 'expand' : 'fold'" /></el-icon>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="header-breadcrumb">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item :to="{ path: '/' }">DASH</el-breadcrumb-item>
                  <template v-for="(matched, m) in $route.matched" :key="m">
                    <el-breadcrumb-item v-if="matched.name !== undefined">
                      {{ matched.name }}
                    </el-breadcrumb-item>
                  </template>
                </el-breadcrumb>
              </div>
            </el-col>
            <el-col class="header-menu" :span="13">
              <el-dropdown>
                <div class="header-dropdown">
                  <el-image class="avator-image" :src="auator" />
                  <span>{{ username }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                    <el-dropdown-item @click="changepwd">修改密码</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
        <el-footer class="footer">
          <el-icon style="width: 2em; top: 3px; font-size: 18px"><place /></el-icon>
          <a class="footer el-icon-place">devops platform</a>
        </el-footer>
        <el-backtop target=".el-main"></el-backtop>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import auator from '@/assets/avator/avator.png'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const asideWidth = ref('220px')
const routers = ref([])

const username = computed(() => {
  const name = localStorage.getItem('username')
  return name ? name : 'unknown'
})

const onCollapse = () => {
  if (isCollapse.value) {
    asideWidth.value = '220px'
    isCollapse.value = false
  } else {
    asideWidth.value = '64px'
    isCollapse.value = true
  }
}

const logout = () => {
  localStorage.removeItem('username')
  localStorage.removeItem('token')
  router.push('/login')
}

const changepwd = () => {
  alert('changepwd')
}

onBeforeMount(() => {
  routers.value = router.options.routes
  console.log(routers.value)
})
</script>

<style scoped>
.aside {
  transition: all;
  background-color: #131b27;
}
.aside-logo {
  background-color: #131b27;
  height: 60px;
  color: white;
}
.logo-image {
  width: 40px;
  height: 40px;
  top: 12px;
}
.logo-name {
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
}
.aside::-webkit-scrollbar {
  display: none;
}
.aside-affix {
  border-bottom-width: 0;
}
.aside-menu {
  border-right-width: 0;
}
.aside-menu-item.is-active {
  background-color: #1f2a3a;
}
.aside-menu-item {
  padding-left: 20px !important;
}
.aside-menu-item:hover {
  background-color: #142c4e;
}
.aside-menu-childitem {
  padding-left: 40px !important;
}
.aside-menu-childitem.is-active {
  background-color: #1f2a3a;
}
.aside-menu-childitem:hover {
  background-color: #142c4e;
}
.header {
  z-index: 1200;
  line-height: 60px;
  font-size: 24px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.12),
    0 0 6px rgba(0, 0, 0, 0.04);
}
.header-collapse {
  cursor: pointer;
}
.header-breadcrumb {
  padding-top: 0.9em;
}
.header-menu {
  text-align: right;
}
.is-collapse {
  display: none;
}
.header-dropdown {
  line-height: 60px;
  cursor: pointer;
}
.avator-image {
  top: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
}
.main {
  padding: 10px;
}
.footer {
  z-index: 1200;
  color: rgb(187, 184, 184);
  font-size: 14px;
  text-align: center;
  line-height: 60px;
}
.icon {
  width: 40px;
  height: 40px;
}
</style>
