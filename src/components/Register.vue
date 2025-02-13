<template>
  <div class="main-container-login">
    <div class="main-border-login">
      <div class="login-contents">
        <div class="register-title">Sign up</div>

        <div class="input-component">
          <div class="input-title">Username</div>
          <input v-model="username" class="username-bracket"  maxlength="15" />
        </div>
        <div v-if="usernameError" class="error-message">{{ usernameError }}</div>

        <div class="input-component">
          <div class="input-title">E-mail address</div>
          <input v-model="email" class="username-bracket" />
        </div>
        <div v-if="emailError" class="error-message">{{ emailError }}</div>


        <div class="input-component">
          <div class="input-title">Password</div>
          <input v-model="password" type="password" class="password-bracket"  maxlength="20" />
        </div>

        <div class="input-component">
          <div class="input-title">Repeat password</div>
          <input
              v-model="repeatPassword"
              type="password"
              class="password-bracket"
          />
        </div>
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="successMessage" class="log-in-allowed" @click="signIn">Click here to sign in.</div>

        <div class="login-button" @click="createAccount">Create account</div>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {


      username: '',
      password: '',
      email: '',
      repeatPassword: '',
      emailError: '',
      usernameError: '',
      passwordError: '',
      successMessage: '',
      takenUsernames: ['user1', 'admin', 'test'],
    };
  },
    methods: {
      async createAccount() {
        const passwordRequirements = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        const emailRequirements = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        if (!this.username || !this.password || !this.repeatPassword) {
          this.passwordError = 'All fields are required';
          return;
        }

        if (this.password !== this.repeatPassword) {
          this.passwordError = 'Passwords do not match';
          return;
        }

        if (!emailRequirements.test(this.email)) {
          this.emailError = 'Invalid e-mail format';
          return;
        }

        if (!passwordRequirements.test(this.password)) {
          this.passwordError = 'Password must be at least 8 characters long, contain at least one digit, and one special character.';
          return;
        }

        try {
          const response = await axios.post('http://localhost:5000/api/register', {
            username: this.username,
            password: this.password,
            email: this.email,
          });

          this.successMessage = 'Registration successful! Please log in.';
          this.usernameError = '';
          this.passwordError = '';
        } catch (error) {
          if (error.response && error.response.data.error === 'Username is already taken') {
            this.usernameError = error.response.data.error;
          }
          else if (error.response && error.response.data.error === 'E-mail address already in use') {
            this.emailError = error.response.data.error;
          }
          else {
            this.passwordError = error.message || 'Registration failed';
          }
        }
      },

    signIn(){
      this.$router.push('/');
    }

  },


};
</script>






<style scoped>

.success-message{
  font-family: system-ui;
  color: rebeccapurple;
  width: 80%;
  margin: 0 auto;
}

.log-in-allowed {
  font-family: system-ui;
  color: mediumpurple;
  width: 80%;
  margin: 0 auto;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

.log-in-allowed:hover {
  color: darkorchid;
}

.log-in-allowed:active {
  color: indigo;
}

.input-title{
  padding: 1vmin;
}

.input-component{
  padding-bottom: 1vmin;
}

.

  .logo{
    width: 10vmin;
    height: 10vmin;
    border: solid mediumpurple;
    border-radius: 10vmin;
    margin: 0 auto;
    margin-bottom: 2vmin;
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

.error-message{
  font-family: system-ui;
  color: rebeccapurple;
  width: 80%;
  margin: 0 auto;
}
  .login-contents {
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
  width: 30%;
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
  margin-top: 5vmin;
}

.register-title{
  font-family: system-ui;
  color: mediumpurple;
  margin: 0 auto;
  font-size: 5vmin;
  margin-bottom: 2vmin;
}
</style >