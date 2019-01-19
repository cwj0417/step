<template>
  <div class="task-detail">
    <div class="task-title" style="display: flex;">
      <button style="width: 30%; height: 100rpx;" @click="setMonth(-1)">上个月</button>
      {{curCalender.month + 1}}月
      <button style="width: 30%; height: 100rpx;" @click="setMonth(32)">下个月</button>
      <div class="calender-head">
        <div class="ch-item">Mon</div>
        <div class="ch-item">Tue</div>
        <div class="ch-item">Wed</div>
        <div class="ch-item">Thu</div>
        <div class="ch-item">Fri</div>
        <div class="ch-item">Sat</div>
        <div class="ch-item">Sun</div>
      </div>
    </div>
    <div class="task-calender" v-if="!calender.length">
      loading...
    </div>
    <div class="task-calender" v-else>
      <div class="tc-tr" v-for="(week, wi) of calender" :key="wi" :class="{'extra-line': calender.length === 6}">
        <img src="../../assets/images/start_flag.png" class="start-week tc-start-week" alt="" v-if="week.type === 'startWeek'">
        <div class="tc-td" :class="{suc: day.status === 1, fail: day.status === -1}" v-for="(day, di) of week.data" :key="di">
          {{day.day}}
        </div>
      </div>
    </div>
    <div class="task-data">
      <div class="task-data-title">
        <img src="../../assets/images/start_flag.png" class="start-week tdt-p1" alt="">
        <div class="tdt-p2">开始周</div>
        <div class="tdt-p3">{{task.startDesc}}</div>
      </div>
      <div class="task-data-list">
        <div class="task-data-list-item" v-for="(week, wi) of calender" :key="wi">
          <div class="tdli-p1">第{{week.w[1]}}周</div>
          <div class="tdli-p2" v-if="week.type === 'invalid'">---</div>
          <div class="tdli-p2" v-else>{{week.complete}} / {{task.range.length}}</div>
          <div class="tdli-p3" v-if="week.type === 'invalid'">---</div>
          <div class="tdli-p3" v-else>须努力</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {getWeek, getDayByWeek} from '@/utils'
  import api from '@/api'
  import store, { initiate } from '@/store'

  const getDateByWeek = (...args) => getDayByWeek(...args).getDate()
  export default {
    data () {
      return {
        task: {},
        curCalender: {
          year: new Date().getFullYear(),
          month: new Date().getMonth()
        },
        calender: []
      }
    },
    methods: {
      init (taskId) {
        setTimeout(() => {
          this.task = store.state.tasks.find(({_id}) => _id === taskId)
          wx.setNavigationBarTitle({
            title: this.task.title
          })
          const startWeek = getWeek(this.task.start)
          this.task.startDesc = `${startWeek[0]}年 第${startWeek[1]}周`
          console.log('task', this.task)
          this.getRecordByMonth(this.curCalender)
        }, 350) // delay for system reason: store can not be fetch at once
      },
      getRecordByMonth ({year, month}) {
        // get weeks
        let weeks = []
        let _day = new Date()
        _day.setFullYear(year, month, 1)
        let offset = _day.getDay()
        offset = offset === 0 ? 6 : offset - 1
        _day.setDate(_day.getDate() - offset)
        while ((month - _day.getMonth()) === 0 || (month - _day.getMonth()) === 1 || (month - _day.getMonth()) === -11) {
          weeks.push(getWeek(_day))
          _day.setDate(_day.getDate() + 7)
        }
        api.task.getRecordByIdAndWeeks(this.task._id, weeks)
          .then(res => {
            // traverse weeks
            const startWeek = getWeek(this.task.start)
            const thisWeek = getWeek()
            let calender = []
            for (let w of weeks) {
              // before start week or after this week
              if (
                (+w[0] < +startWeek[0] || (+w[0] === +startWeek[0] && +w[1] < +startWeek[1])) ||
                (+w[0] > +thisWeek[0] || (+w[0] === +thisWeek[0] && +w[1] > +thisWeek[1]))
              ) {
                let tmpWeek = []
                for (let i = 0; i < 7; i++) {
                  tmpWeek.push({
                    day: getDateByWeek(...w, i),
                    status: 0
                  })
                }
                calender.push({
                  type: 'invalid',
                  data: tmpWeek,
                  w,
                  complete: 0
                })
              } else {
                // normal case
                // judge type
                let type
                if (w.toString() === startWeek.toString()) {
                  type = 'startWeek'
                } else if (w.toString() === thisWeek.toString()) {
                  type = 'thisWeek'
                } else {
                  type = 'normal'
                }
                // fetch status in res (api result name)
                let tmpWeek = []
                for (let i = 0; i < 7; i++) {
                  let status = 0
                  if (this.task.range.indexOf(i) > -1) {
                    status = res.find(r => r.week === w.join('/')).record[this.task.range.indexOf(i)]
                  }
                  tmpWeek.push({
                    day: getDateByWeek(...w, i),
                    status
                  })
                }
                calender.push({
                  type,
                  data: tmpWeek,
                  w,
                  complete: tmpWeek.reduce((a, b) => b.status === 1 ? a + 1 : a, 0)
                })
              }
            }
            this.calender = calender
            console.log(calender)
          }, console.error)
      },
      setMonth (day) {
        let thisMonth = new Date()
        thisMonth.setFullYear(this.curCalender.year, this.curCalender.month, 1)
        thisMonth.setDate(day)
        this.curCalender = {
          year: thisMonth.getFullYear(),
          month: thisMonth.getMonth()
        }
        this.getRecordByMonth(this.curCalender)
      }
    },
    mounted () {
      const taskId = this.$root.$mp.query.taskId || 'XCXqveSiwXKAQnRc'
      if (!taskId) return
      initiate.then(() => this.init(taskId))
    },
    onUnload () {
      this.task = {}
      this.curCalender = {
        year: new Date().getFullYear(),
        month: new Date().getMonth()
      }
      this.calender = []
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles";
  .start-week {
    width: 12rpx;
    height: 24rpx;
  }
  .task-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    .task-title {
      flex-grow: 1;
      position: relative;
      background-color: $vi_base;
      .calender-head {
        position: absolute;
        bottom: 0;
        left: 25rpx;
        border-radius: 20rpx 20rpx 0 0;
        height: 80rpx;
        display: flex;
        background-color: #fff;
        .ch-item {
          font-size: 28rpx;
          line-height: 80rpx;
          width: 64rpx;
          height: 80rpx;
          margin: 0 18rpx;
          text-align: center;
          color: #999;
        }
      }
    }
    .task-calender {
      height: 454rpx;
      width: 700rpx;
      margin: 0 auto;
      border-radius: 0 0 20rpx 20rpx;
      box-shadow: 0 8rpx 2rpx rgba(216, 216, 216, 0.5);
      .tc-tr {
        border-top: 1rpx solid #EAEAEA;
        height: 90rpx;
        width: 100%;
        display: flex;
        position: relative;
        &.extra-line {
          height: 75rpx;
          .tc-td {
            margin: 8rpx 20rpx 7rpx;
            width: 60rpx;
            height: 60rpx;
            line-height: 60rpx;
            font-size: 30rpx;
          }
        }
        .tc-start-week {
          position: absolute;
          top: 12rpx;
          left: 17rpx;
        }
        .tc-td {
          width: 64rpx;
          height: 64rpx;
          line-height: 64rpx;
          font-size: 32rpx;
          margin: 13rpx 18rpx;
          border-radius: 50%;
          color: #999;
          text-align: center;
          &.suc {
            background-color: $vi_base;
            color: #fff;
          }
          &.fail {
            background-color: #E01627;
            color: #fff;
          }
        }
      }
    }
    .task-data {
      height: 460rpx;
      padding: 0 24rpx;
      .task-data-title {
        height: 104rpx;
        border-bottom: 1rpx solid #eaeaea;
        display: flex;
        .tdt-p1 {
          margin: 40rpx 8rpx;
        }
        .tdt-p2 {
          margin: 32rpx 50rpx 32rpx 8rpx;
          color: #999;
          font-size: 28rpx;
          line-height: 40rpx;
        }
        .tdt-p3 {
          margin: 32rpx 0;
          color: #333;
          font-size: 28rpx;
          line-height: 40rpx;
        }
      }
      .task-data-list {
        height: 355rpx;
        .task-data-list-item {
          height: 70rpx;
          display: flex;
          color: #333;
          font-size: 28rpx;
          line-height: 70rpx;
          text-align: center;
          .tdli-p1 {
            width: 90rpx;
            margin-left: 26rpx;
            color: #999;
          }
          .tdli-p2 {
            flex-grow: 1;
          }
          .tdli-p3 {
            width: 90rpx;
            margin-right: 26rpx;
          }
        }
      }
    }
  }
</style>
