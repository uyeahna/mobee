<template>
  <tr @click="reviewDetail(review.id)">
    <th scope="row" class="text-start">{{ review.user }}</th>
    <td class="text-start">{{ review.title.substr(0, 40) }} [{{ review.comment_count }}]</td>
    <td>{{ reviewCreated }}</td>
    <td>{{ review.rating }}</td>
    
  </tr>
</template>

<script>
export default {
  name: 'MovieDetailReview',
  props: {
    review: {
      type: Object
    }
  },
  data: function () {
    return {
      reviewCreated: null,
    }
  },
  methods: {
    reviewDetail: function (reviewId) {
      // console.log('entry point')
      this.$store.dispatch('reviewDetail', this.review)
      this.$router.push({
        name: 'ReviewDetail',
        params: {
          reviewId: reviewId
        }
      })
    }
    //   let token = localStorage.getItem('jwt')
    //   if (!token) {
    //     this.$emit('need-login')
    //   } else {
    //     this.$store.dispatch('storeReview', this.review)
    //     this.$router.push({
    //       name: 'ReviewDetail',
    //       params: {
    //         reviewId: reviewId
    //       }
    //     })
    //   }
    // }
  },
  created: function () {
    this.reviewCreated = new Date(this.review.created_at).toLocaleDateString('ko-KR')
  }
}
</script>

<style>

</style>