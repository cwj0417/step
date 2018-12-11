<template>
  <div class="did-edit-wrap">
    <div class="did-edit-main">
      <div class="did-edit-title">
        <div class="det-date">
          {{item.time}}
        </div>
        <div class="det-title">
          {{item.content}}
        </div>
      </div>
      <div class="did-edit-txt">
        {{item.detail}}
        {{item._id}}
      </div>
    </div>
    <div class="did-edit-btn">

    </div>
  </div>
</template>
<script>
  import store from '@/store'
  export default {
    computed: {
      item () {
        return store.state.didDetail
      }
    },
    mounted () {
      //
    }
  }
</script>
<style lang="scss">
  .did-edit-wrap {
    padding: 24rpx;
    width: 750rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    .did-edit-main {
      width: 100%;
      flex-grow: 1;
      border-radius: 8rpx;
      box-shadow: 0 0 4rpx #eaeaea;
      .did-edit-title {
        height: 188rpx;
        margin: 24rpx;
        border-bottom: 1rpx solid #eaeaea;
      }
    }
    .did-edit-btn {
      width: 100%;
      height: 200rpx;
    }
  }
</style>
