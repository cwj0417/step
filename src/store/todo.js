import api from '@/api'
import {formatTime} from '@/utils'

const didMap = item => {
  delete item._openid
  item.start = formatTime(item.start)
  item.end = formatTime(item.end)
  return item
}

export default {
  mutations: {
    'todo-init' (state, todos) {
      state.todos = todos
    },
    'todo-add-item' (state, item) {
      item.start = formatTime(item.start)
      item.end = formatTime(item.end)
      state.todos.unshift(item)
    },
    'todo-delete-item' (state, id) {
      state.todos.splice(state.todos.findIndex(item => item._id === id), 1)
    },
    'todo-set-detail' (state, item) {
      state.detail = item
    },
    'todo-update-title' (state, {id, title}) {
      state.todos.find(i => i._id === id).content = title
      if (state.detail._id === id) {
        state.detail.content = title
      }
    },
    'todo-update-detail' (state, {id, detail}) {
      state.todos.find(i => i._id === id).detail = detail
      if (state.detail._id === id) {
        state.detail.detail = detail
      }
    },
    'todo-toggle-done' (state, item) {
      state.todos.find(i => i._id === item._id).done = !item.done
      if (state.detail._id === item._id) {
        state.detail.done = !item.done
      }
    },
    'todo-toggle-stick' (state, item) {
      state.todos.find(i => i._id === item._id).stick = !item.stick
      if (state.detail._id === item._id) {
        state.detail.stick = !item.stick
      }
    },
    'todo-update-end' (state, id) {
      state.todos.find(i => i._id === id).end = formatTime(Math.round(Date.now() / 1000))
      if (state.detail._id === id) {
        state.detail.end = formatTime(Math.round(Date.now() / 1000))
      }
    },
    'search-set-curSearch' (state, {target, content}) {
      state[`${target}CurSearch`] = content
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
      dispatch(`todo-init`)
      commit('search-set-curSearch', {target, content: ''})
    },
    'search-action' ({state, commit}, {target, content}) {
      commit('search-add-to-history', {target, content})
      api.history.update(target, state.searchHistory[target])
      api.todo.search({target, content})
        .then(res => {
          commit('todo-init', res.data.map(didMap))
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
    'todo-init' ({commit}) {
      return api.todo.init()
        .then(res => {
          res = res.data.map(didMap)
          commit('todo-init', res)
          return res
        })
    },
    'todo-add-item' ({commit}, {content, done}) {
      const document = {
        start: Math.round(Date.now() / 1000),
        end: Math.round(Date.now() / 1000),
        content,
        detail: '',
        stick: false,
        done
      }
      api.todo.add(document)
        .then(res => {
          document._id = res._id
          commit('todo-add-item', document)
        }, console.error)
    },
    'todo-delete-item' ({commit}, id) {
      api.todo.remove(id)
        .then(() => {
          commit('todo-delete-item', id)
        }, console.error)
    },
    'todo-update-title' ({commit}, {id, title}) {
      api.todo.update(id, 'content', title)
        .then(() => {
          commit('todo-update-title', {id, title})
        }, console.error)
    },
    'todo-update-detail' ({commit}, {id, detail}) {
      return api.todo.update(id, 'detail', detail)
        .then(() => {
          commit('todo-update-detail', {id, detail})
        }, console.error)
    },
    'todo-toggle-done' ({commit}, item) {
      return api.todo.update(item._id, 'done', !item.done)
        .then(() => {
          commit('todo-toggle-done', item)
          if (!item.done) {
            return api.todo.update(item._id, 'end', Math.round(Date.now() / 1000))
              .then(() => {
                commit('todo-update-end', item._id)
              }, console.error)
          }
        }, console.error)
    },
    'todo-toggle-stick' ({commit}, item) {
      return api.todo.update(item._id, 'stick', !item.stick)
        .then(() => {
          commit('todo-toggle-stick', item)
        }, console.error)
    }
  }
}
