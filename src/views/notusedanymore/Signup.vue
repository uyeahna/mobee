<template>
  <div>
    <h1>Signup</h1>
    <div>
      <label for="username">사용자 이름: </label>
      <input type="text" id="username" v-model="username">
    </div>
    <div>
      <label for="password">비밀번호: </label>
      <input type="password" id="password" v-model="password">
    </div>
    <div>
      <label for="passwordConfirm">비밀번호 확인: </label>
      <input type="password" id="passwordConfirm" v-model="passwordConfirm">
    </div>
    <button @click="signup">회원가입</button>
  </div>
</template>

<script>
import axios from 'axios'

const SERVER_URL = 'http://127.0.0.1:8000/'

export default {
  name: 'Signup',
  data: function () {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
    }
  },
  methods: {
    signup: function () {
      const userdata = {
        username: this.username,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }
      axios({
        method: 'post',
        url: `${SERVER_URL}accounts/signup/`,
        data: userdata
      })
        .then(res => {
          console.log(res)
          this.$router.push('Login')
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }
}
</script>
