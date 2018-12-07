<template>
  <div class="wrap">
    <div class="main">
      <div class="did-todo-nav">
        <div class="did-toto-nav-item dtni-did" @click="curPage = 1" :class="{active: curPage === 1}">did</div>
        <div class="did-toto-nav-item dtni-todo" @click="curPage = 2" :class="{active: curPage === 2}">todo</div>
      </div>
      <div class="did-wrap" v-if="curPage === 1">
        <div class="dw-input-wrap">
          <div class="dwiw-p1">
            +
          </div>
          <div class="dwiw-p2"></div>
          <div class="dwiw-p3">
            <input type="text" placeholder="record what u've done today" placeholder-style="color: rgba(255, 255, 255, .5);">
          </div>
        </div>
      </div>
      <div class="todo-wrap" v-if="curPage === 2">
        todo
      </div>
    </div>
    <step-navigator></step-navigator>
  </div>
</template>
<script>
  import stepNavigator from '@/components/navigator'
  export default {
    data () {
      return {
        curPage: 1
      }
    },
    components: { stepNavigator },
    mounted () {
      wx.setNavigationBarTitle({
        title: 'did'
      })
    }
  }
</script>
<style lang="scss">
  @import "../../styles";
  .main {
    display: flex;
    flex-direction: column;
    .did-todo-nav {
      width: 750rpx;
      height: 106rpx;
      display: flex;
      .did-toto-nav-item {
        text-align: center;
        width: 90rpx;
        height: 106rpx;
        margin: 0 143rpx;
        color: #666;
        line-height: 106rpx;
        &.dtni-did {
          margin: 0 73rpx 0 212rpx;
        }
        &.dtni-todo {
          margin: 0 212rpx 0 73rpx;
        }
        &.active {
          color: $vi_base;
          border-bottom: 8rpx solid $vi_base;
        }
      }
    }
    .did-wrap {
      flex-grow: 1;
      position: relative;
      .dw-input-wrap {
        height: 94rpx;
        width: 750rpx;
        background-color: $vi_base;
        position: absolute;
        bottom: 0;
        padding: 24rpx 24rpx 25rpx 24rpx;
        display: flex;
        .dwiw-p1 {
          width: 35rpx;
          height: 35rpx;
          margin: 4rpx 23rpx 4rpx 0;
          color: #fff;
          font-size: 60rpx;
          line-height: 23rpx;
        }
        .dwiw-p2 {
          width: 2rpx;
          height: 32rpx;
          background-color: #f0f0f0;
          opacity: 0.5;
          margin: 7rpx 0 6rpx 0;
        }
        .dwiw-p3 {
          margin-left: 24rpx;
          flex-grow: 1;
          input {
            height: 45rpx;
            min-height: 45rpx;
            color: #fff;
          }
        }
      }
    }
    .todo-wrap {
      flex-grow: 1;
    }
  }
</style>
