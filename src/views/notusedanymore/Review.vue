<template>
  <div>
    <input type="text" v-model="reviewId">
    <button @click="getReview">getreview</button>
    <div>
      {{ review }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReviewList',
  data: function () {
    return {
      reviewId: '',
      review: []
    }
  },
  methods: {
    setToken: function () {
      // 저장된 jwt를 가져온다
      const jwt = localStorage.getItem('jwt')
      const config = {
        Authorization: `JWT ${jwt}`
      }
      return config
    },
    getReview: function () {
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/community/${this.reviewId}/`,
        headers: this.setToken(),
      })
        .then(res => {
          this.review = res.data
        })
    }
  },
}
</script>

<style>

</style>