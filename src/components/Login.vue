<template>
  <div class="main-container-login">
    <div class="main-border-login">
      <div class="login-contents">
        <div class="register-title">Log in</div>

        <div class="input-component">
          <div class="input-title">E-mail address</div>
          <input v-model="email" class="username-bracket"/>
        </div>
        <div v-if="emailError" class="error-message">{{ emailError }}</div>


        <div class="input-component">
          <div class="input-title">Password</div>
          <input v-model="password" type="password" class="password-bracket" maxlength="20" />
        </div>

        <div v-if="loginError" class="error-message">{{ loginError }}</div>

        <div class="login-button" @click="login">Log in</div>

        <div class="other-options">
          <div class="signup" @click="signUp">Sign up</div>
          <!--<div class="forgot-password">Forgot password?</div>-->
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { store } from '../../store.js';
export default {
  data() {
    return {

      NAME: 'Login',

      email: '',
      emailError: '',
      password: '',
      loginError: '',
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.loginError = 'E-mail address and password are required';
        return;
      }

      const emailRequirements = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRequirements.test(this.email)) {
        this.emailError = 'Invalid e-mail format';
        return;
      }
      else this.emailError='';

      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          email: this.email,
          password: this.password,
        });

        this.loginError = '';
        alert(`Login successful! Welcome, ${response.data.username}!`);

        store.setUser({
          username: response.data.username,
          displayedName: response.data.displayedName,
        });

        console.log("Zalogowany użytkownik:", store.state.currentUser);
        this.$router.push('/dashboard');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.loginError = error.response.data.error;
        } else {
          this.loginError = 'Login failed. Please try again.';
        }
      }
    },

    signUp(){
      this.$router.push('/register');
    }
  },
};
</script>


<style scoped>

.register-title{
  font-family: system-ui;
  color: mediumpurple;
  margin: 0 auto;
  font-size: 5vmin;
  margin-bottom: 2vmin;
}

.error-message{
  font-family: system-ui;
  color: rebeccapurple;
  width: 80%;
  margin: 0 auto;
}

.signup{
  padding-bottom: 1vmin;
  cursor: pointer;
}


.signup:hover {
  color: darkorchid;
}

.signup:active {
  color: indigo;
}

.forgot-password{
  cursor: pointer;
}

.forgot-password:hover {
  color: darkorchid;
}

.forgot-password:active {
  color: indigo;
}

.input-title{
  padding: 1vmin;
}

.input-component{
  padding-bottom: 1vmin;
}

.main-container-login{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.main-border-login{
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  width: 80vmin;
  background: white;
  border-radius: 2vmin;
  box-shadow: 0 0 10px rebeccapurple;
}

.login-contents{
  padding: 5vmin;
  text-align: center;
  font-family: system-ui;
}

.login-title{


}

.username-bracket{
  width: 50%;
  margin: 0 auto;
  height: 4vmin;
  border-radius: 1vmin;
  border: 1px solid grey;
}

.password-bracket{
  width: 50%;
  margin: 0 auto;
  height: 4vmin;
  border-radius: 1vmin;
  border: 1px solid grey;
}

.other-options{
  display: block;
  margin: 0 auto;
  color: mediumpurple;
  font-weight: 600;
}

.login-title{
  font-size: xxx-large;
  padding: 1vmin;
  font-family: system-ui;
  color: rebeccapurple;
}


.login-button{
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  padding: 1vmin;
  width: 20vmin;
  margin: 3vmin auto;
}

.logo{
  width: 10vmin;
  height: 10vmin;
  border: solid mediumpurple;
  border-radius: 10vmin;
  margin: 0 auto;
  margin-bottom: 2vmin;
}
</style >