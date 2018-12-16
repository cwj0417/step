// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import {formatTime} from '@/utils'

Vue.use(Vuex)

const didMap = item => {
  delete item._openid
  item.time = formatTime(item.time)
  return item
}

const store = new Vuex.Store({
  state: {
    dids: [],
    didDetail: {},
    searchHistory: {
      dids: [],
      todos: []
    },
    didsCurSearch: ''
  },
  mutations: {
    'dids-init' (state, dids) {
      state.dids = dids
    },
    'dids-add-item' (state, item) {
      item.time = formatTime(item.time)
      state.dids.unshift(item)
    },
    'dids-delete-item' (state, id) {
      state.dids.splice(state.dids.findIndex(item => item._id === id), 1)
    },
    'dids-set-detail' (state, item) {
      state.didDetail = item
    },
    'dids-update-title' (state, {id, title}) {
      state.dids.find(i => i._id === id).content = title
      if (state.didDetail._id === id) {
        state.didDetail.content = title
      }
    },
    'dids-update-detail' (state, {id, detail}) {
      state.dids.find(i => i._id === id).detail = detail
      if (state.didDetail._id === id) {
        state.didDetail.detail = detail
      }
    },
    'search-set-curSearch' (state, {target, content}) {
      state[`${target}CurSearch`] = content
      console.log(state)
    },
    'search-add-to-history' (state, {target, content}) {
      const i = state.searchHistory[target].indexOf(content)
      if (i !== -1) {
        state.searchHistory[target].splice(i, 1)
      }
      state.searchHistory[target].unshift(content)
      if (state.searchHistory[target].length > 10) {
        state.searchHistory[target].pop()
      }
    },
    'search-history-set' (state, {target, content}) {
      state.searchHistory[target] = content
    },
    'search-delete-history' (state, {target, item}) {
      const i = state.searchHistory[target].indexOf(item)
      state.searchHistory[target].splice(i, 1)
    }
  },
  actions: {
    'search-clear' ({commit, dispatch}, target) {
      dispatch(`${target}-init`)
      commit('search-set-curSearch', {target, content: ''})
    },
    'search-action' ({state, commit}, {target, content}) {
      commit('search-add-to-history', {target, content})
      api.history.update(target, state.searchHistory[target])
      api[target].search(content)
        .then(res => {
          commit('dids-init', res.data.map(didMap))
          commit('search-set-curSearch', {target, content})
        }, console.error)
    },
    'search-fetch-history' ({commit}, target) {
      api.history.get(target)
        .then(content => {
          commit('search-history-set', {target, content})
        })
    },
    'search-delete-history' ({state, commit}, {target, item}) {
      commit('search-delete-history', {target, item})
      api.history.update(target, state.searchHistory[target])
    },
    'search-clear-history' ({commit}, target) {
      commit('search-history-set', {target, content: []})
      api.history.update(target, [])
    },
    'dids-init' ({commit}) {
      api.dids.init()
        .then(res => {
          res = res.data.map(didMap)
          commit('dids-init', res)
        })
    },
    'dids-add-item' ({commit}, item) {
      const document = {
        time: Math.round(Date.now() / 1000),
        content: item,
        detail: ''
      }
      api.dids.add(document)
        .then(res => {
          document._id = res._id
          commit('dids-add-item', document)
        }, console.error)
    },
    'dids-delete-item' ({commit}, id) {
      api.dids.remove(id)
        .then(() => {
          commit('dids-delete-item', id)
        }, console.error)
    },
    'dids-update-title' ({commit}, {id, title}) {
      api.dids.update(id, 'content', title)
        .then(() => {
          commit('dids-update-title', {id, title})
        }, console.error)
    },
    'dids-update-detail' ({commit}, {id, detail}) {
      return api.dids.update(id, 'detail', detail)
        .then(() => {
          commit('dids-update-detail', {id, detail})
        }, console.error)
    }
  }
})

const init = () => {
  store.dispatch('dids-init')
}

init()

export default store
