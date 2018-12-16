import {isDev} from '@/config'
wx.cloud.init({
  env: isDev ? 'step-cloud-test-a1a2ac' : 'step-cloud-release-a1a2ac'
})
console.info('cloud init')
const db = wx.cloud.database()
const dids = db.collection('dids')
const his = db.collection('history')
const api = {
  dids: {
    init () {
      return dids.orderBy('time', 'desc').get()
    },
    add (data) {
      return dids.add({data})
    },
    remove (id) {
      return dids.doc(id).remove()
    },
    update (id, field, value) {
      return dids.doc(id).update({
        data: {
          [field]: value
        }
      })
    },
    search (content) {
      return dids.where({
        content: new db.RegExp({
          regexp: content,
          options: 'i'
        })
      })
        .get()
    }
  },
  history: {
    update (target, content) {
      return his.where({
        target
      })
        .get()
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
      return his.where({
        target
      })
        .get()
        .then(res => {
          return res.data.length ? res.data[0].content : []
        })
    }
  }
}
export default api
