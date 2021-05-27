<template>
  <div class="container">
    <div class="d-flex justify-content-center h-100">
      <div class="card">
        <div class="card-header">
          <h3>Sign In</h3>
        </div>
        <div class="card-body">
          <form>
            <div class="input-group form-group">
              <span class="input-group-text icon"><i class="fas fa-user"></i></span>
              <input type="text" class="form-control" placeholder="username" v-model="username">
              
            </div>
            <div class="input-group form-group mt-1">
              <span class="input-group-text icon"><i class="fas fa-key"></i></span>
              <input type="password" class="form-control" placeholder="password" v-model="password"
                @keypress.enter="login">
            </div>

            <div class="form-group">
              <button class="btn float-right login_btn" @click="login">로그인</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const SERVER_URL = 'http://127.0.0.1:8000'

export default {
  name: 'Login',
  data: function () {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login: function () {
      const data = {
        username: this.username,
        password: this.password,
      }

      axios.post(`${SERVER_URL}/accounts/login/`, data)
        .then(res => {
          console.log(res.data.token)
          localStorage.setItem('jwt', res.data.token)
          this.$store.dispatch('storeUserId')
          this.password = '',
          this.$emit('login')
          this.$router.push({name: 'Home'})
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Numans');

#login {
  /* margin: 14rem 31rem; */
  /* background-color: #3B3F46; */
}

html,body {
background-image: url('http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg');
background-size: cover;
background-repeat: no-repeat;
height: 100%;
font-family: 'Numans', sans-serif;
}

.container {
height: 100%;
align-content: center;
}

.card {
height: 370px;
margin-top: auto;
margin-bottom: auto;
width: 400px;
background-color: rgba(0,0,0,0.5) !important;
}

.card-header h3 {
color: white;
}

.icon {
width: 50px;
background-color: #FFC312;
color: black;
border:0 !important;
}

input:focus {
outline: 0 0 0 0  !important;
box-shadow: 0 0 0 0 !important;

}



.login_btn {
color: black;
background-color: #FFC312;
width: 100px;
}

.login_btn:hover {
color: black;
background-color: white;
}

.links {
color: white;
}

.links a {
margin-left: 4px;
}
</style>
