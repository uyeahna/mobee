<template>
  <div>
    <p>userid</p>
    <input type="text" v-model="userId">
    <p>movieID</p>
    <input type="text" v-model="movieId">
    <star-rating :increment="0.5" v-bind:clearable="true" @rating-selected="setRating" v-model="rating"></star-rating>
  </div>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'

const SERVER_URL = 'http://127.0.0.1:8000'

export default {
  name: 'Rating',
  data: function () {
    return {
      userId: '',
      movieId: '',
      rating: 0,
    }
  },
  components: {
    StarRating
  },
  methods: {
    setRating: function (rating) {
      
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$router.push('Login')
        }
      let config = {
        Authorization: `JWT ${token}`
      }

      axios({
        method: 'post',
        // url은 추후 detail페이지에서 들어오면 자동으로 아다리되게 수정
        url: `${SERVER_URL}/movies/${this.movieId}/`,
        data: {
          rating: `${rating}`
        },
        headers: config
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      
    }
  }
}
</script>

<style>

</style>