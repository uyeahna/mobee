<template>
  <div class="container mt-5">

      <p class="display-6 text-start text-warning">{{review.title}}</p>
      <h5 class="text-start">{{review.user}} | {{ $moment(review.created_at).format('YYYY년 MM월 DD일, h:mm:ss a') }}</h5>
      <hr>
      <h5 class="text-start text-light" id="reviewContent">{{ review.content }}</h5>
      <hr>
    <div class="text-start">
      <div class=" my-2 row">
        <span class="input-group form-group col-12 mb-2">
          <input type="text" class="form-control d-inline" placeholder="코멘트를 달아주세요" v-model="commentContent" @keypress.enter="submitComment">
          <button class="btn btn-light d-inline" id="commentBtn" @click="submitComment"><i class="fas fa-comment" style="color: #3B3F46;"></i> 작성</button>
        </span>
      </div>
      <ReviewDetailComment 
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @comment-update="reviewRefresh"
      />
    </div>
    <hr>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import ReviewDetailComment from '@/components/ReviewDetailComment'

const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  components: {
    ReviewDetailComment 
  },
  name: 'ReviewDetail',
  data: function () {
    return {
      reviewId: this.$route.params.reviewId,
      commentContent: '',
      page: 1,
      moreComment: true,
      notLoading: true,
    }
  },
  computed: {
    ...mapState([
      'review',
      'comments',
    ])
  },
  methods: {
    getNextComment: function () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.offsetHeight
        if (bottomOfWindow && this.moreComment && this.notLoading) {
          this.notLoading = false
          // console.log('comment_get_point')
          let token = localStorage.getItem('jwt')
          if (!token) {
            this.$emit('need-login')
          } else {
            let config = {
              Authorization: `JWT ${token}`
            }
            // 다음 페이지 있는지 확인
            axios({
              method: 'get',
              url: `${SERVER_URL}/community/review/${this.review.id}/comment/`,
              headers: config,
              params: {
                page: this.page,
                next: true,
              }
            })
              .then(res => {
                // console.log(res)
                if (res.data.next === true) {
                  this.page += 1
                  let pageData = {
                    page: this.page,
                    reviewId: this.review.id
                  }
                  this.$store.dispatch('storeReviewComment', pageData)
                  this.notLoading = true
                } else {
                  this.moreComment = false
                  this.notLoading = true
                }
              })
              .catch(() => {
                // console.log(error)
              })
            }
          }
        }
      },
    reviewRefresh: function () {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        this.$store.dispatch('setReviewComment', this.review.id)
        // let config = {
        //   Authorization: `JWT ${token}`
        // }
        // let requestData = {
        //   method: 'get',
        //   url: `${SERVER_URL}/community/review/${this.reviewId}/`,
        //   headers: config
        // }
        // axios(requestData)
        //   .then(res => {
        //     console.log(res)
        //     let requestData = {
        //       method: 'get',
        //       url: `${SERVER_URL}/community/review/${this.reviewId}/`,
        //       headers: config,
        //     }
        //     axios(requestData)
        //       .then(res => {
        //         this.$store.dispatch('storeReview', res.data)
        //       })
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
      }
    },
    submitComment: function () {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        let config = {
          Authorization: `JWT ${token}`
        }
        let data = {
          content: this.commentContent,
        }
        let requestData = {
          method: 'post',
          url: `${SERVER_URL}/community/review/${this.reviewId}/`,
          data: data,
          headers: config
        }
        axios(requestData)
          .then(() => {
            this.$store.dispatch('setReviewComment', this.review.id)
            // console.log(res)
            // let requestData = {
            //   method: 'get',
            //   url: `${SERVER_URL}/community/review/${this.reviewId}/`,
            //   headers: config,
            // }
            // axios(requestData)
            //   .then(res => {
            //     this.$store.dispatch('storeReview', res.data)
            //   })
          })
          .catch(() => {
            // console.log(err)
          })
      }
    }
  },
  created: function () {
  console.log('created!!!!!!!!!')
  this.$store.dispatch('setReviewComment', this.review.id)
  console.log(this.review.id)
  },
  mounted: function () {
    this.getNextComment()
  }
}
</script>

<style scoped>
.container {
  background-color: #3B3F46;
  padding: 4rem 5.5rem;
  border-radius: 0.5rem;
  margin-bottom: 3.5rem;
  max-width: 60rem;
}

#reviewContent {
  line-height: 2rem;
}

#commentBtn {
  border: 1px solid rgb(221, 221, 221);
}
</style>