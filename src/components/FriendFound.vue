<template>
  <div class="friend-border">
    <div class="friend-profile">
    <img class="friend-pfp" @error="handlePfpError" :src="`/images/pfps/${username}.png`"/>
      <div class="friend-username">{{displayedName}}</div>
      <div class="friend-id">{{'@'+username}}</div>
    </div>
    <div class="detail">
    <div v-if="matchedCountries && matchedCountries.length>0" class="detail-type">Matched countries</div>
    <div class="detail-role-cards">
      <role-card v-for="country in matchedCountries" :country-code="country"></role-card>

    </div>
    </div>
    <div class="detail">
      <div v-if="matchedConnections && matchedConnections.length>0" class="detail-type">Matched connections</div>
      <div class="detail-role-cards">
        <role-card v-for="connectionObj in matchedConnections" style="font-weight: normal;" :connection="connectionObj.connection" ></role-card>


      </div>
    </div>
    <div class="detail">
      <div v-if="matchedPlatforms && matchedPlatforms.length>0" class="detail-type">Matched platforms</div>
      <div class="detail-role-cards">
        <role-card v-for="platform in matchedPlatforms" :role="platform"></role-card>
      </div>
    </div>
    <div class="detail">
      <div v-if="matchedGames && matchedGames.length>0" class="detail-type">Matched games</div>
      <div class="detail-role-cards">
        <game-card v-for="game in matchedGames" :title="game.name" :name="game.name" :imgpath=game.path></game-card>
      </div>
    </div>
    <div v-if="friendRequestStatus==='sent'" class="friend-request-info">A friend request has been sent already.</div>
    <div class="friend-buttons">
      <div @click="goToProfile" class="button" style="background: none; border: 1px solid mediumpurple; color: mediumpurple">Profile</div>
      <div v-if="friendRequestStatus==='none'" @click="sendFriendRequest" class="button">Add friend</div>
      <div v-else-if="friendRequestStatus==='received'" @click="goToNotifications" class="button friend-request">Answer the friend request</div>
    </div>
  </div>
</template>

<script>

import roleCard from "./RoleCard.vue";
import axios from "axios";
import gameCard from "./GameCard.vue";
import {store} from "../../store";

export default {
  data() {
    return {
      NAME: 'FriendFound',
      myDisplayedName: store.state.currentUser.displayedName,
      myUsername: store.state.currentUser.username,

    }

  },

  props: {
    username: {
      type: String,
    },
    displayedName: {
      type: String,
    },
    matchedGames:{
      type: Array,
    },
    matchedCountries:{
      type: Array,
    },
    matchedConnections:{
      type:Array,
    },
    matchedPlatforms: {
      type: Array
    },
    friendRequestStatus: {
      type: String
    }
  },

  components: {
    'game-card': gameCard,
    'role-card': roleCard,
  },

  methods:{

    handlePfpError(event) {
      event.target.src = '/images/pfps/default.png';
    },

    goToProfile(){
      this.$router.push({
        path: `/profile/${this.username}`
      });
    },

    goToNotifications(){
      this.$router.push({
        path: '/notifications'
      });
    },

    async sendFriendRequest() {
      try {
        const payload = {
          receiver: this.username,
          senderDisplayedName: this.myDisplayedName,
          senderUsername: this.myUsername,
        };


        console.error('Payload being sent:', payload);

        const response = await axios.post('http://localhost:5000/api/notifications/send-friend-request', payload);
        console.log('Friend request sent successfully:', response.data);
        alert('Friend request sent successfully!');
        this.$emit('update-status', { username: this.username, status: 'sent' });
      } catch (error) {
        console.error('Error sending friend request:', error);
        alert('Failed to send friend request.');
      }
    },
  }


}
</script>

<style>
.friend-buttons{
  display: flex;
  justify-content: center;
  gap: 2vmin;
}

.button{
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 7vw;
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
  text-align: center;
}

.friend-request{
  font-size: 0.8vw;
  width: 10vw;
}

.friend-profile{
  display: flex;
  align-items: center;
  justify-items: center;
}

.friend-pfp{
  flex-shrink: 0;
  width: 7vmin;
  height: 7vmin;
  margin: 1vmin;
  border: 1px solid grey;
  border-radius: 2vmin;
  background-color: rebeccapurple;
}

.detail-type{
  font-weight: bold;
  padding: 0 0 1vmin 1vmin;
  font-family: system-ui;
  font-size: 1.5vmin;
  color: rebeccapurple;
}

.friend-request-info{
  text-align: center;
  font-family: system-ui;
  margin: 1vmin;
  color: mediumpurple;
  font-weight: 500;
}

.friend-username{
  font-weight: bold;
  width: 50%;
  font-family: system-ui;
  font-size: 2vmin;
  padding-right: 0.5vmin;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-id{
  color: mediumpurple;
  font-family: system-ui;
  font-size: 2vmin;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-role-cards{
  display: flex;
  flex-wrap: wrap;
  transform: scale(0.8);
  transform-origin: top left;
  margin-left: 1vmin;

}

.detail{
  flex-direction: column;
  width: 100%;
  display: flex;
  height: auto;
}
.friend-border{
  height: auto;
  padding: 2vmin;
  margin: 2vmin;
  border: 1px solid mediumpurple;
  border-radius: 2vmin;
  box-shadow: 0 0 10px rebeccapurple;

}
</style>