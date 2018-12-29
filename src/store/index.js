// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import todos from './todo'
import tasks from './task'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // todos
    todos: [],
    detail: {},
    searchHistory: {
      dids: [],
      todos: []
    },
    didsCurSearch: '',
    todosCurSearch: '',
    // tasks
    tasks: []
  },
  mutations: {
    ...todos.mutations,
    ...tasks.mutations
  },
  actions: {
    ...todos.actions,
    ...tasks.actions
  }
})

const init = () => {
  store.dispatch('todo-init')
  store.dispatch('task-init')
}

init()

export default store
