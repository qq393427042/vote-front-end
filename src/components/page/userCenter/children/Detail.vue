<template>
  <div class="detail">de</div>
</template>

<script>
import bus from '../../../../eventBus'
export default {
  name: 'Detail',
  mounted () {
    bus.$emit('exMenu', '1')
  }
}
</script>

<style scoped>

</style>
