<template>
  <div class="dids-edit-wrap">
    <div class="dids-edit-main">
      <div class="dids-edit-title">
        <div class="det-date">
          {{item.end}}
        </div>
        <div class="det-title">
          <div class="dett-display" v-if="!isEditingTitle">
            {{item.content}}
          </div>
          <div class="dett-edit-btn" v-if="!isEditingTitle" @click="editTitle">
            <img src="../../assets/images/icon_edit_green.png" alt="">
          </div>
          <div class="dett-input" v-if="isEditingTitle">
            <input type="text" :focus="titleFocus" :value="item.content" @change="changeTitle($event)">
          </div>
        </div>
      </div>
      <div class="dids-edit-txt">
        <scroll-view scroll-y class="detxt-display" v-if="!isEditingDetail">
          <text>{{item.detail}}</text>
        </scroll-view>
        <div class="detxt-input" v-if="isEditingDetail">
          <textarea cursor-spacing="200rpx" maxlength="1000" placeholder="write your detail(less than 1000 words)" v-model="inputDetail" :focus="taFocus" placeholder-style="line-height: 40rpx;" ></textarea>
        </div>
      </div>
    </div>
    <div class="dids-edit-btn">
      <div class="dids-btn" @click="editDetail">modify</div>
      <div class="dids-btn" :class="{active: isEditingDetail}" @click="submit">submit</div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  export default {
    data () {
      return {
        isEditingTitle: false,
        isEditingDetail: false,
        titleFocus: false,
        taFocus: false,
        inputDetail: ''
      }
    },
    computed: {
      item () {
        return store.state.detail
      }
    },
    methods: {
      editTitle () {
        this.isEditingTitle = true
        this.titleFocus = true
      },
      editDetail () {
        this.isEditingDetail = true
        this.taFocus = true
      },
      changeTitle (e) {
        let newVal = e.target.value
        if (newVal.trim() && newVal !== this.item.content) {
          store.dispatch('todo-update-title', {id: this.item._id, title: newVal})
        }
        this.isEditingTitle = false
        this.titleFocus = false
      },
      submit () {
        if (!this.isEditingDetail) {
          wx.navigateBack({delta: 1})
        } else {
          if (this.inputDetail.trim() && this.inputDetail !== this.item.detail) {
            store.dispatch('todo-update-detail', {id: this.item._id, detail: this.inputDetail})
              .then(() => {
                this.inputDetail = this.item.detail
              }, console.error)
          }
          this.isEditingDetail = false
          this.taFocus = false
        }
      }
    },
    mounted () {
      this.inputDetail = this.item.detail
      if (!this.item.detail) {
        this.editDetail()
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles";

  .dids-edit-wrap {
    padding: 24rpx;
    width: 750rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    .dids-edit-main {
      width: 100%;
      flex-grow: 1;
      border-radius: 8rpx;
      box-shadow: 0 0 4rpx #eaeaea;
      display: flex;
      flex-direction: column;
      .dids-edit-title {
        height: 164rpx;
        margin: 24rpx 24rpx 0;
        border-bottom: 1rpx solid #eaeaea;
        .det-date {
          padding-top: 24rpx;
          color: #999;
          font-size: 28rpx;
          line-height: 40rpx;
          height: 64rpx;
        }
        .det-title {
          margin: 24rpx 0;
          color: #333;
          font-size: 37rpx;
          line-height: 52rpx;
          height: 52rpx;
          display: flex;
          .dett-display {
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
          }
          .dett-edit-btn {
            width: 52rpx;
            height: 52rpx;
            margin-left: 8rpx;
            img {
              width: 28rpx;
              height: 28rpx;
              margin: 12rpx
            }
          }
          .dett-input {
            width: 100%;
            input {
              width: 100%;
            }
          }
        }
      }
      .dids-edit-txt {
        padding: 32rpx 24rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #333;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .detxt-display {
          width: 100%;
          flex-grow: 1;
          word-break: break-all;
          word-wrap: break-word;
          height: 100%;
          overflow: auto;
        }
        .detxt-input {
          width: 100%;
          flex-grow: 1;
          word-break: break-all;
          word-wrap: break-word;
          textarea {
            width: 100%;
            overflow: auto;
            height: 700rpx;
          }
        }
      }
    }
    .dids-edit-btn {
      width: 100%;
      height: 200rpx;
      padding: 44rpx 0;
      display: flex;
      justify-content: flex-end;
      .dids-btn {
        width: 184rpx;
        height: 64rpx;
        border-radius: 32rpx;
        border: 1rpx solid $vi_base;
        color: $vi_base;
        text-align: center;
        line-height: 64rpx;
        font-size: 32rpx;
        margin-left: 24rpx;
        &.active {
          background-color: $vi_base;
          color: #fff;
        }
      }
    }
  }
</style>
