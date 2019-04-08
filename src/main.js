// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
// import '@/assets/icons/iconfont.css'
import '@/assets/styles/transition.less'
import '@/assets/styles/common.less'

// basscss
import 'basscss/css/basscss.min.css'

// animate.css
import 'animate.css/animate.css'

// import '@/mock'
// 实际打包时应该不引入mock
// import env from '../config/env'
/* eslint-disable */
// env === 'development' ? require('@/mock') : ''
// import iviewArea from 'iview-area'
// Vue.use(iviewArea)

// 通用component
// table
import LegaTable from '@/components/table/LegaTable'
// form
import LegaForm from '@/components/form/LegaForm'
import LegaSearchForm from '@/components/form/LegaSearchForm'
// area
import alSelector from '@/components/area/al-selector.vue'
import alCascader from '@/components/area/al-cascader.vue'

Vue.component('LegaTable', LegaTable)
Vue.component('LegaForm', LegaForm)
Vue.component('LegaSearchForm', LegaSearchForm)

Vue.component('al-selector', alSelector)
Vue.component('al-cascader', alCascader)

// import 'swiper/dist/css/swiper.css'
// const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
// Vue.use(VueAwesomeSwiper)
// loadsh

import _ from 'lodash'

import { DynamicModal } from '@/utils/modalUtil'

Vue.prototype._ = _
Vue.prototype._dynamicModal = DynamicModal

// moment
import moment from 'moment'
Vue.prototype._moment = moment

Vue.prototype.$compile = Vue.compile

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
window._Vue = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
