import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

Vue.use(Vuex)
const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default new Vuex.Store({
  state: {
    movieList: [],
    reviewList: [],
    review: [],
    userId: '',
    isLogin: false,
    comments: [],
    isSuperuser: false,
  },
  mutations: {
    SET_LOGIN: function (state) {
      state.isLogin = true
    },
    SET_LOGOUT: function (state) {
      state.isLogin = false
      // console.log(state.isLogin)
    },
    STORE_INITIAL_REVIEW_LIST: function (state, reviews) {
      state.reviewList = reviews
    },
    STORE_NEXT_REVIEW_LIST: function (state, reviews) {
      state.reviewList = state.reviewList.concat(reviews)
    },
    STORE_REVIEW: function (state, review) {
      state.review = review
    },
    GET_INITIAL_MOVIE_LIST: function (state, movies) {
      state.movieList = movies
    },
    GET_NEXT_MOVIE_LIST: function (state, movies) {
      state.movieList = state.movieList.concat(movies)
    },
    STORE_USER_ID: function (state, userId) {
      state.userId = userId
    },
    SET_REVIEW_COMMENT: function (state, comments) {
      state.comments = comments
    },
    STORE_REVIEW_COMMENT: function (state, comments) {
      state.comments = state.comments.concat(comments)
    },
    IS_SUPERUSER: function (state, flag) {
      state.isSuperuser = flag
    }
  },
  actions: {
    setLogin: function ({commit}) {
      commit('SET_LOGIN')
    },
    setLogOut: function ({commit}) {
      localStorage.removeItem('jwt')
      commit('SET_LOGOUT')
      commit('IS_SUPERUSER', false)
    },
    reviewDetail: function ({commit}, review) {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        commit('STORE_REVIEW', review)
      }
    },
    storeInitialReviewList: function ({commit}, movieId) {
      let token = localStorage.getItem('jwt')
      let config = {
        Authorization: `JWT ${token}`
      }
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/${movieId}/`,
        headers: config,
        params: {
          page: 1,
        },
      })
        .then(res => {
          commit('STORE_INITIAL_REVIEW_LIST', res.data)
        })
        .catch(() => {
          // console.log(error)
        })
    },
    storeNextReviewList: function ({commit}, data) {
      let token = localStorage.getItem('jwt')
      let config = {
        Authorization: `JWT ${token}`
      }
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/${data.movieId}/`,
        headers: config,
        params: {
          page: data.page,
        },
      })
        .then(res => {
          commit('STORE_NEXT_REVIEW_LIST', res.data)
        })
        .catch(() => {
          // console.log(error)
        })
    },
    setReviewComment: function({commit}, reviewId) {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        let config = {
        Authorization: `JWT ${token}`
        }
        axios({
          method: 'get',
          url: `${SERVER_URL}/community/review/${reviewId}/comment/`,
          headers: config,
          params: {
            page: 1,
          }
        })
          .then(res => {
            // console.log('SET_REVIEW_COMMENT')
            commit('SET_REVIEW_COMMENT', res.data)
          })
          .catch(() => {
            commit('SET_REVIEW_COMMENT', [])
          })
      }
    },
    storeReviewComment: function({commit}, pageData) {
      let token = localStorage.getItem('jwt')
      if (!token) {
        this.$emit('need-login')
      } else {
        let config = {
        Authorization: `JWT ${token}`
        }
        axios({
          method: 'get',
          url: `${SERVER_URL}/community/review/${pageData.reviewId}/comment/`,
          headers: config,
          params: {
            page: pageData.page,
          }
        })
          .then((res) => {
            commit('STORE_REVIEW_COMMENT', res.data)
          })
          .catch(() => {
            // console.log(error)
          })
      }
    },
    storeReview: function ({commit}, review) {
      commit('STORE_REVIEW', review)
    },
    getInitialMovieList: function ({ commit }) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/`,
        params: {
          page: 1
        },
      })
        .then(res => {
          let movies = res.data
          // console.log(res.data)
          commit('GET_INITIAL_MOVIE_LIST', movies)
        })
        .catch(() => {
          // console.log(err)
        })
      },
    getNextMovieList: function ({commit}, pageNumber) {
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/`,
        params: {
          page: pageNumber
        },
      })
        .then(res => {
          let movies = res.data
          // console.log(res.data)
          commit('GET_NEXT_MOVIE_LIST', movies)
        })
        .catch(() => {
          // console.log(err)
        })
    },
    storeUserId: function ({commit}) {
      let token = localStorage.getItem('jwt')
      if (!token) {
        commit('STORE_USER_ID', '')
      }
      let decoded = jwt_decode(token)
      commit('STORE_USER_ID', decoded.user_id)

      let config = {
        Authorization: `JWT ${token}`
      }
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/superuser/`,
        headers: config,
      })
        .then(res => {
          if (res.data.isSuperuser === true) {
            commit('IS_SUPERUSER', true)
          } else {
            commit('IS_SUPERUSER', false)
          }
        })
    },
  },
  getters: {
    movieList: function ({state}) {
      return state.movieList
    },
    // review: function ({state}) {
    //   return state.review
    // }
  },
  modules: {
  },
})
