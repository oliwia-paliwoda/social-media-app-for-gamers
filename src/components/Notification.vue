<template>
  <div v-if="notiType==='friendRequest'" class="notification">
    <div style="width: 75%;">
      <div class="notification-date">{{formatDateTime(notificationDate)}}</div>
    <div class="notification-text">
      <p>New friend request from <span class="request-sender-name">{{ senderDisplayedName }}</span></p>
    </div>


      <div class="request-buttons">
        <div class="button-view-profile" @click="goToProfile">View profile</div>
        <div class="button-decline"  v-if="action.length===0"  @click="$emit('decline')">Decline</div>
        <div class="button-accept"  v-if="action.length===0"  @click="$emit('accept')">Accept</div>
      </div>

      <div v-if="action.length>0 && action==='declined'" class="notification-result">
        {{'This friend request has been declined.'}}
      </div>
      <div v-if="action.length>0 && action==='accepted'" class="notification-result">
        {{'This friend request has been accepted.'}}
      </div>

    </div>
    <div class="sender-pfp-container">
    <img class="sender-pfp" @error=handlePfpError :src="`/images/pfps/${senderUsername}.png`" ></img>
    </div>
  </div>

  <div v-else-if="notiType==='friendRequestAccepted'" class="notification">
    <div style="width: 75%;">
      <div class="notification-date">{{formatDateTime(notificationDate)}}</div>
      <div class="notification-text">
        <p><span class="request-sender-name">{{ senderDisplayedName }}</span> has accepted your friend request.</p>
      </div>


      <div class="request-buttons">
        <div class="button-view-profile" @click="goToProfile">View profile</div>
      </div>

    </div>
    <div class="sender-pfp-container">
      <img class="sender-pfp" @error=handlePfpError :src="`/images/pfps/${senderUsername}.png`" ></img>
    </div>

  </div>


</template>

<script>

import axios from "axios";
 export default {
   data(){
     return{
       //actionStatus: '',
     }
   },

   props: {


     notiType: {
       type: String,
       required: true,
     },
     senderDisplayedName:{
       type:String
     },
     senderUsername:{
       type: String
     },
     receiver: {
       type:String,
     },
     seenStatus:{
       type: Boolean,
     },
     action:{
       type: String,
     },
     notificationDate: {
     type: String,
     },

   },

     methods: {

       formatDateTime(isoDate) {
         const date = new Date(isoDate);

         const day = date.getDate();
         const month = date.getMonth() + 1;
         const year = date.getFullYear();

         const hours = date.getHours();
         const minutes = date.getMinutes();
         const seconds = date.getSeconds();

         return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
       },

       goToProfile() {
         this.$router.push({
           path: `/profile/${this.senderUsername}`
         });
       },

       handlePfpError(event) {
         event.target.src = '/images/pfps/default.png';
       },

   },

 }


</script>

<style>

.notification{
  margin: 2vmin;
  border: 1px solid mediumpurple;
  border-radius: 2vmin;
  display: flex;
  box-shadow: 0 0 10px rebeccapurple;
  padding: 2vmin;
}

.notification-text{
  margin: 2vmin 0 2vmin 0;
  font-family: system-ui;
  display: flex;
  align-items: center;
  font-size: 2vmin;
  color: rebeccapurple;
}

.request-sender-name{
  font-family: system-ui;
  font-size: 2vmin;
  color: rebeccapurple;
  font-weight: bold;
}

.button-view-profile{
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

.button-accept {
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

.button-decline{
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

.sender-pfp-container{
  width: 25%;
  display: flex;
  align-items: baseline;
  justify-content: end;
}

.sender-pfp{
  width: 10vmin;
  aspect-ratio: 1 / 1;
  border-radius: 2vmin;
  background: rebeccapurple;
}

.notification-result{
  font-family: system-ui;
  color: rebeccapurple;

}

.request-buttons{
  display: flex;
  justify-content: center;
  gap: 2vmin;
  margin: 2vmin 0 2vmin 0;
}

.notification-date{
  font-size: 2vmin;
  color: rebeccapurple;
  font-family: system-ui;
}

</style>