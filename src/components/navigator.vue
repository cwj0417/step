<template>
  <div class="nav">
    <div @click="to('/pages/did/main')" class="nav-item">
      <div class="nav-name">
        <img src="../assets/images/nav_did.png">
        <div>待做事项</div>
      </div>
    </div>
    <div @click="to('/pages/task/main')" class="nav-item">
      <div class="nav-name">
        <img src="../assets/images/nav_did.png">
        <div>每周任务</div>
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
