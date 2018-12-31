<template>
  <div class="wrap">
    <div class="main">
      <div class="header">
        <img src="../../assets/images/task_statistics.png" alt="" class="icon">
        <div class="curDate">{{curDate}}</div>
        <img src="../../assets/images/task_add.png" alt="" class="icon" @click="createTask">
      </div>
      <scroll-view class="task-list" scroll-y>
        <div class="task-item" v-for="(task, index) in list" :key="index">
          <div class="ti-indicator" @click="toggleDone(task)">
            <div class="ti-indicator-wrap">
              <img src="../../assets/images/did_item_indicator.png" alt="" v-if="task && task.todayDone">
              <img src="../../assets/images/did_item_indicator_inactive.png" alt="" v-else>
            </div>
          </div>
          <div class="ti-content">
            <div class="tic-content">
              <div class="tic-title">
                {{task.title}}
              </div>
              <div class="tic-tag">
                {{task.tag}}
              </div>
            </div>
            <div class="tic-record">
              <div class="tic-record-item" v-if="task.cr[i] && task.cr[i].if" :class="{yes: task.cr[i].status === 1, no: task.cr[i].status === -1}" v-for="(i, j) of 7" :key="j">{{i + 1}}</div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <step-navigator></step-navigator>
  </div>
</template>
<script>
  import stepNavigator from '@/components/navigator'
  import {formatTime2} from '@/utils'
  import store from '@/store'

  export default {
    data () {
      return {
        curDate: formatTime2()
      }
    },
    computed: {
      list () {
        let day = new Date().getDay()
        day -= 1
        if (day === -1) day = 6
        return store.state.tasks
          .filter(i => i.range.indexOf(day) > -1)
          .map(task => {
            let cr = {} // for computed record
            for (let i = 0; i < 7; i++) {
              let idx = task.range.indexOf(i)
              cr[i] = {
                if: idx > -1,
                status: idx > -1 ? task.record[idx] : 0
              }
            }
            task.cr = cr
            return task
          })
          .map(task => {
            task.todayDone = task.record[task.range.indexOf(day)] === 1
            return task
          })
      }
    },
    methods: {
      toggleDone (task) {
        let day = new Date().getDay()
        day -= 1
        if (day === -1) day = 6
        let value = task.record
        value[task.range.indexOf(day)] = task.todayDone ? -1 : 1
        store.dispatch('task-update-record', {
          id: task._id,
          field: 'record',
          value
        })
      },
      createTask () {
        wx.navigateTo({url: '/pages/taskCreate/main'})
      }
    },
    components: {stepNavigator},
    mounted () {
      wx.setNavigationBarTitle({
        title: 'weekly'
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles";

  .header {
    width: 750rpx;
    height: 106rpx;
    padding: 24rpx;
    background-color: #fafafa;
    display: flex;
    position: absolute;
    top: 0;
    .icon {
      width: 34rpx;
      height: 34rpx;
      margin-top: 12rpx;
      display: block;
    }
    .curDate {
      width: 634rpx;
      line-height: 58rpx;
      color: #666;
      font-size: 37rpx;
      text-align: center;
    }
  }
  .task-list {
    box-sizing: border-box;
    height: 100%;
    padding-top: 106rpx;
    .task-item {
      height: 150rpx;
      display: flex;
      .ti-indicator {
        width: 82rpx;
        .ti-indicator-wrap {
          width: 30rpx;
          height: 30rpx;
          margin: 61rpx 24rpx;
          img {
            display: block;
            width: 30rpx;
            height: 30rpx;
          }
        }
      }
      .ti-content {
        width: 668rpx;
        border-bottom: 1rpx solid #eaeaea;
        padding: 24rpx;
        .tic-content {
          display: flex;
          .tic-title {
            color: #333;
            font-size: 35rpx;
            line-height: 49rpx;
            flex-grow: 1;
          }
          .tic-tag {
            color: #999;
            font-size: 28rpx;
            line-height: 62rpx;
          }
        }
        .tic-record {
          height: 42rpx;
          display: flex;
          .tic-record-item {
            width: 42rpx;
            height: 42rpx;
            margin-right: 20rpx;
            border-radius: 50%;
            font-size: 28rpx;
            line-height: 42rpx;
            text-align: center;
            color: #999;
            border: 1px solid #eaeaea;
            &.yes {
              color: #fff;
              background-color: $vi_base;
              border-color: $vi_base;
            }
            &.no {
              background-color: #eaeaea;
            }
          }
        }
      }
    }
  }
</style>
