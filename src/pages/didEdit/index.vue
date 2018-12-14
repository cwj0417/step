<template>
  <div class="did-edit-wrap">
    <div class="did-edit-main">
      <div class="did-edit-title">
        <div class="det-date">
          {{item.time}}
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
      <div class="did-edit-txt">
        <div class="detxt-display" v-if="!isEditingDetail">
          {{item.detail}}
        </div>
        <div class="detxt-input" v-if="isEditingDetail">
          <textarea :auto-height="true" placeholder="输入备注(少于1000字)" v-model="inputDetail" :focus="taFocus" placeholder-style="line-height: 40rpx;" ></textarea>
        </div>
      </div>
    </div>
    <div class="did-edit-btn">
      <div class="did-btn" @click="editDetail">修改</div>
      <div class="did-btn" :class="{active: isEditingDetail}" @click="submit">确定</div>
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
        return store.state.didDetail
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
          store.dispatch('did-update-title', {id: this.item._id, title: newVal})
        }
        this.isEditingTitle = false
        this.titleFocus = false
      },
      submit () {
        if (!this.isEditingDetail) {
          wx.navigateBack({delta: 1})
        } else {
          if (this.inputDetail.trim() && this.inputDetail !== this.item.detail) {
            store.dispatch('did-update-detail', {id: this.item._id, detail: this.inputDetail})
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
      display: flex;
      flex-direction: column;
      .did-edit-title {
        height: 164rpx;
        margin: 24rpx;
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
      .did-edit-txt {
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
        }
        .detxt-input {
          width: 100%;
          flex-grow: 1;
          textarea {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .did-edit-btn {
      width: 100%;
      height: 200rpx;
      padding: 44rpx 0;
      display: flex;
      justify-content: flex-end;
      .did-btn {
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
