import {isDev} from '@/config'
wx.cloud.init({
  env: isDev ? 'step-cloud-test-a1a2ac' : 'step-cloud-release-a1a2ac'
})
console.info('cloud init')
const db = wx.cloud.database()
const todo = db.collection('todo')
const his = db.collection('history')
const tasks = db.collection('task-list')
const taskRecord = db.collection('task-records')

const getAll = function (handle, merge = []) {
  if (!handle.get) {
    console.error('can not get data from', handle)
    return
  }
  return handle.skip(merge.length).get()
    .then(res => {
      let t = {
        ...res,
        data: [
          ...merge,
          ...res.data
        ]
      }
      if (res.data.length < 20) {
        return t
      } else {
        return getAll(handle, t.data)
      }
    }, console.error)
}
let api = {
  task: {
    init () {
      return getAll(
        tasks
      )
    },
    add (title, tag, range) {
      return tasks.add({
        data: {
          title,
          tag,
          range,
          start: new Date(),
          end: null,
          active: true
        }
      })
    },
    updateRecord (taskId, week, field, value) {
      week = week.join('/')
      return taskRecord.where({
        task_id: taskId,
        week
      })
        .get()
        .then(res => {
          return taskRecord.doc(res.data[0]._id)
            .update({
              data: {
                [field]: value
              }
            })
        }, console.error)
    },
    getRecord (task, week, length) {
      week = week.join('/')
      return getAll(
        taskRecord.where({
          task_id: task,
          week
        })
      )
        .then(res => {
          if (res.data.length) {
            return res.data[0].record
          } else {
            return taskRecord.add({
              data: {
                task_id: task,
                week,
                record: Array.from({length}).map(() => 0)
              }
            })
              .then(() => Array.from({length}).map(() => 0), console.error)
          }
        }, console.error)
    }
  },
  todo: {
    init () {
      return getAll(
        todo
          .orderBy('done', 'asc')
          .orderBy('start', 'desc')
          .orderBy('end', 'desc')
      )
    },
    add (data) {
      return todo.add({data})
    },
    remove (id) {
      return todo.doc(id).remove()
    },
    update (id, field, value) {
      return todo.doc(id).update({
        data: {
          [field]: value
        }
      })
    },
    search ({target, content}) {
      return getAll(
        todo.where({
          content: new db.RegExp({
            regexp: content,
            options: 'i'
          }),
          done: target === 'dids'
        })
      )
    }
  },
  history: {
    update (target, content) {
      return getAll(
        his.where({
          target
        })
      )
        .then(res => {
          if (res.data.length) {
            his.doc(res.data[0]._id).update({
              data: {
                content
              }
            })
          } else {
            return his.add({
              data: {
                target,
                content
              }
            })
          }
        }, console.error)
    },
    get (target) {
      return getAll(
        his.where({
          target
        })
      )
        .then(res => {
          return res.data.length ? res.data[0].content : []
        })
    }
  }
}

const blandLoading = function (list) {
  for (let [name, fn] of Object.entries(api[list])) {
    api[list][name] = function (...args) {
      wx.showNavigationBarLoading()
      return fn(...args)
        .then(res => {
          wx.hideNavigationBarLoading()
          return res
        }, err => {
          wx.hideNavigationBarLoading()
          return Promise.reject(err)
        })
    }
  }
}

blandLoading('todo')
blandLoading('history')
blandLoading('task')

export default api
