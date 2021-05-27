<template>
  <div class="container">
    <div class="d-flex justify-content-center h-100">
      <div class="card">
        <div class="card-header">
          <h3 class="text-dark">Log In</h3>
        </div>
        <div class="card-body">
          <div class="input-group form-group">
            <span class="input-group-text"><i class="fas fa-user-alt fa-lg"></i></span>
            <input type="text" class="form-control" placeholder="username" v-model="username">
          </div>
          <div class="input-group form-group mt-1">
            <span class="input-group-text"><i class="fas fa-key fa-lg"> </i> </span>
            <input type="password" class="form-control" placeholder="password" v-model="password"
              @keypress.enter="login">
          </div>

          <!-- <div class="form-group"> -->
          <button class="btn float-right login_btn" @click="login">Login</button>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'

const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: 'Login',
  data: function () {
    return {
      username: '',
      password: '',
    }
  },
  methods:{
    login: function () {
      let userdata = {
        username: this.username,
        password: this.password,
      }
      // 순서 괜찮겠지
      this.password = '',
      axios.post(`${SERVER_URL}/accounts/login/`, userdata)
        .then(res => {
          localStorage.setItem('jwt', res.data.token)
          this.$store.dispatch('storeUserId')
          // 이건 다시 액션 부르기
          console.log('endpoint')
          this.$emit('close-modal')
          this.$store.dispatch('setLogin')
        })
        .catch(err => {
          alert('로그인 정보가 올바르지 않습니다.')
          console.dir(err)
        })
    }
  }
}
</script>

<style scoped> /* Modal */

</style>