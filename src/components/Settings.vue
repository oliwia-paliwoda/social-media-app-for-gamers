<template>
  <div class="main-container-settings">
    <div class="main-border-settings">
      <div class="settings-list">
        <div class="list-contents">
          <div class="list-position" @click="settingId=0">Profile</div>
          <div class="list-position" @click="settingId=1">About me</div>
          <div class="list-position" @click="settingId=2">Change password</div>
          <div class="list-position" @click="settingId=3">Change e-mail address</div>
          <div class="list-position" style="color: darkred;" @click="settingId=4">Close account</div>
          <!--<div class="list-position">test</div>
          <div class="list-position">test</div>-->
        </div>
      </div>
      <div class="setting-contents">
        <div v-if="settingId===0" class="profile-settings">
          <div class="singular-setting">
            <div class="setting-title">Displayed name</div>
            <div class="setting-input-bar">
            <input class="setting-input-text"  v-model="newDisplayedName" :placeholder="this.myDisplayedName"/>
            </div>
          </div>

          <div class="singular-setting">
            <div class="setting-title">Bio</div>
            <div class="setting-input-bar">
            <input class="setting-input-text" :placeholder="myBio" v-model="newBio"/>
            </div>
          </div>


          <div class="singular-setting">
            <div class="setting-title">Profile Picture</div>
            <div class="image-operations">
            <img class="profile-pic-preview" @error="handlePfpError" :src="croppedProfileImagePreview || myProfilePic" alt="Profile Picture" />
            <input type="file" ref="profileInput" @change="handleFileChange('profile')" style="display: none;" />
            <div v-if="imagePreview && cropperType === 'profile'" class="crop-container">
              <img ref="image" :src="imagePreview" alt="Profile Preview" />
              <div>
                <button @click="cropImage('profile')" class="upload-button">Crop Profile</button>
                <button @click="resetCropper" class="upload-button">Cancel</button>
              </div>
            </div>
            </div>
            <div @click="openFileExplorer('profile')" class="upload-button">Upload profile picture</div>
          </div>



          <div class="singular-setting">
            <div class="setting-title">Background Color</div>
              <input
                  class="color-input-style"
                  type="color"
                  v-model="backgroundColor"
              />
          </div>



          <div class="save-button" @click="saveChanges()">Save</div>
        </div>


        <div v-if="settingId===1" class="about-me-settings">
          <div class="singular-setting">
            <div class="setting-title">Country</div>
            <div class="setting-input-bar">
              <select class="setting-input-text" @change="addToSelectedCountries($event)">
                <option value="" disabled selected>Select countries</option>
                <option
                    v-for="(countryName, countryCode) in countries"
                    :key="countryCode"
                    :value="countryCode">
                  {{ countryName }}
                </option>
              </select>
            </div>


            <div class="selected-role-cards">
              <div
                  v-for="countryCode in selectedCountries"
                  :key="countryCode"
                  class="role-card-wrapper"
                  @mouseenter="hoveredCard = countryCode"
                  @mouseleave="hoveredCard = null"
              >
                <role-card :country-code="countryCode" />

                <!-- Krzyżyk do usuwania -->
                <span
                    v-if="hoveredCard === countryCode"
                    class="remove-button"
                    @click="removeFromSelectedCountries(countryCode)"
                >
      ✖
    </span>
              </div>
            </div>


          </div>

          <div class="singular-setting">
            <div class="setting-title">Connections</div>
            <div class="setting-input-bar">
            <select class="setting-input-text" @change="addToSelectedConnections($event)">
              <option value="" disabled selected>Select connections and enter your username if you like</option>
              <option
                  v-for="connectionObj in connections"
                  :key="connectionObj.connection"
                  :value="connectionObj.connection">
                {{ connectionObj.connection }}
              </option>
            </select>
            </div>

            <div
                class="connection-usernames"
                v-for="connectionObj in selectedConnections"
                :key="connectionObj.connection"
                @mouseenter="hoveredConnection = connectionObj.connection"
                @mouseleave="hoveredConnection = null"
            >
  <span
      v-if="hoveredConnection === connectionObj.connection"
      class="remove-button-connections"
      @click="removeSelectedConnection(connectionObj.connection)"
  >
    ✖
  </span>
              <div class="connection-title">{{ connectionObj.connection }}</div>
              <input
                  class="setting-username-input"
                  type="text"
                  v-model="connectionObj.username"
                  :placeholder="'Enter your username for ' + connectionObj.connection"
              />
            </div>

          </div>

          <div class="singular-setting">
            <div class="setting-title">Platforms</div>
            <div class="setting-input-bar">
              <select class="setting-input-text" @change="addToSelectedPlatforms($event)">
                <option value="" disabled selected>Select platforms</option>
                <option
                    v-for="(platformCode, title) in platformsList"
                    :key="platformCode"
                    :value="title">
                  {{ platformCode }}
                </option>
              </select>
            </div>
            <!--<div class="selected-countries">
              <div v-for="countryCode in selectedCountries" :key="countryCode">
                <role-card :country-code="countryCode" />
              </div>
            </div>-->


            <div class="selected-role-cards">
              <div
                  v-for="title in selectedPlatforms"
                  :key="title"
                  class="role-card-wrapper"
                  @mouseenter="hoveredCard = title"
                  @mouseleave="hoveredCard = null"
              >
                <role-card :role="title" />

                <!-- Krzyżyk do usuwania -->
                <span
                    v-if="hoveredCard === title"
                    class="remove-button"
                    @click="removeFromSelectedPlatforms(title)"
                >
      ✖
    </span>
              </div>
            </div>
          </div>

          <div class="singular-setting">
            <div class="setting-title">Games</div>
            <div class="setting-input-bar">
              <select class="setting-input-text" @change="addToSelectedGames($event)">
                <option value="" disabled selected>Select games you like or play</option>
                <option
                    v-for="game in gamesList"
                    :key="game.name"
                    :value="game.name">
                  {{ game.name }}
                </option>
              </select>
            </div>
            <!--<div class="selected-countries">
              <div v-for="countryCode in selectedCountries" :key="countryCode">
                <role-card :country-code="countryCode" />
              </div>
            </div>-->


            <div class="selected-role-cards">
              <div
                  v-for="game in selectedGames"
                  :key="game"
                  class="role-card-wrapper"
                  @mouseenter="hoveredCard = game"
                  @mouseleave="hoveredCard = null"
              >
                <game-card :title="game.name" :imgpath="game.path"  />

                <!-- Krzyżyk do usuwania -->
                <span
                    v-if="hoveredCard === game"
                    class="remove-button"
                    @click="removeFromSelectedGames(game)"
                >
      ✖
    </span>
              </div>
            </div>
          </div>

          <div class="save-button" @click="saveAboutMe()">Save</div>
        </div>

        <div v-if="settingId===2" class="account-settings">

          <div class="singular-setting">
            <div class="setting-title">Old password</div>
            <div class="password-input-bar">
              <input class="setting-input-text" type="password" maxlength="20" v-model="oldPassword"/>
            </div>
          </div>

          <div class="singular-setting">
            <div class="setting-title">New password</div>
            <div class="password-input-bar">
              <input class="setting-input-text" maxlength="20" type="password" v-model="newPassword"/>
            </div>
          </div>

          <div class="singular-setting">
            <div class="setting-title">Repeat new password</div>
            <div class="password-input-bar">
              <input class="setting-input-text" maxlength="20" type="password" v-model="repeatedPassword"/>
            </div>
          </div>

          <div v-if="passwordError" class="password-error">{{this.passwordError}}</div>

          <div class="save-button" @click="changePassword()">Change password</div>


        </div>


        <div v-if="settingId===3" class="account-settings">
          <div class="email-info">{{'Your current e-mail is '+this.currentEmail+'. Please enter your new email and password to continue.'}}</div>
          <div class="singular-setting">
            <div class="setting-title">New e-mail</div>
            <div class="password-input-bar">
              <input class="setting-input-text" v-model="newEmail"/>
            </div>
          </div>

          <div class="singular-setting">
            <div class="setting-title">Password</div>
            <div class="password-input-bar">
              <input class="setting-input-text" maxlength="20" type="password" v-model="password"/>
            </div>
          </div>

          <div v-if="emailError" class="password-error">{{this.emailError}}</div>


          <div v-if="!emailStepVerified" class="save-button" @click="emailChange()">Continue</div>
          <div v-if="emailStepVerified" class="email-info">{{'A verification code has been send to '+this.newEmail+'. Please enter the code below.'}}</div>
          <div v-if="emailStepVerified" class="singular-setting">
            <div class="password-input-bar">
              <input class="setting-input-text" v-model="emailChangeCode" maxlength="6"/>
            </div>
          </div>
          <div v-if="emailStepVerified" class="save-button">Change e-mail</div>

          </div>
        <div v-if="settingId===4" class="account-settings">
          <div class="account-closing-info">You are about to close your account. Please enter your e-mail and password to proceed.</div>
          <div class="singular-setting">
            <div class="setting-title">E-mail</div>
            <div class="password-input-bar">
              <input class="setting-input-text" v-model="closingEmail"/>
            </div>
          </div>

          <div class="singular-setting">
            <div class="setting-title">Password</div>
            <div class="password-input-bar">
              <input class="setting-input-text" maxlength="20" type="password" v-model="closingPassword"/>
            </div>
          </div>
          <div v-if="closingCredentialsError" class="password-error">{{this.closingCredentialsError}}</div>
          <div v-if="!closingCredentialsCorrect" class="save-button" @click="checkCredentials()">Continue</div>
          <div v-if="closingCredentialsCorrect" class="account-closing-info">Are you sure you want to close your account?</div>
          <div v-if="closingCredentialsCorrect" class="buttons">
            <div @click="accountCloseYes"class="button-yes">Yes</div>
            <div @click="accountCloseNo" class="button-no">No</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Cropper from 'cropperjs';
