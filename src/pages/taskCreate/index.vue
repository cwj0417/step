<template>
  <div class="create-task">
    <div class="title-wrap">
      <div class="tw-date">
        {{curDate}}
      </div>
      <div class="tw-title">
        <input type="text" v-model="title" placeholder="input your task">
      </div>
    </div>
    <div class="tag-wrap">
      <div class="tag-title">
        tags
      </div>
      <div class="tag-list">
        <div class="tag" @click="tag = t" :class="{active: tag === t}" v-for="(t, index) of tags" :key="index">
          {{t}}
        </div>
      </div>
    </div>
    <div class="tag-wrap" style="border-bottom: 0; flex-grow: 1;">
      <div class="tag-title">
        execution period
      </div>
      <div class="tag-list">
        <div class="tag" @click="toggleRange(index)" :class="{active: r.active}" v-for="(r, index) of rangesWithActive" :key="index">
          {{r.name}}
        </div>
        <div class="tag" @click="reverseRange">
          reverse
        </div>
      </div>
    </div>
    <div class="action" @click="addTask">
      add task
    </div>
  </div>
</template>
<script>
  import {formatTime2} from '@/utils'
  import store from '@/store'
  const defaultValue = {
    title: '',
    tag: 'others',
    range: [0, 1, 2, 3, 4, 5, 6] // 0 is monday, 6 is sunday
  }
  export default {
    data () {
      return {
        curDate: formatTime2(),
        title: defaultValue.title,
        tags: ['life', 'study', 'exercise', 'diet', 'work', 'health', 'others'],
        tag: defaultValue.title,
        ranges: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        range: defaultValue.range
      }
    },
    computed: {
      rangesWithActive () {
        return this.ranges.map((name, index) => ({
          name,
          active: this.range.indexOf(index) > -1
        }))
      }
    },
    methods: {
      toggleRange (index) {
        if (this.range.indexOf(index) > -1) {
          this.range.splice(this.range.indexOf(index), 1)
        } else {
          this.range.push(index)
          this.range.sort()
        }
      },
      reverseRange () {
        let res = [0, 1, 2, 3, 4, 5, 6]
        for (let i of this.range) {
          res.splice(res.indexOf(i), 1)
        }
        this.range = res
      },
      addTask () {
        if (this.title && this.range.length) {
          store.dispatch('task-create', {
            title: this.title,
            tag: this.tag,
            range: this.range
          })
          this.title = defaultValue.title
          this.tag = defaultValue.tag
          this.range = defaultValue.range
          wx.navigateBack({delta: 1})
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles";
  .create-task {
    padding: 24rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    .title-wrap {
      height: 144rpx;
      border-bottom: 1rpx solid #eaeaea;
      .tw-date {
        margin: 24rpx 0;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #333;
      }
      .tw-title {
        font-size: 37rpx;
        line-height: 52rpx;
        color: #333;
      }
    }
    .tag-wrap {
      height: 264rpx;
      border-bottom: 1rpx solid #eaeaea;
      .tag-title {
        margin: 32rpx 0;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #333;
      }
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 40rpx;
        .tag {
          width: 162rpx;
          height: 64rpx;
          background-color: #fafafa;
          font-size: 32rpx;
          color: #999;
          line-height: 64rpx;
          text-align: center;
          border-radius: 32rpx;
          margin: 0 18rpx 24rpx 0;
          &:nth-child(4n) {
            margin-right: 0;
          }
          &.active {
            color: #fff;
            background-color: $vi_base;
          }
        }
      }
    }
    .action {
      width: 702rpx;
      height: 84rpx;
      margin: 40rpx 0;
      background: $vi_base;
      color: #fff;
      font-size: 32rpx;
      line-height: 84rpx;
      text-align: center;
      border-radius: 42rpx;
    }
  }
</style>
