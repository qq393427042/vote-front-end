<template>
  <div class="detail">
    <vue-poll v-bind="options" @addvote="addVote"/>
  </div>
</template>

<script>
import bus from '../../../../eventBus'
import VuePoll from 'vue-poll'
export default {
  name: 'Detail',
  mounted () {
    bus.$emit('exMenu', '1')
  },
  data () {
    return {
      options: {
        question: 'What\'s your favourite <strong>JS</strong> framework?',
        answers: [
          { value: 1, text: 'Vue', votes: 53 },
          { value: 2, text: 'React', votes: 35 },
          { value: 3, text: 'Angular', votes: 30 },
          { value: 4, text: 'Other', votes: 10 }
        ]
      }
    }
  },
  components: {
    VuePoll
  },
  methods: {
    addVote (obj) {
      console.log('You voted ' + obj.value + '!')
    }
  }
}
</script>

<style scoped>

</style>
