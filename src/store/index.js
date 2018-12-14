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
    },
    'did-update-title' (state, {id, title}) {
      state.dids.find(i => i._id === id).content = title
      if (state.didDetail._id === id) {
        state.didDetail.content = title
      }
    },
    'did-update-detail' (state, {id, detail}) {
      state.dids.find(i => i._id === id).detail = detail
      if (state.didDetail._id === id) {
        state.didDetail.detail = detail
      }
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
    },
    'did-update-title' (store, {id, title}) {
      api.dids.update(id, 'content', title)
        .then(() => {
          store.commit('did-update-title', {id, title})
        }, console.error)
    },
    'did-update-detail' (store, {id, detail}) {
      return api.dids.update(id, 'detail', detail)
        .then(() => {
          store.commit('did-update-detail', {id, detail})
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
