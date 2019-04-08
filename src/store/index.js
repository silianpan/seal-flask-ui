import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import dict from './module/dict'
import drug from './module/drug'
import ehr from './module/ehr'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    dict,
    drug,
    ehr
  }
})
