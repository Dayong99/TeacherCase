import db from '@/utils/localstorage'

export default {
  namespaced: true,
  state: {
    case:null,
    teaching:null,
  },
  mutations: {
    setCase(state, val) {
      state.case = val
    },
    setTeaching(state, val) {
      state.teaching = val
    },

  }
}
