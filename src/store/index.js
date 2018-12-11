// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import {formatTime} from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    dids: [],
    didDetail: {}
  },
  mutations: {
    'did-init' (state, dids) {
      state.dids = dids
    },
    'did-add-item' (state, item) {
      item.time = formatTime(new Date(item.time * 1000))
      state.dids.unshift(item)
    },
    'did-delete-item' (state, id) {
      state.dids.splice(state.dids.findIndex(item => item._id === id), 1)
    },
    'did-set-detail' (state, item) {
      state.didDetail = item
    }
  },
  actions: {
    'did-add-item' (store, item) {
      const document = {
        time: Math.round(Date.now() / 1000),
        content: item,
        detail: ''
      }
      api.dids.add(document)
        .then(res => {
          document._id = res._id
          store.commit('did-add-item', document)
        }, console.error)
    },
    'did-delete-item' (store, id) {
      api.dids.remove(id)
        .then(() => {
          store.commit('did-delete-item', id)
        }, console.error)
    }
  }
})

const init = () => {
  api.dids.init()
    .then(res => {
      res = res.data.map(item => {
        delete item._openid
        item.time = formatTime(new Date(item.time * 1000))
        return item
      })
      store.commit('did-init', res)
    })
}

init()

export default store
