<template>
  <div class="wrap">
    <div class="main">
      <div class="did-todo-nav">
        <div class="did-toto-nav-item dtni-did" @click="curPage = 1" :class="{active: curPage === 1}">did</div>
        <div class="did-toto-nav-item dtni-todo" @click="curPage = 2" :class="{active: curPage === 2}">todo</div>
      </div>
      <div class="did-wrap" v-if="curPage === 1">
        <div class="dw-filter-and-search">
          search
        </div>
        <div class="dw-content-wrap">
          <swiperCell ref="didItem" v-for="(did, index) of dids" :key="index" :scope="did" :index="index" @btn1="editDid(did)" @btn2="deleteDid(did)" @closeOthers="closeOthers">
            <div class="dw-content-item" :class="{striped: index % 2 === 1}">
              <div class="dwct-p1">
                <img src="../../assets/images/did_item_indicator.png" alt="">
              </div>
              <div class="dwct-p2">
                {{scope && scope.content}}
              </div>
              <div class="dwct-p3">
                {{scope && scope.time}}
              </div>
            </div>
          </swiperCell>
        </div>
        <div class="dw-input-wrap">
          <div class="dwiw-p1">
            +
          </div>
          <div class="dwiw-p2"></div>
          <div class="dwiw-p3">
            <input ref="addInput" :value="addInput" type="text" @change="addDid($event)" placeholder="record what u've done today"
                   placeholder-style="color: rgba(255, 255, 255, .5);">
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
  import swiperCell from '@/components/swiperCell'
  import store from '@/store'

  export default {
    data () {
      return {
        curPage: 1,
        addInput: ''
      }
    },
    computed: {
      dids () {
        return store.state.dids
      }
    },
    components: {stepNavigator, swiperCell},
    methods: {
      addDid (e) {
        if (e.target.value.trim()) {
          store.dispatch('did-add-item', e.target.value)
          this.$forceUpdate()
        }
      },
      editDid (item) {
        console.log('edit', item)
      },
      deleteDid (item) {
        store.dispatch('did-delete-item', item._id)
        this.$refs.didItem.forEach(vm => {
          if (vm.isBtnShown) {
            vm.swipeBack()
          }
        })
      },
      closeOthers (index) {
        this.$refs.didItem.forEach(vm => {
          if (vm.index !== index) {
            vm.swipeBack()
          }
        })
      }
    },
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
    .did-todo-nav {
      width: 750rpx;
      height: 106rpx;
      display: flex;
      position:absolute;
      top: 0;
      z-index: 1;
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
      height:100%;
      padding-top: 106rpx;
      .dw-filter-and-search {
        width: 750rpx;
        height: 60rpx;
        background-color: #dedede;
        color: #999;
        padding: 10rpx 24rpx;
        position: absolute;
        top: 106rpx;
        z-index: 1;
      }
      .dw-content-wrap {
        overflow-x: hidden;
        overflow-y: scroll;
        height: 100%;
        padding: 60rpx 0 94rpx;
        .dw-content-item {
          width: 750rpx;
          height: 130rpx;
          padding: 40rpx 24rpx;
          position: relative;
          display: flex;
          line-height: 50rpx;
          .dwct-p1 {
            width: 30rpx;
            img {
              width: 30rpx;
              height: 30rpx;
            }
          }
          .dwct-p2 {
            flex-grow: 1;
            color: #333;
            font-size: 35rpx;
            padding-left: 30rpx;
          }
          .dwct-p3 {
            width: 152rpx;
            color: #999;
            font-size: 28rpx;
            text-align: right;
          }
          .dwct-p4 {

          }
          &.striped {
            background-color: #fafafa;
          }
        }
      }
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
