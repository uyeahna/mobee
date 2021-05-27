<template>
  <div v-if="movie" class="container mt-5">
    <div class="row">
      <div class="col-4 d-flex flex-column align-items-center">
        <img :src="POSTER_URL" class="card-img-top" alt="...">
        <star-rating :increment="0.5" v-bind:clearable="true" @rating-selected="setRating" :padding="4" :show-rating="false" :rounded-corners="true" v-model="rating" class="mt-3 mx-5"></star-rating>
      </div>    
      <div class="col-8 d-flex flex-column align-items-start">
        <div class="d-flex col-12 justify-content-between align-items-end">
          <h2 class="fw-bold title mt-3">{{ movie.title }}</h2>
          <p class="mt-2 mb-0 releaseDate">{{ movie.release_date }}</p>
        </div>
        <h3 class="col-12 text-start fw-bold overviewHeader mt-3">줄거리</h3>
        <span class="overview text-start">{{ movie.overview }}</span>
        <div v-if="isMyReview" class="col-12 ">
          <div class="overviewHeader d-flex justify-content-between">
            <h3 class="col-10 text-start fw-bold mt-3 d-inline">내 리뷰</h3>
            <button type="button" class="btn " data-bs-toggle="modal" data-bs-target="#reviewModal" style="color: #dfdfdf;" @click="isEditing"><i class="far fa-edit fa-lg"></i></button>
            <button class="btn" style="color: Tomato;" @click="deleteReview"><i class="far fa-trash-alt fa-lg"></i></button>
          </div>
          <table class="table table-dark table-striped table-hover" @click="reviewDetail(myReview.id)">
            <!-- <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">제목</th>
                <th scope="col">일시</th>
                <th scope="col">평점</th>
              </tr>
            </thead> -->
            <tbody>
              <td class="text-start">{{ myReview.title.substr(0, 20) }} [{{ myReview.comment_count}}]</td>
            </tbody>
          </table>
              <p class="text-start">{{ myReview.content.substr(0, 40) }}</p>

        </div>
        <div v-if="rating > 0 && isMyReview === false" class="mx-auto mt-5">
        <!-- <div v-else> -->
          <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#reviewModal" @click="isNotEditing">리뷰를 남겨주세요!</button>
        </div>
        <div v-if="rating === 0 && isMyReview === false">
          <h4 class="text-center text-warning">평점을 등록하면 리뷰를 남길 수 있어요</h4>
        </div>
      </div>
      <div class="col-12 mt-5">
        <div v-if="reviewList">
          <table class="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" class="text-start">ID</th>
                <th scope="col" class="text-start">제목</th>
                <th scope="col">일시</th>
                <th scope="col">평점</th>
              </tr>
            </thead>
            <tbody>
              <MovieDetailReview 
              v-for="review in reviewList"
              :key="review.id"
              :review="review"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>



    <div class="modal fade" style="margin-top: 20rem; " id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" >
          <div class="modal-header">
            <h5 class="modal-title text-dark fw-bold" id="reviewModalLabel">Review : {{ movie.title }} </h5>
            <button type="button" class="btn-close" style="color: white;" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <input type="text" class="form-control" placeholder="enter ReviewTitle" v-model="reviewTitle">
              </div>
              <div class="mb-3">
                <textarea class="form-control" placeholder="enter ReviewContent" v-model="reviewContent" />
              </div>
              <div class="mb-3">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-light" data-bs-dismiss="modal">취소</button> -->
            <button type="button" class="btn btn-warning" @click="submitReview" data-bs-dismiss="modal">리뷰 작성</button>
          </div>
        </div>
      </div>
    
    
    </div>
  </div>
  
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import StarRating from 'vue-star-rating'

import MovieDetailReview from '@/components/MovieDetailReview.vue'

