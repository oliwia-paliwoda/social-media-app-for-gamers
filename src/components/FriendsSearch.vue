<template>

  <div class="main-container-friends-search">
    <div class="main-border-friends-search">
      <div class="criteria">
        <div class="criteria-area">
        <div class="singular-criterium">
          <div class="criterium-title">Username</div>
          <div class="criterium-input-bar">
            <input class="criterium-input-text"  v-model="searchedUsername" placeholder="Search by username..."/>
          </div>
        </div>


          <div class="singular-criterium">
            <div class="criterium-title">Country</div>
            <div class="criterium-input-bar">
              <select class="criterium-input-text" @change="addToSelectedCountries($event)">
                <option value="" disabled selected>Select countries</option>
                <option
                    v-for="(countryName, countryCode) in countries"
                    :key="countryCode"
                    :value="countryCode">
                  {{ countryName }}
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


          <div class="singular-criterium">
            <div class="criterium-title">Connections</div>
            <div class="criterium-input-bar">
              <select class="criterium-input-text" @change="addToSelectedConnections($event)">
                <option value="" disabled selected>Select connections</option>
                <option
                    v-for="connectionObj in connections"
                    :key="connectionObj.connection"
                    :value="connectionObj.connection">
                  {{ connectionObj.connection }}
                </option>
              </select>
            </div>

            <!-- Dynamiczne pole input -->
            <div class="selected-role-cards">
              <div
                  v-for="connectionObj in selectedConnections"
                  :key="connectionObj.connection"
                  class="role-card-wrapper"
                  @mouseenter="hoveredCard = connectionObj.connection"
                  @mouseleave="hoveredCard = null"
              >
                <role-card :connection="connectionObj.connection" />

                <!-- Krzyżyk do usuwania -->
                <span
                    v-if="hoveredCard === connectionObj.connection"
                    class="remove-button"
                    @click="removeSelectedConnection(connectionObj.connection)"
                >
      ✖
    </span>
              </div>
            </div>

          </div>

          <div class="singular-criterium">
            <div class="criterium-title">Platforms</div>
            <div class="criterium-input-bar">
              <select class="criterium-input-text" @change="addToSelectedPlatforms($event)">
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

          <div class="singular-criterium">
            <div class="criterium-title">Games</div>
            <div class="criterium-input-bar">
              <select class="criterium-input-text" @change="addToSelectedGames($event)">
                <option value="" disabled selected>Select games</option>
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




          <div class="checkbox-setting">
        <input type="radio" class="styled-checkbox"  v-model="selectedOption" :value="'all'"/>
          <div class="checkbox-title">Search all</div>
        </div>
        <div class="checkbox-setting">
        <input type="radio" class="styled-checkbox"  v-model="selectedOption"  :value="'at-least-one'"/>
          <div class="checkbox-title">Search at least one</div>
        </div>



          <div class="buttons">
            <div @click="clearAll" class="clear-button">Clear all</div>
            <div @click="searchFriends" class="search-button">Search</div>
          </div>

          </div>



      </div>




      <div class="results">
        <div class="suggestions" v-if="!searchClicked && !emptyAboutMe">Suggested users with something in common with you:</div>
        <div class="suggestions" v-if="!searchClicked && emptyAboutMe">
          Tell us about yourself <span @click="goToSettings()" class="settings-link" >here</span> to get personalized friends suggestions!
        </div>
        <div v-if="emptySearch" class="empty-search">No users found.</div>
        <div v-if="!searchClicked" class="results-list">
          <friend-found
              v-for="user in suggestedFriends"
              :username="user.username"
              :displayed-name="user.displayedName"
              :matched-connections="user.matchingConnections"
              :matched-countries="user.matchingCountries"
              :matched-games="user.matchingGames"
              :matched-platforms="user.matchingPlatforms"
              :friend-request-status="user.friendRequestStatus"
              @update-status="updateFriendRequestStatusSuggested"
          ></friend-found>
        </div>
        <div v-if="searchClicked" class="results-list">
         <friend-found
          v-for="user in transformedUsers"
          :username="user.username"
          :displayed-name="user.displayedName"
          :matched-connections="user.matchedConnections"
          :matched-countries="user.matchedCountries"
          :matched-games="user.matchedGames"
          :matched-platforms="user.matchedPlatforms"
          :friend-request-status="user.friendRequestStatus"
          @update-status="updateFriendRequestStatusSearched"
         ></friend-found>
        </div>
      </div>



    </div>
  </div>
</template>

<script>

import roleCard from "./RoleCard.vue";
import countryNames from "../countryNames";
import friendFound from "./FriendFound.vue";
import gameCard from "./GameCard.vue";
import axios from "axios";
import {store} from "../../store";

