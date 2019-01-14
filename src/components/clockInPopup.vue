<template>
  <div class="clock-in-popup" :style="{'background-color': bg, opacity}" v-if="title">
    <div v-if="right < 280" class="ci-btn-left ci-btn" @touchstart="ts" @touchmove="tm" @touchend="te" :style="{left: 0, width: left + 'rpx', transition: isInTouch ? '0' : 'all .25s ease-in-out'}">
      <div class="icon">
        <img src="../assets/images/ci_fail.png" alt="">
      </div>
    </div>
    <div class="p1" v-if="right < 280 && left < 280">
      <img src="../assets/images/ci_hint_right.png" alt="">
    </div>
    <div class="p2" v-if="right < 280 && left < 280">{{title}}</div>
    <div class="p3" v-if="right < 280 && left < 280">{{date}}</div>
    <div class="p4" v-if="right < 280 && left < 280">
      <img src="../assets/images/ci_hint_left.png" alt="">
    </div>
    <div v-if="left < 280" class="ci-btn-right ci-btn" @touchstart="ts2" @touchmove="tm2" @touchend="te2" :style="{right: 0, width: right + 'rpx', transition: isInTouch ? '0' : 'all .25s ease-in-out'}">
      <div class="icon">
        <img src="../assets/images/ci_ok.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  import {scaleLinear} from 'd3-scale'
  let colorR = scaleLinear()
    .domain([0, 200])
    .range(['#28ac86', '#dc1b2f'])
  let colorG = scaleLinear()
    .domain([0, 200])
    .range(['#28ac86', '#65d889'])
  export default {
    data () {
      return {
        bg: '#28ac86',
        isInTouch: false,
        left: 80,
        right: 80,
        sx: null,
        sx2: null,
        opacity: 1
      }
    },
    props: ['title', 'date'],
    watch: {
      title: 'toggle',
      date: 'toggle'
    },
    methods: {
      ts (e) {
        if (e.touches.length === 1) {
          this.$emit('scrolldisable')
          this.isInTouch = true
          this.sx = e.touches[0].clientX
        }
      },
      tm (e) {
        if (e.touches.length === 1) {
          let moveX = e.touches[0].clientX
          let disX = (moveX - this.sx) * 2
          this.left = Math.max(0, disX) + 80
          this.bg = colorR(Math.max(0, Math.min(200, disX)))
        }
      },
      te (e) {
        if (e.mp.changedTouches.length === 1) {
          this.$emit('scrollenable')
          this.isInTouch = false
          let endX = e.mp.changedTouches[0].clientX
          let disX = (endX - this.sx) * 2
          this.left = disX >= 200 ? 700 : 80
          this.bg = '#28ac86'
          if (disX >= 200) {
            this.$emit('fail')
            this.toggle(0)
            setTimeout(() => {
              this.left = 80
            }, 1000)
          }
        }
      },
      ts2 (e) {
        if (e.touches.length === 1) {
          this.$emit('scrolldisable')
          this.isInTouch = true
          this.sx2 = e.touches[0].clientX
        }
      },
      tm2 (e) {
        if (e.touches.length === 1) {
          let moveX = e.touches[0].clientX
          let disX = (this.sx2 - moveX) * 2
          this.right = Math.max(0, disX) + 80
          this.bg = colorG(Math.max(0, Math.min(200, disX)))
        }
      },
      te2 (e) {
        if (e.mp.changedTouches.length === 1) {
          this.$emit('scrollenable')
          this.isInTouch = false
          let endX = e.mp.changedTouches[0].clientX
          let disX = (this.sx2 - endX) * 2
          this.right = disX >= 200 ? 700 : 80
          this.bg = '#28ac86'
          if (disX >= 200) {
            this.$emit('done')
            this.toggle(0)
            setTimeout(() => {
              this.right = 80
            }, 1000)
          }
        }
      },
      toggle (op = 1) {
        this.opacity = op
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../styles";
  .clock-in-popup {
    width: 702rpx;
    height: 84rpx;
    position: relative;
    border-radius: 42rpx;
    display: flex;
    color: #fff;
    line-height: 84rpx;
    overflow: hidden;
    transition: opacity 1s ease-in-out;
    .p1 {
      width: 108rpx;
      img {
        width: 20rpx;
        height: 18rpx;
        margin-left: 88rpx;
        margin-top: 33rpx;
        display: block;
      }
    }
    .p2 {
      padding-left: 20rpx;
      font-size: 32rpx;
      flex-grow: 1;
    }
    .p3 {
      padding-right: 20rpx;
      font-size: 28rpx;
      flex-shrink: 1;
    }
    .p4 {
      width: 108rpx;
      img {
        width: 20rpx;
        height: 18rpx;
        margin-right: 88rpx;
        margin-top: 33rpx;
        display: block;
      }
    }
    .ci-btn {
      position: absolute;
      height: 80rpx;
      top: 2rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      .icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
        background-color: #fff;
      }
    }
    .ci-btn-left {
      justify-content: flex-end;
      background-color: #dc1b2f;
      .icon > img {
        width: 28rpx;
        height: 28rpx;
        margin: 26rpx;
        display: block;
      }
    }
    .ci-btn-right {
      justify-content: flex-start;
      background-color: #65d889;
      .icon > img {
        width: 32rpx;
        height: 24rpx;
        margin: 28rpx 24rpx;
        display: block;
      }
    }
  }
</style>
