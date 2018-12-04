<template>
  <div class="nav">
    <div @click="to('/pages/did/main')" class="nav-item">
      <div class="nav-name">
        <img src="../assets/images/nav_did.png">
        did
      </div>
    </div>
    <div @click="to('/pages/task/main')" class="nav-item">
      <div class="nav-name">
        <img src="../assets/images/nav_did.png">
        task
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      to (url) {
        wx.reLaunch({url})
      }
    }
  }
</script>

<style lang="scss">
  @import "../styles";

  page {
    height: 100%;
    overflow: hidden;
  }

  .wrap {
    width: 100%;
    height: 100%;
    .main {
      width: 100%;
      /*height: 100%;*/
      /*padding-bottom: 98rpx;*/
      box-sizing: border-box;
    }
    .nav {
      position: absolute;
      bottom: 0;
      display: flex;
      height: 98rpx;
      width: 100%;
      z-index: 999;
      .nav-item {
        flex-grow: 1;
        .nav-name {
          padding-top: 10rpx;
          margin: 0 auto;
          color: $vi_base;
          width: 54rpx;
          line-height: 28rpx;
          font-size: 20rpx;
          text-align: center;
          img {
            width: 54rpx;
            height: 54rpx;
          }
        }
      }
    }
  }
</style>
