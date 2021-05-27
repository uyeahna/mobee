<template>
  <div class="container">
    <div class="d-flex justify-content-center h-100">
      <div class="card">
        <div class="card-header">
          <h3 class="text-dark">Sign Up</h3>
        </div>
        <div class="card-body">
          <div class="input-group form-group">
            <span class="input-group-text icon"><i class="fas fa-user-alt fa-lg"></i></span>
            <input type="text" class="form-control" placeholder="username" v-model="username">
          </div>
          <div class="input-group form-group mt-1">
            <span class="input-group-text icon"><i class="fas fa-key fa-lg"></i></span>
            <input type="password" class="form-control" placeholder="password" v-model="password">
          </div>

          <div class="input-group form-group mt-1">
            <span class="input-group-text icon"><i class="fas fa-key fa-lg"></i></span>
            <input type="password" class="form-control" placeholder="password" v-model="passwordConfirm">
          </div>

          <!-- <div class="form-group"> -->
          <button class="btn float-right login_btn mt-2" @click="login">회원가입</button>
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
  name: 'Signup',
  data: function () {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
    }
  },
  methods:{
    login: function () {
      let userdata = {
        username: this.username,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
      }
      // 순서 괜찮겠지
      this.password = '',
      this.passwordConfirm = '',
      axios.post(`${SERVER_URL}/accounts/signup/`, userdata)
        .then( () => {
          axios.post(`${SERVER_URL}/accounts/login/`, userdata)
            .then(res => {
              localStorage.setItem('jwt', res.data.token)
              this.$store.dispatch('storeUserId')
              this.$emit('close-modal')
              this.$store.dispatch('setLogin')
            })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style scoped> /* Modal */ 

</style>