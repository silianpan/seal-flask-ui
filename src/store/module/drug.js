import { DrugTypeService } from '@/api/ehr/drug'
export default {
  state: {
    typeData: []
  },
  mutations: {
    setTypeData (state, payload) {
      state.typeData = payload
    }
  },
  actions: {
    getAllType({ commit }) {
      DrugTypeService.getType().then(res => {
        if (res.status === 0) {
          commit('setTypeData', res.data)
        }
      })
    }
  }
}
