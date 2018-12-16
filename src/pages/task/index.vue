<template>
  <div class="wrap">
    <div class="main">
      Coming Soon
    </div>
    <step-navigator></step-navigator>
  </div>
</template>
<script>
  import stepNavigator from '@/components/navigator'
  export default {
    data () {
      return {}
    },
    components: { stepNavigator },
    mounted () {
      wx.setNavigationBarTitle({
        title: 'task'
      })
    }
  }
</script>
<style>

</style>