export default {
  components: {
    'game-card': gameCard,
    'role-card': roleCard,
    'friend-found': friendFound,
  },

   mounted() {

    this.init();
  },

  data() {
    return {

      NAME: 'FriendsSearch',
      myUsername: store.state.currentUser.username,
      myDisplayedName: store.state.currentUser.displayedName,
      hoveredCard: null,
      emptySearch: false,
      searchClicked: false,
      suggestedFriends: [],
      emptyAboutMe: undefined,

      matchedUsers: [],

      selectedOption: 'all',

      searchedUsername: '',
      gamesList: [],
      selectedGames: [],

      transformedUsers: [],

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

    }

  },

  methods: {

    goToSettings(){
      this.$router.push({
        path: '/settings',
      });
    },

    updateFriendRequestStatusSearched({ username, status }) {
      const user = this.transformedUsers.find((u) => u.username === username);
      if (user) {
        user.friendRequestStatus = status;
      }
    },

    updateFriendRequestStatusSuggested({ username, status }) {
      const user = this.suggestedFriends.find((u) => u.username === username);
      if (user) {
        user.friendRequestStatus = status;
      }
    },

    async transformMatchedUsers() {
      this.transformedUsers = await Promise.all(this.matchedUsers.map(async (user) => {
        // Matched Connections
        const matchedConnections = this.selectedConnections.filter(selectedConn =>
            user.connections.some(userConn => userConn.connection === selectedConn.connection)
        );

        // Matched Countries
        const matchedCountries = this.selectedCountries.filter(country =>
            user.country.includes(country)
        );

        // Matched Games
        const matchedGames = user.games
            .filter(gameName =>
                this.selectedGames.some(selectedGame => selectedGame.name === gameName)
            )
            .map(gameName => {
              const matchedGame = this.selectedGames.find(selectedGame => selectedGame.name === gameName);
              return { name: matchedGame.name, path: matchedGame.path };
            });

        // Matched Platforms
        const matchedPlatforms = this.selectedPlatforms.filter(platform =>
            user.platforms.includes(platform)
        );


        const friendRequestStatus = await this.checkFriendRequestStatus(user.username);


        return {
          username: user._id,
          displayedName: user.username,
          matchedConnections,
          matchedCountries,
          matchedGames,
          matchedPlatforms,
          friendRequestStatus,
        };
      }));

      if(!this.matchedUsers.length){
        this.emptySearch=true;
      }
      else if(this.matchedUsers.length){
        this.emptySearch=false;
      }

      console.error(this.transformedUsers);
    },



    async checkFriendRequestStatus(username) {
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications/friend-request`, {
          params: { myUsername: this.myUsername, username: username }
        });

        const notification = response.data;
        if (!notification) {
          return 'none';
        } else if (notification.senderUsername === this.myUsername) {
          return 'sent';
        } else if (notification.receiver === this.myUsername) {
          return 'received';
        }
      } catch (error) {
        console.error('Error checking friend request status:', error);
      }
    },

    async searchFriends() {
      const params = {};
      this.searchClicked = true;


      if (this.searchedUsername) {
        params.searchedUsername = this.searchedUsername;
      }

      params.myUsername = this.myUsername;


      if (this.selectedCountries && this.selectedCountries.length > 0) {
        const cleanSelectedCountries = this.selectedCountries.slice();
        params.selectedCountries = JSON.stringify(cleanSelectedCountries);
      }


      if (this.selectedConnections && this.selectedConnections.length > 0) {
        const connectionNames = this.selectedConnections.map((conn) => conn.connection);
        params.selectedConnections = JSON.stringify(connectionNames);
      }


      if (this.selectedPlatforms && this.selectedPlatforms.length > 0) {
        params.selectedPlatforms = JSON.stringify(this.selectedPlatforms);
      }


      if (this.selectedGames && this.selectedGames.length > 0) {
        const gameNames = this.selectedGames.map((game) => game.name);
        params.selectedGames = JSON.stringify(gameNames);
      }


      if (this.selectedOption) {
        params.selectedOption = this.selectedOption;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/search-users', { params });
        this.matchedUsers = response.data;
        console.error('Found users:', this.matchedUsers);
        this.transformMatchedUsers();
      } catch (error) {
        const errorMessage =
            error.response && error.response.data
                ? error.response.data
                : error.message;
        console.error('Error fetching users:', errorMessage);
        alert('Failed to fetch users. Please try again.');
      }
    },



    clearAll(){
      this.searchClicked=false;
      this.searchedUsername='';
      this.selectedConnections=[];
      this.selectedCountries=[];
      this.selectedGames=[];
      this.selectedPlatforms=[];
    },

    addToSelectedGames(event) {
      const selectedGameName = event.target.value;
      const selectedGame = this.gamesList.find(game => game.name === selectedGameName);

      if (selectedGame && !this.selectedGames.some(game => game.name === selectedGame.name)) {
        this.selectedGames.push(selectedGame);
      }

      event.target.value = "";
    },

    removeFromSelectedGames(game) {
      this.selectedGames = this.selectedGames.filter(selectedGame => selectedGame.name !== game.name);
    },


    addToSelectedPlatforms(event) {
      const selected = event.target.value;
      console.error(selected);
      if (!this.selectedPlatforms.includes(selected)) {
        this.selectedPlatforms.push(selected);
      }
      event.target.value = "";
    },
    removeFromSelectedPlatforms(platformTitle) {
      this.selectedPlatforms = this.selectedPlatforms.filter(title => title !== platformTitle);
    },



    addToSelectedCountries(event) {
      const selected = event.target.value;
      console.error(selected);
      if (!this.selectedCountries.includes(selected)) {
        this.selectedCountries.push(selected);
      }
      event.target.value = "";
    },

    removeFromSelectedCountries(countryCode) {
      this.selectedCountries = this.selectedCountries.filter(code => code !== countryCode);
    },

    addToSelectedConnections(event) {
      const selectedConnectionName = event.target.value;
      if (!this.selectedConnections.some(conn => conn.connection === selectedConnectionName)) {
        this.selectedConnections.push({ connection: selectedConnectionName });
      }
      event.target.value = "";
    },

    removeSelectedConnection(connectionName) {
      this.selectedConnections = this.selectedConnections.filter(
          (conn) => conn.connection !== connectionName
      );
    },




    init(){
      this.fetchGames();
      this.fetchAboutMe();
      this.fetchMatchingUsers();
    },

    async fetchAboutMe() {
      try {
        const response = await axios.get(`http://localhost:5000/api/user-details/${this.myUsername}`);
        const { country, connections, platforms, games } = response.data;
        if(!country.length && !connections.length && !platforms.length && !games.length) {
          this.emptyAboutMe = true;
        }


        console.log('User details fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },

    async fetchMatchingUsers() {
      try {
        const response = await axios.get('http://localhost:5000/api/matching-users', {
          params: { myUsername: this.myUsername },
        });

        this.suggestedFriends = await Promise.all(response.data.map(async user => {
          const friendRequestStatus = await this.checkFriendRequestStatus(user.username);
          return {
            ...user,
            friendRequestStatus
          };
        }));

        return this.suggestedFriends;
      } catch (error) {
        console.error('Error fetching matching users:', error);
        throw error;
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



  },
}

</script>

<style>

.settings-link{
  font-weight: bold;
  cursor: pointer;
}

.settings-link:hover{
  color: mediumpurple;
}

.empty-search{
  text-align: center;
  width: 100%;
  height: inherit;
  font-weight: 600;
  color: rebeccapurple;
  font-family: system-ui;
  align-content: center;
}

.results-list{
  display: flex;
  flex-direction: column;
  width: 100%;
  //overflow-y: auto;
  height: 98%;
}

.buttons{
  display: flex;
  justify-content: flex-end;
  gap: 2vmin;
  margin-right: 2vmin;
}

.suggestions{
  background-color: rgba(147, 112, 219, 0.3);
  font-family: system-ui;
  text-align: center;
  padding: 1vmin;
  border-radius: 2vmin;
  margin: 1vmin;
  color: rebeccapurple;
}


.search-button{
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

.clear-button{
  font-family: system-ui;
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  color: mediumpurple;
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

.criteria-area{
  overflow-y: auto;
  max-height: 94%;
}

.selected-role-cards{
  display: flex;
  margin-top: 2vmin;
  flex-wrap: wrap;
}

.styled-checkbox:checked {
  background-color: mediumpurple;
  border-color: mediumpurple;
}

.styled-checkbox {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: 2px solid mediumpurple;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
  cursor: pointer;
}

.checkbox-setting{
  display: flex;
  margin: 2vmin;
}

.styled-checkbox:checked::before {
  content: "✔";
  display: block;
  color: white;
  font-size: 14px;
  text-align: center;
  line-height: 20px;
}

.criterium-input-bar{
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

.singular-criterium{
  margin: 2vmin;
}

.criterium-title{
  font-weight: bold;
  margin-bottom: 1vmin;
  font-family: system-ui;
  font-size: 2vmin;
  color: rebeccapurple;
}

.checkbox-title{
  color: mediumpurple;
  font-family: system-ui;
  height: 85%;
  font-weight: bold;
  align-self: center;
  margin-left: 1vmin;
  outline: none;
}

.criterium-input-text{
  color: mediumpurple;
  font-family: system-ui;
  border: 0;
  height: 85%;
  align-self: center;
  margin-left: 1vmin;
  outline: none;
  width: 90%;
}

.results{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 42.5%;
  align-self: center;
  height: 95%;
  margin: 0 auto;
  display: block;
  overflow-y: auto;
  box-shadow: 0 0 10px rebeccapurple;
}

.criteria{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 52.5%;
  align-self: center;
  height: 95%;
  margin: 0 auto;
  display: block;
  box-shadow: 0 0 10px rebeccapurple;
}

.main-container-friends-search {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-border-friends-search {
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  width: 80%;
  display: flex;
  height: 100%;
  background: white;
}

</style>