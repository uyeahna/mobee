<template>
  <div id="app">
    <nav class="navbar sticky-top navbar-light d-flex justify-content-center-between" id="navbar">
      <div class="container">
        <!-- <div id="nav" class=""> -->
        <div>
          <router-link to="/home"><img alt="Mobee" src="./assets/logo.png" height="50px"></router-link>
          <router-link to="/recommendation" class="btn text-light ms-4">Get Recommendation</router-link>
        </div>
        <div>
          <span v-if="isLogin">
            <span><i class="fab fa-forumbee" style="color: #F5B301;"></i> {{ userId }} 님</span>
            <span @click="logout" class="ms-3" id="logoutBtn">Logout</span>
            <button @click="admin" class="btn btn-light ms-3" v-if="isSuperuser">Admin Page</button>
          </span>
          <div v-else>
            <button type="button" class="btn" style="color: white;" @click="showLoginModal = true, showSignupModal = false"><i class="fab fa-forumbee"></i> Login</button>
            <button type="button" class="btn" style="color: #F5B301;" @click="showSignupModal = true, showLoginModal = false"><i class="fab fa-forumbee"></i> Signup</button>
          </div>
        </div>
      </div>
    </nav>
    <router-view @need-login="showLoginModal = true"/>
    <div v-if="showIntro" @click="introClick" id="introOverlay" class="d-flex justify-content-center align-items-center">
      <img src="./assets/bee2.png" id="introBee">
    </div>
    

    <ModalView v-if="showLoginModal" @close-modal="showLoginModal = false"> 
      <Login v-if="showLoginModal" @close-modal="showLoginModal = false"/> 
    </ModalView>

    <ModalView v-if="showSignupModal" @close-modal="showSignupModal = false"> 
      <Signup v-if="showSignupModal" @close-modal="showSignupModal = false"/>
    </ModalView> 

  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import ModalView from '@/components/ModalView'

const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: 'App',
  data: function () {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      showLoginModal: false,
      showSignupModal: false,
      showIntro: true,
    }
  },
  components: {
    ModalView,
    Login,
    Signup
  },
  methods: {
    introClick: function () {
      this.showIntro = false
      this.$router.push('home')
    },
    signup: function () {
      const userdata = {
        username: this.username,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }
      axios({
        method: 'post',
        url: `${SERVER_URL}/accounts/signup/`,
        data: userdata
      })
        .then(res => {
          console.log(res)
          this.login()
          this.username = ''
          this.password = ''
          this.passwordConfirm = ''
          this.isLogin = true
          this.$route.push('Home')
        })
        .catch(() => {
          // console.log(err.response)
        })
    },
    admin: function () {
      window.location.href = `${SERVER_URL}/admin/`
    },
    logout: function () {
      this.$store.dispatch('setLogOut')
      this.$router.push('Home')
    }
  },
  created: function () {
    let token = localStorage.getItem('jwt')
    if (token) {
      // 수정 드가자
      this.$store.dispatch('storeUserId')
      this.$store.dispatch('setLogin')
    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'userId',
      'isSuperuser'
    ])
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #dfdfdf;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #dfdfdf;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#navbar {
  background-color: #1E2328;
  border: 2px solid #000000;
  border-width: 0px 0px 2px 0px;
}

html {
  overflow-y: scroll;
}

#logoutBtn {
  cursor: pointer;
}

@import url('https://fonts.googleapis.com/css2?family=Karla:wght@300&family=Noto+Sans+KR:wght@200&display=swap');

html, body {
  font-family: 'Karla', 'Noto Sans KR', sans-serif;
  }

#app {
  font-family: 'Karla', 'Noto Sans KR', sans-serif;
}

#introOverlay {
  width: 100%; height: 100%; position: fixed; left: 0; top: 0; 
  background: rgba(0, 0, 0, 0.6);
}
</style>
