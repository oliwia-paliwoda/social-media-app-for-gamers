<template>
  <div class="main-container">
<div class="main-border">
  <div class="main-two-sections">
    <div class="background-profile" :style="{ backgroundColor: backgroundColor || '#999999' }">
      <div class="settings-icon" @click="goToSettings">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="5vmin" height="5vmin" fill-rule="nonzero"><g fill="#9874dc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M64,256c-35.34622,0 -64,-28.65378 -64,-64v-128c0,-35.34622 28.65378,-64 64,-64h128c35.34622,0 64,28.65378 64,64v128c0,35.34622 -28.65378,64 -64,64z" id="shape"></path></g><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M47.16,21.221l-5.91,-0.966c-0.346,-1.186 -0.819,-2.326 -1.411,-3.405l3.45,-4.917c0.279,-0.397 0.231,-0.938 -0.112,-1.282l-3.889,-3.887c-0.347,-0.346 -0.893,-0.391 -1.291,-0.104l-4.843,3.481c-1.089,-0.602 -2.239,-1.08 -3.432,-1.427l-1.031,-5.886c-0.084,-0.478 -0.499,-0.828 -0.985,-0.828h-5.5c-0.49,0 -0.908,0.355 -0.987,0.839l-0.956,5.854c-1.2,0.345 -2.352,0.818 -3.437,1.412l-4.83,-3.45c-0.399,-0.285 -0.942,-0.239 -1.289,0.106l-3.887,3.887c-0.343,0.343 -0.391,0.883 -0.112,1.28l3.399,4.863c-0.605,1.095 -1.087,2.254 -1.438,3.46l-5.831,0.971c-0.482,0.08 -0.836,0.498 -0.836,0.986v5.5c0,0.485 0.348,0.9 0.825,0.985l5.831,1.034c0.349,1.203 0.831,2.362 1.438,3.46l-3.441,4.813c-0.284,0.397 -0.239,0.942 0.106,1.289l3.888,3.891c0.343,0.343 0.884,0.391 1.281,0.112l4.87,-3.411c1.093,0.601 2.248,1.078 3.445,1.424l0.976,5.861c0.079,0.481 0.496,0.834 0.985,0.834h5.5c0.485,0 0.9,-0.348 0.984,-0.825l1.045,-5.89c1.199,-0.353 2.348,-0.833 3.43,-1.435l4.905,3.441c0.398,0.281 0.938,0.232 1.282,-0.111l3.888,-3.891c0.346,-0.347 0.391,-0.894 0.104,-1.292l-3.498,-4.857c0.593,-1.08 1.064,-2.222 1.407,-3.408l5.918,-1.039c0.479,-0.084 0.827,-0.5 0.827,-0.985v-5.5c0.001,-0.49 -0.354,-0.908 -0.838,-0.987zM25,32c-3.866,0 -7,-3.134 -7,-7c0,-3.866 3.134,-7 7,-7c3.866,0 7,3.134 7,7c0,3.866 -3.134,7 -7,7z"></path></g></g></svg>
      </div>
      <img class="profile-pic-myprofile" @error="handlePfpError" :src="`/images/pfps/${myUsername}.png`" />
    </div>

    <div class="profile-navbar">
      <div class="name">
      <div class="username">{{this.myDisplayedName}}</div>
        <div class="at">{{'@'+this.myUsername}}</div>
      </div>
      <div class="bio">{{this.userBio}}</div>
    </div>
    <div class="contents">
      <div class="posts">

        <div class="add-post">
          <textarea v-model="postContent" class="posts-text-add" placeholder="Write a post..." maxlength="1000"></textarea>
          <div class="post-bottom-bar">
            <div class="publish-post" @click="publishPost">Publish</div>
          </div>
        </div>

        <div  v-if="posts.length === 0" class="no-posts">You have not published any posts yet.</div>



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
        <div class="empty-about-me" v-if="!connections.length && !platforms.length && !games.length && !country.length">Your About Me section is empty. Customize it in settings!</div>
        <div v-if="country.length" class="category-divider">Country</div>
        <div v-if="country.length" class="category-contents">
          <role-card
          v-for="countryRole in country"
          :country-code="countryRole"
          ></role-card>
        </div>
        <div v-if="connections.length" class="category-divider">Connections</div>
        <div v-if="connections.length" class="category-contents">
          <role-card
              v-for="connection in connections"
              :connection="connection.connection"
              :username="connection.username"
          ></role-card>
          </div>
        <div v-if="platforms.length" class="category-divider">Platforms</div>
        <div v-if="platforms.length" class="category-contents">
          <role-card
              v-for="platform in platforms"
              :role="platform"
          ></role-card>
        </div>
        <div v-if="games.length" class="category-divider">Games</div>
        <div v-if="games.length" class="category-contents-games">
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
import axios from 'axios';
import { store } from '../../store.js';
export default {
  components: {
    "singular-post": singularPost,
    "role-card": roleCard,
    "game-card": gameCard
  },
  data() {
    return {

      NAME: 'MyProfile',
      games: [],
      platforms: [],
      connections: [],
      country: [],


      postContent: undefined,

      backgroundColor: '',

      myDisplayedName: store.state.currentUser.displayedName,
      myUsername: store.state.currentUser.username,
      userBio: '',
      isDesktop: true,
      searchPhraseFriends: '',
      searchPhraseDashboard: '',
      searchPhraseChats: '',
      viewPostDetails: false,
      selectedPost: null,
      posts:[],
    }
  },

  methods: {

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

    async fetchBio() {
      try {
        if (!this.myUsername) {
          alert('Please provide a username');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/biography/${this.myUsername}`);

        this.userBio = response.data.bio;
        console.log('Biography fetched successfully:', this.userBio);
      } catch (error) {
        console.error('Error fetching biography:', error);
      }
    },

    handlePfpError(event) {
      event.target.src = '/images/pfps/default.png';
    },

    handleBackgroundError(event) {
      event.target.src = '/images/backgrounds/default.png';
    },


    addComment(newComment) {
      this.comments.push(newComment);
    },
    goToSettings(){
      console.error("do ustawien");
      this.$router.push({
        path: '/settings'
      });
    },

    async publishPost() {
      try {
        const post = {
          content: this.postContent,
          userId: this.myUsername,
          displayedName: this.myDisplayedName
        };

        const response = await axios.post('http://localhost:5000/api/posts', post);
        console.log('Post added:', response.data);

        const newPost = {
          postId: response.data.postId,
          content: this.postContent,
          userId: this.myUsername,
          displayedName: this.myDisplayedName,
          createdAt: response.data.createdAt,
          starCount: 0,
          likedBy: [],
          likedByUser: false
        };

        this.posts.unshift(newPost);

        this.postContent = '';
      } catch (error) {
        console.error('Error adding post:', error);
      }
    },


    async fetchGames() {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        this.games = response.data;
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    },

    async fetchBackgroundColor() {
      try {
        const response = await axios.get(`http://localhost:5000/api/background/${this.myUsername}`);

        this.backgroundColor = response.data.background;
        console.error(this.backgroundColor);
        console.log('Background color fetched successfully:', this.backgroundColor);
      } catch (error) {
        console.error('Error fetching background color:', error);
      }
    },


    init(){
      this.fetchBio();
      this.fetchBackgroundColor();
      this.fetchPosts(this.myUsername);
      this.fetchAboutMe(this.myUsername);
    }
  },

  mounted(){
    this.init();
  },



}
</script>

<style scoped>

.no-posts{
  background-color: rgba(147, 112, 219, 0.3);
  font-family: system-ui;
  text-align: center;
  padding: 1vmin;
  border-radius: 2vmin;
  margin-top: 2vmin;
  color: rebeccapurple;
}

.settings-icon{
  width: fit-content;
  height: fit-content;
  display: flex;
  position: absolute;
  top: 2vmin;
  right: 2vmin;
  cursor: pointer;
}

.publish-post{
  margin-left: auto;
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
  margin-top: 1vmin
}

.post-bottom-bar{
  display: flex;
  padding-top: 1vmin;
  padding-left: 1vmin;
  padding-right: 1vmin;
  margin-bottom: 2vmin;
}

.posts-text-add{
  font-size: large;
  padding: 1vmin;
  padding-top: 1.5vmin;
  width: 95%;
  margin: 0 auto;
  font-family: system-ui;
  border: 1px solid grey;
  border-radius: 2vmin;
  display: flex;
  outline: none;
  resize: none;
  box-shadow: 0 0 10px rebeccapurple;
  overflow: hidden;

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


.empty-about-me{
  text-align: center;
  margin: 2vmin;
  color: rebeccapurple;
  font-family: system-ui;
}

.background-profile {
  width: 100%;
  height: 250px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

.background-image{
  width: 100%;
  position: absolute;
  height: -webkit-fill-available;
  background-color: rebeccapurple;
}

.profile-pic-myprofile{
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


.about-me{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 35%;
  margin-left: auto;
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
  width: 80%;
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

.category-contents{
  display: flex;
  margin: 1vmin;
  flex-wrap: wrap;
}


.category-contents-games{
  display: flex;
  margin: 1vmin;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 450px;
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


</style>
