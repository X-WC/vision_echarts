import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 主题名称
    theme: 'chalk'
  },
  mutations: {
    // 改变主题名称
    changeTheme (state) {
      if (state.theme === 'chalk') {
        state.theme = 'vintage'
      } else {
        state.theme = 'chalk'
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
