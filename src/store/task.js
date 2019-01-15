import api from '@/api'
import {getWeek} from '@/utils'

const week = getWeek()

export default {
  mutations: {
    'task-init' (state, task) {
      state.tasks.push(task)
    },
    'task-update-record' (state, {id, field, value}) {
      let index = state.tasks.findIndex(i => i._id === id)
      if (index > -1) {
        state.tasks.splice(index, 1, {
          ...state.tasks[index],
          [field]: value
        })
      }
    }
  },
  actions: {
    'task-init' ({dispatch}) {
      return api.task.init()
        .then(res => {
          res = res.data
          res.forEach(item => {
            dispatch('task-fetch-record', item)
          })
          return res
        }, console.error)
    },
    'task-update-record' ({commit}, {id, field, value, w = week}) {
      if (+w[0] === +week[0] && +w[1] === +week[1]) {
        commit('task-update-record', {id, field, value})
      }
      return api.task.updateRecord(id, w, field, value)
        .then(res => {
          return res
        }, console.error)
    },
    'task-fetch-record' ({commit}, item) {
      api.task.getRecord(item._id, week, item.range.length)
        .then(record => {
          item.record = record
          commit('task-init', item)
        }, console.error)
    },
    'task-create' ({commit, dispatch}, {title, tag, range}) {
      api.task.add(title, tag, range)
        .then(res => {
          let item = {
            _id: res._id,
            title,
            tag,
            range,
            active: true,
            start: new Date(),
            end: null
          }
          dispatch('task-fetch-record', item)
        }, console.error)
    }
  }
}
