import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Recommendation from '../views/Recommendation.vue'
import MovieDetail from '@/components/MovieDetail.vue'
import ReviewDetail from '@/components/ReviewDetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/review/:reviewId',
    name: 'ReviewDetail',
    component: ReviewDetail
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/detail/:movieId',
    name: 'MovieDetail',
    component: MovieDetail
  },
  {
    path: '/recommendation',
    name: 'Recommendation',
    component: Recommendation
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
