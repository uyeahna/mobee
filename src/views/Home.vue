<template>
  <div>
        <div class="container mt-3">
      <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="../assets/bossbaby2.png" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="../assets/cruella.png" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="../assets/angry.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="../assets/Benny Loves You.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="../assets/breaking news in yuba county.png" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <div v-if="movieList" class="container" id="movieList">
      <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
        <MovieItem 
        v-for="movie in movieList"
        :key="movie.id"
        :movie="movie"
        @click.native="movieDetail(movie.id)"
        class="movieItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MovieItem from '@/components/MovieItem'


export default {
  name: 'Home',
  components: {
    MovieItem,
  },
  data: function () {
    return {
      pageNumber: 2,
    }
  },
  methods: {
    movieDetail: function (movieId) {
      // console.log(movieId)
      if (!this.isLogin) {
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
    getNextMovie() {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.offsetHeight
        if (bottomOfWindow) {
          // console.log(this.pageNumber)
          this.$store.dispatch('getNextMovieList', this.pageNumber)
          this.pageNumber = this.pageNumber + 1
        }
      }
    }
  },
  created: function () {
    this.$store.dispatch('getInitialMovieList')
    this.pageNumber = 2
  },
  computed: {
    ...mapState([
      'movieList',
      'isLogin',
    ])
  },
  mounted: function () {
    this.getNextMovie()
  }
}
</script>

<style scoped>
#movieList {
  margin-top: 2.5rem;
}

.movieItem {
  cursor: pointer;
}
</style>