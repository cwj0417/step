<template>
  <div>
    <div class="swiper-slot" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :style="{left: left + 'rpx', transition: isInTouch ? 'all .05s' : 'all .25s ease-in-out'}">
      <slot></slot>
      <div class="btn-area">
        <div class="btn">
          <div class="btn-wrap" @click="$emit('btn1')">
            <img src="../assets/images/icon_edit.png" alt="">
          </div>
        </div>
        <div class="btn">
          <div class="btn-wrap" @click="$emit('btn2')">
            <img src="../assets/images/icon_delete.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['scope', 'index'],
    data () {
      return {
        startX: 0,
        left: 0,
        isBtnShown: false,
        isInTouch: false
      }
    },
    methods: {
      touchS (e) {
        if (e.touches.length === 1) {
          this.isInTouch = true
          this.startX = e.touches[0].clientX
        }
      },
      touchM (e) {
        if (e.touches.length === 1) {
          let moveX = e.touches[0].clientX
          let disX = this.startX - moveX
          if (disX > 0 && !this.isBtnShown) {
            this.left = -1 * Math.min(260, disX)
          }
          if (disX < 0 && this.isBtnShown) {
            this.left = -260 - disX
          }
        }
      },
      touchE (e) {
        if (e.mp.changedTouches.length === 1) {
          this.isInTouch = false
          let endX = e.mp.changedTouches[0].clientX
          let disX = this.startX - endX
          if (!this.isBtnShown) {
            this.left = disX > 80 ? -260 : 0
            this.isBtnShown = disX > 130
          } else {
            this.left = disX > -80 ? -260 : 0
            this.isBtnShown = disX > -130
          }
          if (this.isBtnShown) {
            this.$emit('closeOthers', this.index)
          }
        }
      },
      swipeBack () {
        this.isBtnShown = false
        this.isInTouch = false
        this.left = 0
      }
    }
  }
</script>
<style scoped lang="scss">
  .swiper-slot {
    display: flex;
    width: 1010rpx;
    position: relative;
    .btn-area {
      width: 260rpx;
      height: 130rpx;
      display: flex;
      .btn {
        width: 130rpx;
        height: 130rpx;
        background-color: #f6f6f6;
        .btn-wrap {
          width: 68rpx;
          height: 68rpx;
          margin: 31rpx;
          background-color: #fff;
          border-radius: 50%;
          img {
            width: 36rpx;
            height: 36rpx;
            margin: 16rpx;
          }
        }
      }
    }
  }
</style>
