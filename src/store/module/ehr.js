import { MedicalOrgService } from '@/api/ehr/org'
import _ from 'lodash'
export default {
  state: {
    areaData: {}
  },
  mutations: {
    setAreaData(state, data) {
      state.areaData = data
    }
  },
  actions: {
    findAreaData({ commit }) {
      commit('setAreaData', {})
      MedicalOrgService.findAll().then(res => {
        let tmpMap = {}
        if (!_.isEmpty(res) && !_.isEmpty(res.data)) {
          const item = res.data
          for (let i = 0; i < item.length; ++i) {
            tmpMap[item[i].code] = item[i].name
          }
        }
        commit('setAreaData', { map: tmpMap })
      })
    }
  },
  getters: {
    getAreaData: state => {
      return state.areaData
    }
  }
}
