<template>
  <div class="search-wrap">
    <div class="search-input-wrap">
      <div class="icon-search">
        <img src="../../assets/images/icon_search.png" alt="">
      </div>
      <input type="text" v-model="searchContent" @change="search('')" class="search-input" placeholder="search...">
      <div class="icon-clear" @click="searchContent = ''">
        <img src="../../assets/images/icon_cross.png" alt="">
      </div>
    </div>
    <div class="search-history-indicator">
      <div class="search-history-txt">
        search history
      </div>
      <div class="search-history-clear" @click="clearHis">
        <img src="../../assets/images/icon_trash.png" alt="">
      </div>
    </div>
    <div class="search-history-list">
      <div class="search-history" v-for="(his, index) of histories" :key="index">
        <div class="sh-dot"></div>
        <div class="sh-content" @click="search(his)">
          {{his}}
        </div>
        <div class="sh-icon" @click="deleteHis(his)">
          <img src="../../assets/images/icon_cross.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  export default {
    data () {
      return {
        target: 'dids',
        searchContent: ''
      }
    },
    computed: {
      histories () {
        return store.state.searchHistory[this.target]
      }
    },
    methods: {
      search (ctt) {
        ctt = ctt || this.searchContent
        if (ctt) {
          store.dispatch('search-action', {
            target: this.target,
            content: ctt
          })
          this.searchContent = ''
          wx.navigateBack({delta: 1})
        }
      },
      deleteHis (item) {
        store.dispatch('search-delete-history', {
          target: this.target,
          item
        })
      },
      clearHis () {
        store.dispatch('search-clear-history', this.target)
      }
    },
    mounted () {
      this.target = this.$root.$mp.query.target || 'dids'
      store.dispatch('search-fetch-history', this.target)
    }
  }
</script>
<style lang="scss">
  .search-wrap {
    padding: 24rpx 0 24rpx 24rpx;
    .search-input-wrap {
      margin: 36rpx 24rpx 36rpx 0;
      height: 64rpx;
      border-radius: 32rpx;
      background-color: #eaeaea;
      display: flex;
      .icon-search {
        width: 64rpx;
        height: 64rpx;
        padding: 18rpx;
        img {
          display: block;
          width: 28rpx;
          height: 28rpx;
        }
      }
      .search-input {
        flex-grow: 1;
        height: 64rpx;
        line-height: 64rpx;
        font-size: 28rpx;
      }
      .icon-clear {
        width: 64rpx;
        height: 64rpx;
        padding: 20rpx;
        img {
          display: block;
          width: 22rpx;
          height: 22rpx;
        }
      }
    }
    .search-history-indicator {
      height: 40rpx;
      margin-right: 24rpx;
      display: flex;
      justify-content: space-between;
      .search-history-txt {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #999;
      }
      .search-history-clear {
        img {
          display: block;
          width: 22rpx;
          height: 22rpx;
          margin-top: 9rpx;
        }
      }
    }
    .search-history-list {
      .search-history {
        height: 90rpx;
        border-bottom: 1rpx solid #eaeaea;
        display: flex;
        .sh-dot {
          background-color: #eaeaea;
          width: 10rpx;
          height: 10rpx;
          border-radius: 5rpx;
          margin:62rpx 20rpx 18rpx 0;
        }
        .sh-content {
          flex-grow: 1;
          padding-top: 42rpx;
          line-height: 45rpx;
          font-size: 32rpx;
          color: #333;
        }
        .sh-icon {
          width: 22rpx;
          height: 22rpx;
          margin:58rpx 24rpx 10rpx 0;
          img {
            width: 22rpx;
            height: 22rpx;
            display: block;
          }
        }
      }
    }
  }
</style>
