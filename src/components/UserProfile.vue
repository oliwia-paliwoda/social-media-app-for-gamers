<template>
  <div class="main-container">
<div class="main-border">
  <div class="main-two-sections">
    <div class="background-profile" :style="{ backgroundColor: backgroundColor || '#999999' }">
      <div v-if="isFriend && !questionBoxVisible" class="remove-friend-icon" @click="showQuestionBox">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0,0,256,256">
          <g fill="#9874dc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M64,256c-35.34622,0 -64,-28.65378 -64,-64v-128c0,-35.34622 28.65378,-64 64,-64h128c35.34622,0 64,28.65378 64,64v128c0,35.34622 -28.65378,64 -64,64z" id="shape"></path></g><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M17,2c-5.514,0 -10,4.486 -10,10c0,5.514 4.486,10 10,10c5.514,0 10,-4.486 10,-10c0,-5.514 -4.486,-10 -10,-10zM35,24c-6.065,0 -11,4.935 -11,11c0,6.065 4.935,11 11,11c6.065,0 11,-4.935 11,-11c0,-6.065 -4.935,-11 -11,-11zM6.22266,26c-2.053,0 -3.72266,1.78452 -3.72266,3.97852v1.52148c0,3.281 1.69539,6.13234 4.77539,8.02734c2.591,1.595 6.04461,2.47266 9.72461,2.47266c2.19,0 4.43152,-0.32423 6.47852,-0.99023c-0.94,-1.799 -1.47852,-3.83977 -1.47852,-6.00977c0,-3.496 1.38681,-6.664 3.63281,-9zM35,27c1.665,0 3.21019,0.51272 4.49219,1.38672l-11.10547,11.10547c-0.874,-1.282 -1.38672,-2.82719 -1.38672,-4.49219c0,-4.411 3.589,-8 8,-8zM41.61328,30.50781c0.874,1.282 1.38672,2.82719 1.38672,4.49219c0,4.411 -3.589,8 -8,8c-1.665,0 -3.21019,-0.51272 -4.49219,-1.38672z"></path></g></g>
        </svg>
      </div>
      <div v-if="questionBoxVisible" class="question-box">
        <div class="question-text">Remove friend?</div>
        <div class="buttons-remove-friend">
          <div @click="removeFriend" class="button-yes-no">Yes</div>
          <div @click="dontRemoveFriend" class="button-yes-no">No</div>
        </div>
      </div>
      <img class="profile-pic-userprofile" @error="handlePfpError" :src="`/images/pfps/${username}.png`" />
    </div>
    <div class="profile-navbar">
      <div class="name">
      <div class="username">{{this.displayedName}}</div>
      <div class="at">{{'@'+this.username}}</div>
        <div v-if="!isFriend && friendRequestStatus==='none'" class="friend-request-button" @click="sendFriendRequest">Send a friend request</div>
        <div v-if="!isFriend && friendRequestStatus==='sent'" class="friend-request-info" >A friend request has been send.</div>
        <div v-if="!isFriend && friendRequestStatus==='received'" class="friend-request-button" @click="goToNotifications">Answer the friend request</div>

      </div>
      <div class="bio">{{this.userBio}}</div>
    </div>
    <div class="contents">
      <div class="posts" v-if="posts.length === 0">
        <div class="no-posts">This user has not published any posts yet.</div>
      </div>
      <div v-else class="posts">
        <singular-post
            v-for="post in posts"
            :key="post.postId"
            :postContent="post.content"
            :displayed-name="post.displayedName"
            :username="'@' + post.userId"
            :like-count="post.starCount"
            :comment-count="post.commentCount"
            :post-id="post.postId"
            :liked-by-user="post.likedByUser"
            @toggle-like="handleToggleLike(post.postId)"
        />
      </div>

      <div class="about-me">
        <div class="about-me-title">About me</div>
        <div class="empty-about-me" v-if="!connections.length && !platforms.length && !games.length && !country.length">This user's About Me section is empty.</div>
        <div v-if="country.length!==0" class="category-divider">Country</div>
        <div v-if="country.length!==0" class="category-contents">
          <role-card
              v-for="countryRole in country"
              :country-code="countryRole"
          ></role-card>
        </div>
        <div v-if="connections.length!==0" class="category-divider">Connections</div>
        <div v-if="connections.length!==0" class="category-contents">
          <role-card
              v-for="connection in connections"
              :connection="connection.connection"
              :username="connection.username"
          ></role-card>
        </div>
        <div v-if="platforms.length!==0" class="category-divider">Platforms</div>
        <div v-if="platforms.length!==0" class="category-contents">
          <role-card
              v-for="platform in platforms"
              :role="platform"
          ></role-card>
        </div>
        <div v-if="games.length!==0" class="category-divider">Games</div>
        <div v-if="games.length!==0"class="category-contents-games">
          <game-card
              v-for="game in games"
              :imgpath="game.path"
              :title="game.name"
              :name="game.name"
          />


        </div>


      </div>

    </div>
  </div>
