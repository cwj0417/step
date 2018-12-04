<template>
  <div @click="test">
    <p class="card">
      {{text}}
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    test () {
      console.log('111')
    }
  },
  props: ['text']
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
