import db from '@/utils/localstorage'

export default {
  namespaced: true,
  state: {
    teachingInfo:null,
    stage:null
  },
  mutations: {
    setInfo(state, val) {
      state.teachingInfo = val
    },
    setStage(state,val){
      state.stage=val
    }

  }
}