const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: 'MovieDetail',
  // computed: {
  //   movieId: function () {
  //     return this.$route.params.movieId
  //   },
  components: {
    MovieDetailReview,
    StarRating,
  },
  data: function () {
    return {
      movie: [],
      movieId: this.$route.params.movieId,
      reviewTitle: '',
      reviewContent: '',
      myReview:[],
      isEdit: false,
      rating: 0,
      pageNumber: 1,
      moreReview: true,
      notLoading: true,
    }
  },
  methods: {
    findMyReview: function () {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
        } else {
        let config = {
          Authorization: `JWT ${token}`
        }
        axios({
          method: 'get',
          url: `${SERVER_URL}/community/${this.movieId}/`,
          headers: config,
          params: {
            myReview: true,
          },
        })
          .then(res => {
            this.myReview = res.data
            this.reviewTitle = res.data.title
            this.reviewContent = res.data.content
          })
          .catch(error => {
            console.log(error)
          })
        }
    },
    getNextReview: function () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.offsetHeight
        if (bottomOfWindow && this.moreReview && this.notLoading) {
          this.notLoading = false
          console.log('바닥')
          let page_data = {
            page: this.pageNumber,
            next: true,
          }
          let token = localStorage.getItem('jwt')
          if (!token) {
            this.$emit('need-login')
          } else {
            let config = {
              Authorization: `JWT ${token}`
            }
            axios({
              method: 'get',
              url: `${SERVER_URL}/community/${this.movieId}/`,
              headers: config,
              params: page_data
            })
              .then(res => {
                if (res.data.next === true) {
                  // console.log('바닥2')
                  // console.log(res)
                  this.pageNumber += 1
                  page_data = {
                    page: this.pageNumber,
                    movieId: this.movieId,
                  }
                  this.$store.dispatch('storeNextReviewList', page_data)
                  this.notLoading = true
                } else {
                  this.moreReview = false
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
    reviewDetail: function (reviewId) {
      // console.log('entry point')
      // console.log(this.myReview)
      this.$store.dispatch('reviewDetail', this.myReview)
      this.$router.push({
        name: 'ReviewDetail',
        params: {
          reviewId: reviewId
        }
      })
    },

    setRating: function (rating) {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
        } else {
        let config = {
          Authorization: `JWT ${token}`
        }

        axios({
          method: 'post',
          url: `${SERVER_URL}/movies/${this.movieId}/`,
          data: {
            rating: `${rating}`
          },
          headers: config
        })
          // .then(res => {
          //   // console.log(res)
          // })
          // .catch(err => {
          //   // console.log(err)
          // })
      }
    },
    isEditing: function () {
      this.isEdit = true
    },
    isNotEditing: function () {
      this.isEdit = false
    },
    deleteReview: function () {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        let config = {
          Authorization: `JWT ${token}`
        }
        axios({
          method: 'delete',
          url: `${SERVER_URL}/community/review/${this.myReview.id}/`,
          headers: config
        })
          .then(() => {
            this.myReview = []
            this.$store.dispatch('storeInitialReviewList', this.movieId)
          })
          .catch(() => {
            // console.log(err)
          })
      }
    },
    submitReview: function () {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        let config = {
          Authorization: `JWT ${token}`
        }
        let requestData = null
        if (this.isEdit) {
          requestData = {
            method: 'put',
            url: `${SERVER_URL}/community/review/${this.myReview.id}/`,
            headers: config,
            data: {
              title: `${this.reviewTitle}`,
              content: `${this.reviewContent}`,
              rating: `${this.rating}`
            }
          }
        } else {
          requestData = {
            method: 'post',
            url: `${SERVER_URL}/community/${this.movieId}/`,
            headers: config,
            data: {
              title: `${this.reviewTitle}`,
              content: `${this.reviewContent}`,
              rating: `${this.rating}`
            }
          }
        }
        axios(requestData)
          .then(res => {
            // console.log(res)
                this.findMyReview()
                this.reviewTitle = res.data.title
                this.reviewContent = res.data.content
                this.$store.dispatch('storeInitialReviewList', this.movieId)
                this.pageNumber = 1
                this.moreReview = true
              })
          .catch(() => {
            // console.log(err)
          })
      }
    }
  },
  created: function () {
    let token = localStorage.getItem('jwt')
    if (!token) {
      this.$emit('need-login')
    } else {
      let config = {
        Authorization: `JWT ${token}`
      }

      // 내 리뷰ㅜ 찾기
      this.findMyReview()
      // console.log('findmyreview')
      // console.log(this.myReview)
      // console.log('findmyreview')

      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.movieId}/rating/`,
        headers: config,
      })
        .then(res => {
          this.rating = res.data.rating
          // console.log(res)
        })
        .catch(() => {
          // console.log(err)
          // 이부분 수저ㅗㅇ필
          // if (err.status === 401) {
          //   this.$router.push('Login')
          // }
        })


      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.movieId}/`,
        headers: config,
      })
        .then(res => {
          this.movie = res.data

          // 구버전) 리뷰 저장하는 방법
          // this.reviews = res.data.review_set.filter(review => {
          //   return review.user !== this.userId
          // })
          // this.myReview = res.data.review_set.filter(review => {
          //   return review.user === this.userId
          // })

          // if (this.myReview.length !== 0) {
          //   this.reviewTitle = this.myReview[0].title
          //   this.reviewContent = this.myReview[0].content
          // }
        })
        .catch(() => {
          // console.log(err)
        })
      
      // 신버전 리뷰 저장하기
      this.$store.dispatch('storeInitialReviewList', this.$route.params.movieId)
      // let page_data = {
      //   page: this.pageNumber,
      //   next: true,
      // }
      // axios({
      //   method: 'get',
      //   url: `${SERVER_URL}/community/${this.movieId}/`,
      //   headers: config,
      //   params: page_data
      // })
      //   .then(res => {
      //         if (res.data.next === 'True') {
      //           console.log('next page exist')
      //         } else {
      //           this.moreReview = false
      //         }
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    }
  },
  computed: {
    isMyReview: function () {
      if (this.myReview.length === 0) {
        return false
      } else {
        return true
      }
    },
    POSTER_URL: function () {
      return `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`
    },
    ...mapState([
      'userId',
      'reviewList',
    ])
  },
  mounted: function () {
    this.getNextReview()
  }
}
</script>

<style scoped>
.releaseDate {
  color: #a0a0a0;
}

.title {
  color: #ffc31f;
}

.container {
  background-color: #3B3F46;
  padding: 4rem 5.5rem;
  border-radius: 0.5rem;
  margin-bottom: 3.5rem;
}

.card-img-top {
  border: 6px solid #2A2E34;
  border-radius: 2px;
}

.overviewHeader {
  font-size: 1.61rem;
  border: 1px solid #7a7a7a;
  border-width: 0px 0px 1px 0px;
}

.overview {
  margin-top: 0.5rem;
  line-height: 1.8rem;
  color: #ffffff;
}
</style>