</div>
  </div>
</template>

<script>
import singularPost from "../components/singularPost.vue";
import roleCard from "../components/RoleCard.vue";
import gameCard from "../components/GameCard.vue";
import axios from "axios";
import { store } from "../../store"
export default {
  components: {
    "singular-post": singularPost,
    "role-card": roleCard,
    "game-card": gameCard
  },
  data() {
    return {

      NAME: 'UserProfile',
      country:[],
      platforms: [],
      connections: [],
      games: [],
      questionBoxVisible:false,

      friendRequestStatus: 'none',

      backgroundColor: '',
      myUsername: store.state.currentUser.username,
      myDisplayedName: store.state.currentUser.displayedName,
      username: this.$route.params.userId,
      isFriend: true,
      displayedName: '',
      userBio: '',
      isDesktop: true,
      searchPhraseFriends: '',
      searchPhraseDashboard: '',
      searchPhraseChats: '',
      viewPostDetails: false,
      selectedPost: null,
      posts: [],
    }
  },

  methods: {

    goToNotifications() {
      this.$router.push({
        path: '/notifications'
      });
    },

    async removeFriend() {
      try {
        const payload = {
          myUsername: this.myUsername,
          friendUsername: this.username,
        };

        const response = await axios.delete('http://localhost:5000/api/friends/remove', {
          data: payload,
        });

        console.log(response.data.message);
        alert('Friend removed successfully.');

        this.isFriend = false;
        this.questionBoxVisible = false;
      } catch (error) {
        console.error('Error removing friend:', error);
        alert('Failed to remove friend.');
      }
    },


    dontRemoveFriend(){
      this.questionBoxVisible=false;
    },

    showQuestionBox(){
      this.questionBoxVisible=true;
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
        this.friendRequestStatus='sent';
      } catch (error) {
        console.error('Error sending friend request:', error);
        alert('Failed to send friend request.');
      }
    },


    async fetchDisplayedName(username) {
      try {
        const response = await axios.get(`http://localhost:5000/api/displayedname/${username}`);
        this.displayedName = response.data.displayedName;
      } catch (error) {
        console.error('Error fetching displayed name:', error);
        alert('Failed to fetch displayed name.');
      }
    },

    handlePfpError(event) {
      event.target.src = '/images/pfps/default.png';
    },

    handleBackgroundError(event) {
      event.target.src = '/images/backgrounds/default.png';
    },


    async handleToggleLike(postId) {
      const post = this.posts.find(p => p.postId === postId);

      if (!post) return;

      try {
        if (post.likedByUser) {
          await axios.post(`http://localhost:5000/api/posts/unlike/${postId}`, {
            username: this.myUsername
          });
          post.starCount -= 1;
          post.likedByUser = false;
        } else {
          await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {
            username: this.myUsername
          });
          post.starCount += 1;
          post.likedByUser = true;
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },

    async fetchFriends() {
      try {
        const response = await axios.get(`http://localhost:5000/api/friends/${this.myUsername}`);
        this.friends = response.data;
        this.isFriend =  this.friends.some(friend => friend.username === this.username);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },

    async fetchBackgroundColor() {
      try {
        const response = await axios.get(`http://localhost:5000/api/background/${this.username}`);

        this.backgroundColor = response.data.background;
        console.error(this.backgroundColor);
        console.log('Background color fetched successfully:', this.backgroundColor);
      } catch (error) {
        console.error('Error fetching background color:', error);
      }
    },

    init(){

      this.displayedName = '';
      this.userBio = '';
      this.posts = [];
      this.country = [];
      this.connections = [];
      this.platforms = [];
      this.games = [];
      this.backgroundColor='';

      this.fetchFriends();
      this.checkFriendRequestStatus();
      this.fetchDisplayedName(this.username);
      this.fetchBio();
      this.fetchBackgroundColor();
      this.fetchPosts(this.username);
      this.fetchAboutMe(this.username);
    },

    async fetchAboutMe(userId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/user-details/${userId}`);
        const { country, connections, platforms, games } = response.data;

        this.country = country;
        this.connections = connections;
        this.platforms = platforms;
        this.games = games;

        console.log('User details fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },

    async fetchBio() {
      try {
        if (!this.username) {
          alert('Please provide a username');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/biography/${this.username}`);

        this.userBio = response.data.bio;
        console.log('Biography fetched successfully:', this.userBio);
      } catch (error) {
        console.error('Error fetching biography:', error);
      }
    },

    async fetchPosts(userId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/user/${userId}`);
        this.posts = response.data.map(post => ({
          ...post,
          likedByUser: post.likedBy && post.likedBy.includes(this.myUsername) || false
        }));
        console.log('Posts fetched successfully:', this.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },

    async checkFriendRequestStatus() {
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications/friend-request`, {
          params: { myUsername: this.myUsername, username: this.username }
        });

        const notification = response.data;

        if (!notification) {
          this.friendRequestStatus = 'none';
        } else if (notification.senderUsername === this.myUsername) {
          this.friendRequestStatus = 'sent';
        } else if (notification.receiver === this.myUsername) {
          this.friendRequestStatus = 'received';
        }
      } catch (error) {
        console.error('Error checking friend request status:', error);
      }
    }


  },

  mounted(){
    this.init();
  },

  watch: {
    '$route.params.userId'(newUserId) {
      this.username = newUserId;
      this.init();
    }
  }

}
</script>

