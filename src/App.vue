<script>
  export default {
    created () {
      // 调用API从本地缓存中获取数据
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      console.log('app created and cache logs by setStorageSync')
    }
  }
</script>

<style lang="scss">
  @import "./styles";

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
  }

  div {
    box-sizing: border-box;
  }

  /* this rule will be remove */
  * {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }

  /* navigator */

  page {
    height: 100%;
    overflow: hidden;
  }

  .wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .main {
      width: 100%;
      height: 100%;
      padding-bottom: 98rpx;
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
  /* navigator end */
</style>