import countryNames from '../countryNames';
import roleCard from "./RoleCard.vue";
import axios from "axios";
import gameCard from "./GameCard.vue";
import { store } from '../../store';
export default {
  data() {
    return {
      NAME: 'Settings',


      closingCredentialsError: '',
      closingCredentialsCorrect: false,
      closingEmail:'',
      closingPassword:'',
      emailStepVerified: false,
      emailChangeCode: '',
      emailError:'',
      newEmail: '',
      currentEmail: '',
      password: '',
      passwordError: '',
      oldPassword: '',
      newPassword: '',
      repeatedPassword: '',
      backgroundColor: '#999999',
      myUsername: store.state.currentUser.username,
      myDisplayedName: store.state.currentUser.displayedName,
      newDisplayedName: '',
      myBio: '',
      newBio: '',
      croppedBackgroundImagePreview: undefined,
      croppedProfileImagePreview: undefined,
      myProfilePic: undefined,
     myBackground: undefined,
      newBackground: '',
      selectedFile: null,
      croppedProfileImage: undefined,
      croppedBackgroundImage: undefined,
      imagePreview: null,
      cropper: null,
      cropperType: null,
      countries: countryNames,
      selectedCountries: [],
      platformsList: {
        platformXbox: "Xbox",
        platformPS: "Playstation",
        platformPC: "PC",
        platformMobile: "Mobile",
        platformSwitch: "Nintendo Switch",
        platformVR: "VR",
        platformSteamDeck: "Steam Deck"
      },
      hoveredCard: null,
      selectedPlatforms: [],
      connections: [
        {connection: 'Discord', username: ''},
        {connection: 'Steam', username: ''},
        {connection: 'Epic Games', username: ''},
        {connection: 'Xbox', username: ''},
        {connection: 'Playstation', username: ''},
        {connection: 'Twitch', username: ''},
        {connection: 'Reddit', username: ''},
        {connection: 'Riot', username: ''},
        {connection: 'YouTube', username: ''}
      ],
      selectedConnections: [],
      selectedConnection: null,
      hoveredConnection: null,
      selectedGames: [],
      gamesList: [],

      settingId: 0,
    }
  },

  components: {
    'role-card': roleCard,
    'game-card': gameCard,
  },

  methods: {

    async accountCloseYes(){
      try {
        const response = await axios.post("http://localhost:5000/api/delete-user", {
          username: this.myUsername,
        });

        if (response.status === 200) {
          alert("Your account and all related data have been successfully deleted.");

          this.$router.push('/');
        }
      } catch (error) {
        console.error("Error deleting user data:", error);
      }
    },

    accountCloseNo(){
      this.closingEmail='';
      this.closingPassword='';
      this.closingCredentialsCorrect = false;
    },

    async checkCredentials(){
      this.closingCredentialsError='';

      if(!this.closingEmail && !this.closingPassword){
        this.closingCredentialsError='E-mail and password are required';
        return;
      }

      if(this.currentEmail!==this.closingEmail){
        this.closingCredentialsError='Invalid e-mail or password';
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/verify-password', {
          username: this.myUsername,
          password: this.closingPassword
        });

        if (response.status === 200) {
          this.closingCredentialsCorrect=true;
        }
      } catch (error) {
        console.error('Error verifying password:', error);
        if (error.response && error.response.status === 401) {
          this.closingCredentialsError = 'Incorrect e-mail password.';
        } else {
          this.closingCredentialsError = 'An error occurred. Please try again later.';
        }
      }

    },

    async changePassword() {
      this.passwordError='';
      if (!this.oldPassword || !this.newPassword || !this.repeatedPassword) {
        this.passwordError='All fields are required.';
        return;
      }

      if (this.newPassword !== this.repeatedPassword) {
        this.passwordError='New passwords do not match.';
        return;
      }

      const passwordRequirements = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRequirements.test(this.newPassword)) {
        this.passwordError = 'New password must be at least 8 characters long, contain at least one digit, and one special character.';
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/change-password', {
          username: this.myUsername,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });

        alert(response.data.message);

        this.oldPassword = '';
        this.newPassword = '';
        this.repeatedPassword = '';
      }catch (error) {
        if (error.response && error.response.status === 401) {
          this.passwordError = 'Old password is incorrect.';
        } else if (error.response && error.response.data && error.response.data.error) {
          this.passwordError = error.response.data.error;
        } else {
          this.passwordError = 'An error occurred. Please try again later.';
        }
        console.error('Error changing password:', error);
      }
    },

    async fetchAboutMe() {
      try {
        const response = await axios.get(`http://localhost:5000/api/user-details/${this.myUsername}`);
        const { country, connections, platforms, games } = response.data;


        this.selectedCountries = country;
        this.selectedConnections = connections;
        console.error("connections z bazy:", connections);
        this.selectedPlatforms = platforms;
        this.selectedGames = games;

        console.log('User details fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },

    saveAboutMe() {
      const gamesToSave = this.selectedGames.map(game => game.name);

      const payload = {
        username: this.myUsername,
        country: this.selectedCountries,
        platforms: this.selectedPlatforms,
        connections: this.selectedConnections,
        games: gamesToSave
      };

      axios
          .post('http://localhost:5000/api/update-user-details', payload)
          .then(response => {
            console.log('User details updated successfully:', response.data);
            alert('Changes saved successfully!');
          })
          .catch(error => {
            console.error('Error updating user details:', error);
            alert('Failed to save changes. Please try again.');
          });
    },

    async saveBackgroundColor() {
      try {

        const response = await axios.post('http://localhost:5000/api/update-background', {
          username: this.myUsername,
          background: this.backgroundColor,
        });

        /*if (response.data.message) {
          this.backr = this.newBio;
        }*/
      } catch (error) {
        console.error('Error updating background:', error);
      }
    },


    async updateBiography() {
      try {
        if (!this.newBio) {
          return;
        }

        const response = await axios.post('http://localhost:5000/api/update-biography', {
          username: this.myUsername,
          bio: this.newBio,
        });

        if (response.data.message) {
          this.myBio = this.newBio;
        }
      } catch (error) {
        console.error('Error updating biography:', error);
        alert('Failed to update biography. Please try again.');
      }
    },


    async fetchGames() {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        this.gamesList = response.data;
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    },

    handlePfpError(event) {
      event.target.src = '/images/pfps/default.png';
    },

    removeSelectedConnection(connectionName) {
      this.selectedConnections = this.selectedConnections.filter(
          (conn) => conn.connection !== connectionName
      );
    },


    generateConnectionsObject() {
      const formattedConnections = this.selectedConnections.map((connectionName) => {
        const connection = this.connections.find(conn => conn.connection === connectionName);
        if (connection && connection.username) {
          return {
            connection: connection.connection,
            username: connection.username
          };
        }
        return null;
      }).filter(conn => conn !== null);

      console.log(formattedConnections);
      return formattedConnections;
    },


    checkHelp() {
      const formattedConnections = this.generateConnectionsObject();
      console.error(formattedConnections);
    },

    openFileExplorer(type) {
      this.cropperType = type;
      if (type === "profile") {
        this.$refs.profileInput.click();
      } else if (type === "background") {
        this.$refs.backgroundInput.click();
      }
    },

    addToSelectedCountries(event) {
      const selected = event.target.value;
      console.error(selected);
      if (!this.selectedCountries.includes(selected)) {
        this.selectedCountries.push(selected);
      }
      event.target.value = "";
    },
    addToSelectedGames(event) {
      const selectedGameName = event.target.value;
      const selectedGame = this.gamesList.find(game => game.name === selectedGameName);

      if (selectedGame && !this.selectedGames.some(game => game.name === selectedGame.name)) {
        this.selectedGames.push(selectedGame);
      }

      event.target.value = "";
    },


    addToSelectedPlatforms(event) {
      const selected = event.target.value;
      console.error(selected);
      if (!this.selectedPlatforms.includes(selected)) {
        this.selectedPlatforms.push(selected);
      }
      event.target.value = "";
    },

    addToSelectedConnections(event) {
      const selectedConnectionName = event.target.value;
      if (!this.selectedConnections.some(conn => conn.connection === selectedConnectionName)) {
        this.selectedConnections.push({ connection: selectedConnectionName, username: '' });
      }
      event.target.value = "";
    },


    removeFromSelectedCountries(countryCode) {
      this.selectedCountries = this.selectedCountries.filter(code => code !== countryCode);
    },
    removeFromSelectedGames(game) {
      this.selectedGames = this.selectedGames.filter(selectedGame => selectedGame.name !== game.name);
    },


    getConnectionByName(name) {
      return this.connections.find((connection) => connection.connection === name);
    },


    removeFromSelectedPlatforms(platformTitle) {
      this.selectedPlatforms = this.selectedPlatforms.filter(title => title !== platformTitle);
    },

    handleFileChange(type) {
      const fileInput = type === "profile" ? this.$refs.profileInput : this.$refs.backgroundInput;
      const file = fileInput.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
        this.$nextTick(() => {
          const imageElement = this.$refs.image;
          if (this.cropper) {
            this.cropper.destroy();
          }
          this.cropper = new Cropper(imageElement, {
            aspectRatio: type === "profile" ? 1 : 10 / 3, // Profile: 1:1, Background: 10:3
            viewMode: 2,
            dragMode: "move",
            autoCropArea: 1,
            responsive: true,
            zoomable: true,
            scalable: true,
          });
        });
      }
    },

    async cropImage(type) {
      if (this.cropper) {
        const canvas = this.cropper.getCroppedCanvas({
          width: type === "profile" ? 300 : 1000, // Profile: 300x300, Background: 1000x300
          height: type === "profile" ? 300 : 300,
        });

        const croppedImage = canvas.toDataURL("image/png");

        if (type === "profile") {
          this.croppedProfileImagePreview = croppedImage;
        } else if (type === "background") {
          this.croppedBackgroundImagePreview = croppedImage;
        }

        this.imagePreview = null;
        this.cropper.destroy();
        this.cropper = null;
        this.cropperType = null;
      }
    },

    async saveChanges(){
      console.error(this.newBio);
      console.error(this.newDisplayedName);
      this.updateDisplayedName();
      this.updateBiography();
      this.saveImages();
      this.saveBackgroundColor();
      alert('Changes saved successfully!');
    },

    async updateDisplayedName() {
      try {
        if (!this.newDisplayedName) {
          return;
        }

        const response = await axios.post('http://localhost:5000/api/update-displayed-name', {
          username: this.myUsername,
          displayedName: this.newDisplayedName,
        });

        if (response.data.message) {
          this.myDisplayedName = this.newDisplayedName;
          store.setUser({
            ...store.state.currentUser,
            displayedName: this.newDisplayedName,
          });
        }
      } catch (error) {
        console.error('Error updating displayed name:', error);
        alert('Failed to update displayed name. Please try again.');
      }
    },


    async saveImages() {
      try {
        if (this.croppedProfileImagePreview) {
          await axios.post('http://localhost:5000/api/save-image', {
            username: this.myUsername,
            image: this.croppedProfileImagePreview,
            type: 'profile',
          });
        }

        if (this.croppedBackgroundImagePreview) {
          await axios.post('http://localhost:5000/api/save-image', {
            username: this.myUsername,
            image: this.croppedBackgroundImagePreview,
            type: 'background',
          });
          alert('Background saved successfully!');
        }
      } catch (error) {
        console.error('Error saving images:', error);
        alert('Failed to save images. Please try again.');
      }
    },




    resetCropper() {
      this.imagePreview = null;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },

    async fetchBio() {
      try {

        const response = await axios.get(`http://localhost:5000/api/biography/${this.myUsername}`);

        this.myBio = response.data.bio;
        console.log('Biography fetched successfully:', this.myBio);
      } catch (error) {
        console.error('Error fetching biography:', error);
      }
    },

    async fetchBackgroundColor() {
      try {
        const response = await axios.get(`http://localhost:5000/api/background/${this.myUsername}`);

        this.backgroundColor = response.data.background;
        console.log('Background color fetched successfully:', this.backgroundColor);
      } catch (error) {
        console.error('Error fetching background color:', error);
      }
    },

    async fetchCurrentEmail() {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-email/${this.myUsername}`);
        this.currentEmail = response.data.email;
      } catch (error) {
        console.error('Error fetching email:', error);
        this.currentEmail = 'Not available';
      }
    },

    async emailChange() {
      this.emailError = '';

      if (!this.newEmail || !this.password) {
        this.emailError = 'Both fields are required.';
        return;
      }
      const emailRequirements = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRequirements.test(this.newEmail)) {
        this.emailError = 'Invalid e-mail format';
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/verify-password', {
          username: this.myUsername,
          password: this.password
        });

        if (response.status === 200) {
           this.emailStepVerified=true;
        }
      } catch (error) {
        console.error('Error verifying password:', error);
        if (error.response && error.response.status === 401) {
          this.emailError = 'Incorrect password.';
        } else {
          this.emailError = 'An error occurred. Please try again later.';
        }
      }
    },

    init(){
      this.fetchBio();
      this.fetchBackgroundColor();
      this.fetchGames();
      this.fetchAboutMe();
      this.fetchCurrentEmail();
    },

  },

  mounted(){
    this.myUsername= store.state.currentUser.username;
    this.init();
    this.myProfilePic = `/images/pfps/${this.myUsername}.png`;
    this.myBackground = `/images/backgrounds/${this.myUsername}.png`;
  }


}

</script>

<style>

.button-yes{
  margin-right:1.5vmin;
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: darkred;
  width: 10vw;
  height: 3vmin;
  font-size: 0.8vw;
  align-self: center;
  justify-items: center;
  display: flex;
  font-weight: bold;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  margin-top: 1vmin;
  cursor: pointer;
}

.button-no{
  margin-right:1.5vmin;
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 10vw;
  height: 3vmin;
  font-size: 0.8vw;
  align-self: center;
  justify-items: center;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  margin-top: 1vmin;
  cursor: pointer;
}

.buttons{
  display: flex;
  justify-content: flex-start;
  gap: 2vmin;
  margin: 2vmin;
}


.account-closing-info{
  font-family: system-ui;
  color: darkred;
  font-weight: bold;
  font-size: large;
  margin: 2vmin
}

.email-info{
  font-family: system-ui;
  color: mediumpurple;
  font-weight: bold;
  font-size: medium;
  margin: 2vmin
}

.password-error{
  font-family: system-ui;
  color: mediumpurple;
  font-weight: bold;
  font-size: medium;
  margin: 2vmin
}

.password-input-bar{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  height: 4vmin;
  width: 50%;
  margin-top: 2vmin;
  color: mediumpurple;
  font-family: system-ui;
  display: flex;
  box-shadow: 0 0 10px rebeccapurple;
}

.account-settings{
  width: 100%;
  height: 95%;
  align-self: center;
  overflow-y: auto;
}

.color-input-style{
  height: 10vmin;
  width: 100%;
}

input.setting-username-input {
  color: rebeccapurple;
  border: 1.5px solid rebeccapurple;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  outline: none;
}

.connection-usernames{
  display:flex;
  align-items: center;
  margin: 2vmin 0;
}

.main-container-settings{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-border-settings{
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  width: 80%;
  display: flex;
  height: 100%;
  background: white;
}

.settings-list{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 22.5%;
  align-self: center;
  height: 95%;
  margin: 0 auto;
  display: block;
  box-shadow: 0 0 10px rebeccapurple;
}

.setting-contents{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 72.5%;
  align-self: center;
  height: 95%;
  margin: 0 auto;
  display: flex;
  box-shadow: 0 0 10px rebeccapurple;
}

.list-contents{
  overflow-y: auto;
  height: 95%;
  padding-top: 2vmin;
}

.list-position{
  font-weight: bold;
  font-family: system-ui;
  font-size: 2.5vmin;
  color: rebeccapurple;
  padding-left: 1vw;
  padding-bottom: 1.5vmin;
  padding-right: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.profile-settings{
  width: 100%;
  height: 95%;
  align-self: center;
  overflow-y: auto;
}

.singular-setting{
  margin: 2vmin
}

.setting-title{
  font-weight: bold;
  margin-bottom: 1vmin;
  font-family: system-ui;
  font-size: 2vmin;
  color: rebeccapurple;
}

.setting-input-text{
  color: mediumpurple;
  font-family: system-ui;
  border: 0;
  height: 85%;
  align-self: center;
  margin-left: 1vmin;
  outline: none;
  width: 90%;
}

.setting-username-input{
  margin-left: auto;
  width: 75%;
}

.setting-input-bar{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  height: 4vmin;
  width: 100%;
  margin-top: 2vmin;
  color: mediumpurple;
  font-family: system-ui;
  display: flex;
  box-shadow: 0 0 10px rebeccapurple;
}

.profile-pic-preview{
  width: 20vmin;
  height: 20vmin;
  background-size: cover;
}

.background-preview{
  height: 20vmin;
  background-size: cover;
}

.connection-title{
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  font-weight: bold;
  font-family: system-ui;
  padding-left: 1vmin;
  font-size: 1.5vmin;
  color: rebeccapurple;
}

.save-button{
  margin-left: auto;
  margin-right:1.5vmin;
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 10vw;
  height: 3vmin;
  font-size: 0.8vw;
  align-self: center;
  justify-items: center;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  margin-top: 1vmin;
  cursor: pointer;
}

.upload-button{
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 5vw;
  height: 3vmin;
  font-size: 0.8vw;
  align-self: center;
  justify-items: center;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  margin-top: 1vmin;
  cursor: pointer;
}

.selected-role-cards{
  display: flex;
  margin-top: 2vmin;
}

.crop-container {
  margin-top: 10px;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}
img {
  width: 100%;
  display: block;
}
.upload-button {
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: auto;
  height: auto;
  padding: 5px 10px;
  font-size: 0.8vw;
  cursor: pointer;
  margin-top: 10px;
}

.about-me-settings{
  width: 100%;
  height: 95%;
  align-self: center;
  overflow-y: auto;
}

.image-operations{
  display: block;
}

.role-card-wrapper {
  position: relative;
  display: inline-block;
}

.remove-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.role-card-wrapper:hover .remove-button {
  opacity: 1;
}

.remove-button-connections{
  cursor: pointer;
  padding: 0 1vmin 0 1vmin;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background-color: red;
  width:15px;
  height: 15px;
  padding: 0.1px;
  top: 0;
  right:0;
  border-radius: 50%;


}

/* WebKit (Chrome, Safari) */
::-webkit-scrollbar {
  background-color: #f1f1f1;
  width: 12px;
}

::-webkit-scrollbar-thumb {
  background-color: mediumpurple;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: mediumpurple;
}

/* Firefox */
scrollbar {
  background-color: #f1f1f1;
  width: 12px;
}

scrollbar-thumb {
  background-color: mediumpurple;
  border-radius: 6px;
}


</style>