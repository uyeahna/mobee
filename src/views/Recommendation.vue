<template>
      <!-- @click.native="" -->
  <div v-if="genreList.length" class="container mt-4" id="movieList">
    <h2 class="display-2 d-inline">{{ userId }}</h2>
    <h2 class="display-5 d-inline"> 님을 위한 추천이에요!</h2>
    <RecommendationGenre 
      v-for="genre in genreList"
      :key="genre.id"
      :genre="genre"
    />
  </div>
  <div v-else>
    <p class="display-1">평점을 남겨주시면 영화를 추천해드릴게요!</p>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import RecommendationGenre from '@/components/RecommendationGenre'


const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: 'Recommendation',
  components: {
    RecommendationGenre
  },
  data: function() {
    return {
      genreList: [],
    }
  },
  created: function () {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      }
      let config = {
        Authorization: `JWT ${token}`
      }
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/recommendation_genre/`,
        headers: config
      })
        .then(res => {
          this.genreList = res.data
        })
        .catch(() => {
          // console.log(err)
        })
  },
  methods: {

  },
  computed: {
    ...mapState([
      'userId'
    ])
  }
}
</script>

<style scoped>

/* #user_chuchu {
  background-color: #2A2E34;
  width: 50rem;
  height: 15rem;
  margin: auto;
  padding: auto;
  border-radius: 10px;
} */

</style>