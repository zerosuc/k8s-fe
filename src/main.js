import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './icon/icon.css'
import './icon/iconfont.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//codemirror编辑器
import { GlobalCmComponent } from 'codemirror-editor-vue3'
// 引入主题 可以从 codemirror/theme/ 下引入多个
// import 'codemirror/theme/idea.css'
// import 'codemirror/theme/darcula.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
// import 'codemirror/mode/yaml/yaml.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//引入codemirror编辑器
app.use(GlobalCmComponent, { componentName: 'codemirror' })
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