<style scoped>

.empty-about-me{
  text-align: center;
  margin: 2vmin;
  color: rebeccapurple;
  font-family: system-ui;
}

.buttons-remove-friend{
  display: flex;
  justify-content: flex-end;
  gap: 2vmin;
}

.question-box{
  top: 2vmin;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 100px;
  border-radius: 2vmin;
  background-color: white;
  right: 5vmin;
  position: absolute;
}

.question-text{
    padding: 1.5vmin;
    font-family: system-ui;
    font-size: small;
    color: rebeccapurple;
  }

.button-yes-no{
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 4vmin;
  height: 3vmin;
  font-size: 0.8vw;
  align-self: center;
  justify-items: center;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  cursor: pointer;
}


.no-posts{
  background-color: rgba(147, 112, 219, 0.3);
  font-family: system-ui;
  text-align: center;
  padding: 1vmin;
  border-radius: 2vmin;
  margin-top: 2vmin;
  color: rebeccapurple;
}

.main-border{
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  width: 80%;
  height: 100%;
  background: white;
}

.main-container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-two-sections{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.background{
  height: 30%;
  border-bottom: 1px solid grey;
  background-size: cover;
  background-color: purple;
  background-image: url("/images/background.jpg");
}

.background-profile {
  width: 100%;
  height: 250px;
  position: relative;
  background-color: blueviolet;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: blueviolet;
}

.profile-pic-userprofile{
  width: 25vmin;
  height: 25vmin;
  position: relative;
  left: 10vmin;
  bottom: -10%;
  /*background-color: rebeccapurple;*/
  background-image: url('/images/pfp.jpg');
  background-size: cover;
  border-radius: 1vmin;
  box-shadow: 0 0 10px black;
}

.profile-navbar{
  padding-bottom: 3vmin;
  width: 89%;
  margin: 0 auto;
  margin-top: 5vmin;
}

.contents{
  height: 55%;
  display: flex;
  padding: 4%;
  /* padding-left: 10vmin; */
  /* padding-right: 10vmin; */
  /* padding-top: 5vmin; */
  overflow-y: scroll;
  border-top: 1px solid lightgray;
}

.remove-friend-icon{
  width: fit-content;
  height: fit-content;
  display: flex;
  position: absolute;
  top: 2vmin;
  right: 2vmin;
  cursor: pointer;
}

.profile-pic {
  width: 25vmin;
  height: 25vmin;
  position: relative;
  left: 10vmin;
  top: 5vmin;
  /*background-color: rebeccapurple;*/
  background-image: url('/images/pfp2.jpg');
  background-size: cover;
  border-radius: 1vmin;
  box-shadow: 0 0 10px black;
}

.username{
  padding-right: 1vmin;
}

.bio{

  font-family: system-ui;

}


.posts{
  margin-bottom: 1vmin;
  display: block;
  width: 61%;
  height: 100%;

}


.category-contents-games{
  display: flex;
  margin: 1vmin;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 450px;
}



.about-me{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 35%;
  margin-left: auto;
  margin-top: 2vmin;
  display: block;
  height: fit-content;
  box-shadow: 0 0 10px rebeccapurple;
}

.about-me-title{
  font-family: system-ui;
  font-weight: 600;
  font-size: x-large;
  padding: 1vmin;
  text-align: center;
  color: mediumpurple;
}

.category-divider{
  font-family: system-ui;
  color: mediumpurple;
  border-bottom: 1px solid mediumpurple;
  padding: 1vmin;
  font-weight: 600;
}

.profile-pic-miniature{
  width: 7vmin;
  height: 7vmin;
  margin: 1vmin;
  border: 1px solid grey;
  border-radius: 2vmin;
  background-color: rebeccapurple;
}


.star-icon{
  width: 3vmin;
  height: 3vmin;
  stroke:mediumpurple;
  margin-right: 0.5vmin;
}

.post-bottom-bar{
  display: flex;
  padding-top: 1vmin;
  padding-left: 1vmin;
  padding-right: 1vmin;
  margin-bottom: auto;
}

.comment-icon{
  width: 3vmin;
  height: 3vmin;
  stroke:mediumpurple;
  margin-right: 0.5vmin;

}

.star-count{
  align-self: end;
  font-family: system-ui;
  font-size: 1.5vmin;
  margin-right: 1vmin;
  margin-left: 1vmin;
}

.comment-count{
  align-self: end;
  margin-left: 1vmin;
  font-family: system-ui;
  font-size: 1.5vmin;
}

.publisher-details{
  display: flex;
  align-items: center;
}

.publisher-name{
  display:block;
}

.publisher-username{
  font-weight: bold;
  font-family: system-ui;
}

.publisher-at{
  color:mediumpurple;
  font-family: system-ui;
}

.read-more{
  margin-left: auto;
  text-align: center;
  padding-top: 0.5vmin;
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 10%;
  height: 3vmin;
  font-size: 1.5vmin;
  align-self: center;
  justify-items: center;
}

.name{
  display:flex;
  font-weight: bold;
  font-family: system-ui;
  position: relative;
  font-size: xx-large;
  width: 100%;
  margin-bottom: 1vmin;
}

.at {
  color: mediumpurple;
  font-family: system-ui;
  font-size: smaller;
  align-self: center;

}
/* WebKit (Chrome, Safari) */
::-webkit-scrollbar {
  background-color: #f1f1f1; /* Kolor tła paska przewijania */
  width: 12px; /* Szerokość paska przewijania */
}

::-webkit-scrollbar-thumb {
  background-color: mediumpurple; /* Kolor samego paska przewijania */
  border-radius: 6px; /* Zaokrąglenie rogów paska przewijania */
}

::-webkit-scrollbar-thumb:hover {
  background-color: mediumpurple; /* Kolor paska przewijania po najechaniu myszką */
}

/* Firefox */
scrollbar {
  background-color: #f1f1f1; /* Kolor tła paska przewijania */
  width: 12px; /* Szerokość paska przewijania */
}

scrollbar-thumb {
  background-color: mediumpurple; /* Kolor samego paska przewijania */
  border-radius: 6px;
}

.category-contents{
  display: flex;
  margin: 1vmin;
  flex-wrap: wrap;
}

.language{
  display: flex;
  padding: 1vmin;
}

.language-name{
  font-family: system-ui;
  align-self: center;
}
.language-flag{
  margin-right: 1vmin;
}

.friend-request-button{
  margin-left: auto;
  /* margin-right: 1.5vmin; */
  font-family: system-ui;
  background-color: mediumpurple;
  border-radius: 2vmin;
  color: white;
  width: 10vw;
  height: 4vmin;
  font-size: 0.8vw;
  align-self: center;
  justify-items: center;
  display: flex
;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  /* margin-top: 1vmin; */
  cursor: pointer;
  }

.friend-request-info{
  color: rebeccapurple;
  font-size: medium;
  font-weight: bold;
  font-family: system-ui;
  align-self: center;
  margin-left: auto;
}

</style>
