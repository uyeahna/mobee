<template>
  <div class="col">
    <div class="card h-100">
      <img :src="POSTER_URL" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title fw-bold">{{ movie.title }}</h5>
        <p class="card-text"> <span class="text-warning">★</span> {{ movie.vote_average }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieItem',
  data: function () {
    return {
      POSTER_URL: `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`
    }
  },
  props: {
    movie: {
      type: Object
    }
  }
}
</script>

<style scoped>
.card {
  background: rgba(0, 0, 0, 0);
  border: 0px solid rgba(0, 0, 0, 0);
}

.card-img-top {
  height: 343px;
}
</style>