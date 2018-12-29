import api from '@/api'
import {getWeek} from '@/utils'

const week = getWeek()

export default {
  mutations: {
    'task-init' (state, task) {
      state.tasks.push(task)
    },
    'task-update-record' (state, {id, field, value}) {
      state.tasks.find(i => i._id === id)[field] = value
    }
  },
  actions: {
    'task-init' ({commit}) {
      api.task.init()
        .then(res => {
          res = res.data
          res.forEach(item => {
            api.task.getRecord(item._id, week, item.range.length)
              .then(record => {
                item.record = record
                commit('task-init', item)
              }, console.error)
          })
        }, console.error)
    },
    'task-update-record' ({commit}, {id, field, value}) {
      commit('task-update-record', {id, field, value})
      api.task.updateRecord(id, week, field, value)
        .then(() => {
        }, console.error)
    }
  }
}
