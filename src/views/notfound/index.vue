<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  color: #333;
}

.not-found h1 {
  font-size: 6rem;
  margin: 0;
}

.not-found p {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.not-found a {
  margin-top: 1rem;
  font-size: 1rem;
  color: #42b983;
  text-decoration: none;
}

.not-found a:hover {
  text-decoration: underline;
}
</style>
