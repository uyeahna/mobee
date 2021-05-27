<template>
  <div>
    <hr>
    <div style="margin: auto;">
      <span class="display-5 text-warning">{{ genre.name }}</span>
        <!-- <span class="display-6">영화를 추천해요!</span> -->
    </div>
    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 mt-4">
      <RecommendationItem 
      v-for="movie in movieList"
      :key="movie.id"
      :movie="movie"
      @click.native="movieDetail(movie.id)"
      class="recommended"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import RecommendationItem from '@/components/RecommendationItem'

const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: 'RecommendationGenre',
  components: {
    RecommendationItem
  },
  props: {
    genre: {
      type: Object
    }
  },
  data: function () {
    return {
      movieList: [],
    }
  },
  methods: {
    movieDetail: function (movieId) {
      // console.log(movieId)
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        this.$router.push({
          name: 'MovieDetail',
          params: {
            movieId: movieId
          }
        })
      }
    },
  },
  created: function () {
    let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        let config = {
          Authorization: `JWT ${token}`
        }
        axios({
          method: 'get',
          url: `${SERVER_URL}/movies/recommendation/`,
          headers: config,
          params: {
            genre_id: this.genre.id
          }
      })
        .then(res => {
          this.movieList = res.data
        })
        .catch(() => {
          // console.log(error)
        })
    }
  }
}
</script>

<style>

</style>