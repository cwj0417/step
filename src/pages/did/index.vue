<template>
  <div class="wrap">
    <div class="main">
      <div class="dids-todo-nav">
        <div class="dids-todo-nav-item" @click="setPage('done')" :class="{active: curPage === 'done'}">did</div>
        <div class="dids-todo-nav-item" @click="setPage('active')" :class="{active: curPage === 'active'}">todo</div>
      </div>
      <div class="dids-wrap">
        <div class="dw-filter-and-search">
          <div class="dfas-desc">
            {{curSearch}}
          </div>
          <div class="dfas-icon-wrap">
            <img src="../../assets/images/icon_search_active.png" alt="" class="dfas-icon" @click="clearSearch" v-if="curSearch">
            <img src="../../assets/images/icon_search.png" alt="" class="dfas-icon" @click="search" v-else>
            <!--<img src="../../assets/images/icon_filter.png" alt="" class="dfas-icon">-->
          </div>
        </div>
        <scroll-view :scroll-y="wrapScroll" class="dw-content-wrap">
          <swiperCell ref="didItem" v-for="(todo, index) of todos" @scrollenable="wrapScroll = true" @scrolldisable="wrapScroll = false" :key="index" :page="curPage" :scope="todo" :index="index" @btn1="editDid(todo)" @btn2="deleteDid(todo)" @btn3="toggleStick(todo)" @closeOthers="closeOthers">
            <div class="dw-content-item" :class="{striped: index % 2 === 1}">
              <div class="dwct-p1" @click="toggleDone(todo)">
                <img src="../../assets/images/did_item_indicator.png" alt="" v-if="scope && scope.done">
                <img src="../../assets/images/did_item_indicator_inactive.png" alt="" v-else>
              </div>
              <div class="dwct-p2" @click="todo.detail && editDid(todo)">
                {{scope && scope.content}}
              </div>
              <div class="dwct-p3" @click="todo.detail && editDid(todo)">
                {{scope && scope.end}}
              </div>
              <img class="dwct-p4" src="../../assets/images/item_corner.png" alt="" v-if="scope && scope.detail">
              <img class="dwct-p4" src="../../assets/images/item_stick.png" alt="" v-if="scope && scope.stick">
            </div>
          </swiperCell>
          <div class="empty" v-if="!todos.length">
            <template v-if="curPage === 'active'">
              all todos has been done
            </template>
            <template v-if="curPage === 'done'">
              nothing has been done
            </template>
          </div>
        </scroll-view>
        <div class="dw-input-wrap" :style="{bottom: inputBottom}" @click="inputFocus = true">
          <div class="dwiw-p1">
            +
          </div>
          <div class="dwiw-p2"></div>
          <div class="dwiw-p3">
            <input :focus="inputFocus" :value="addInput" type="text" @change="addDid($event)"
                   v-show="inputFocus"
                   @focus="addInputFocus"
                   :adjust-position="false">
            <div class="placeholder" v-show="!inputFocus">
              {{placeholder}}
            </div>
          </div>
        </div>
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
        curPage: 'done',
        addInput: '',
        inputFocus: false,
        wrapScroll: true,
        inputBottom: '98rpx'
      }
    },
    computed: {
      todos () {
        let t = store.state.todos.filter(i => i.done === (this.curPage === 'done'))
        return [...t.filter(i => i.stick), ...t.filter(i => !i.stick)]
      },
      curSearch () {
        return this.curPage === 'done' ? store.state.didsCurSearch : store.state.todosCurSearch
      },
      placeholder () {
        return this.curPage === 'done' ? `what you've done today` : `what you plan to do`
      }
    },
    components: {stepNavigator, swiperCell},
    methods: {
      addDid (e) {
        this.inputBottom = '98rpx'
        this.inputFocus = false
        if (e.target.value.trim()) {
          store.dispatch('todo-add-item', {
            content: e.target.value,
            done: this.curPage === 'done'
          })
          this.$forceUpdate()
        }
      },
      editDid (item) {
        store.commit('todo-set-detail', item)
        this.closeOthers(-1)
        wx.navigateTo({url: '/pages/didEdit/main'})
      },
      deleteDid (item) {
        store.dispatch('todo-delete-item', item._id)
        this.closeOthers(-1)
      },
      toggleStick (item) {
        store.dispatch('todo-toggle-stick', item)
        this.closeOthers(-1)
      },
      closeOthers (index) {
        this.$refs.didItem.forEach(vm => {
          if (vm.index !== index) {
            vm.swipeBack()
          }
        })
      },
      search () {
        wx.navigateTo({url: `/pages/search/main?target=${this.curPage === 'done' ? 'dids' : 'todos'}`})
      },
      clearSearch () {
        store.dispatch('search-clear', this.curPage === 'done' ? 'dids' : 'todos')
      },
      setPage (page) {
        this.inputFocus = false
        this.curPage = page
        store.dispatch('todo-init')
        store.commit('search-set-curSearch', {target: 'dids', content: ''})
        store.commit('search-set-curSearch', {target: 'todos', content: ''})
        this.$refs.didItem.forEach(vm => {
          if (vm.isBtnShown) {
            vm.swipeBack()
          }
        })
      },
      toggleDone (item) {
        this.setPage(item.done ? 'active' : 'done')
        store.dispatch('todo-toggle-done', item)
      },
      addInputFocus (e) {
        let mp = e.mp
        let kbh = mp.detail.height
        this.inputBottom = kbh + 'px'
      }
    },
    mounted () {
      wx.setNavigationBarTitle({
        title: 'todos'
      })
    }
  }
</script>
<style lang="scss">
  @import "../../styles";

  .main {
    .dids-todo-nav {
      width: 750rpx;
      height: 106rpx;
      display: flex;
      position:absolute;
      top: 0;
      z-index: 1;
      .dids-todo-nav-item {
        text-align: center;
        width: 104rpx;
        height: 106rpx;
        margin: 0 135rpx;
        color: #666;
        line-height: 106rpx;
        &.active {
          color: $vi_base;
          border-bottom: 8rpx solid $vi_base;
        }
      }
    }
    .dids-wrap {
      flex-grow: 1;
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
        line-height: 40rpx;
        display: flex;
        .dfas-desc {
          /*width: 594rpx;*/
          width: 644rpx;
        }
        .dfas-icon-wrap {
          .dfas-icon {
            width: 30rpx;
            height: 30rpx;
            margin-left: 24rpx;
          }
        }
      }
      .dw-content-wrap {
        box-sizing: border-box;
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
              display: block;
              margin-top: 10rpx;
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
            position: absolute;
            right: 0;
            top: 0;
            width: 32rpx;
            height: 28rpx;
          }
          &.striped {
            background-color: #fafafa;
          }
        }
        .empty {
          color: #999;
          padding: 160rpx;
          font-weight: bold;
        }
      }
      .dw-input-wrap {
        height: 94rpx;
        width: 750rpx;
        background-color: $vi_base;
        position: absolute;
        padding: 24rpx 24rpx 25rpx 24rpx;
        display: flex;
        .dwiw-p1 {
          width: 35rpx;
          height: 35rpx;
          margin: 5rpx 23rpx 5rpx 0;
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
          .placeholder {
            color: rgba(255, 255, 255, .5);
            line-height: 45rpx;
            height: 45rpx;
          }
        }
      }
    }
    .todos-wrap {
      flex-grow: 1;
      position: relative;
      height:100%;
      padding-top: 106rpx;
    }
  }
</style>
