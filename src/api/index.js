import {isDev} from '@/config'
wx.cloud.init({
  env: isDev ? 'step-cloud-test-a1a2ac' : 'step-cloud-release-a1a2ac'
})
console.info('cloud init')
const db = wx.cloud.database()
const dids = db.collection('dids')
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
    }
  }
}
export default api
