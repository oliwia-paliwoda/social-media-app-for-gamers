<template>
  <div class="main-container" v-if="isDesktop">
<div class="main-border">

  <div class="friendlist">
    <div class="my-profile">
      <img class="profile-pic-sidebar" @error="handlePfpError" :src="pfpSrc" @click="goToMyProfile"/>
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div class="profile-username" @click="goToMyProfile">{{myDisplayedName}}</div>
        <div class="log-out" @click="logOut">Log out</div>
      </div>
      <div class="notification-icon" @click="goToNotifications" >
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64" height="64" viewBox="0,0,256,256">
          <g fill="#9874dc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M64,256c-35.34622,0 -64,-28.65378 -64,-64v-128c0,-35.34622 28.65378,-64 64,-64h128c35.34622,0 64,28.65378 64,64v128c0,35.34622 -28.65378,64 -64,64z" id="shape"></path></g><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(3.55556,3.55556)"><path d="M28.802,58h14.396c-1.504,2.398 -4.165,4 -7.198,4c-3.033,0 -5.693,-1.602 -7.198,-4zM58.328,39.781c0.274,0.41 2.672,4.182 2.672,10.219c0,2.209 -1.791,4 -4,4h-42c-2.209,0 -4,-1.791 -4,-4c0,-6.037 2.398,-9.809 2.672,-10.219c0.414,-0.621 0.975,-1.158 1.672,-1.422c3.459,-1.314 3.764,-8.46 3.98,-10.517c0.607,-5.776 3.732,-11.143 10.801,-13.383c1.155,-1.934 3.142,-3.459 5.875,-3.459c2.738,0 4.728,1.531 5.882,3.471c4.343,1.198 10.329,5.748 10.794,13.371c0.151,2.483 0.665,9.081 3.98,10.517c0.699,0.303 1.258,0.801 1.672,1.422z"></path></g></g>
        </svg>
        <span v-if="hasUnseenNotifications" class="notification-badge"></span>
      </div>
    </div>
    <div class="friends">
      <div class="friend-search" @click="goToFriendsSearch">Friends search</div>
      <div class="empty-friend-list" v-if="!friends.length">Try looking for some friends in Friends Search!</div>
      <div v-if="friends.length" class="search-bar-small">
        <input v-model="searchPhraseFriends" class="search-bar-input" placeholder="Search..." maxlength="20" />

      </div>
      <div v-if="friends.length" class="friend-list">
        <friend-component
            v-for="friend in filteredFriends"
            :key="friend.username"
            :username="friend.username"
            :displayed-name="friend.displayedName"
        ></friend-component>
      </div>
    </div>
  </div>

  <div class="dashboard">
    <div class="search-bar">
      <input  @keyup.enter="filterPosts" v-model="searchPhraseDashboard" class="search-bar-input" placeholder="Search..." maxlength="20" />
      <div class="magni-glass-icon" @click="filterPosts">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#9874dc" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
      </div>
    </div>

      <div class="add-post">
        <div class="publisher-details">
          <img @error="handlePfpError" class="profile-pic-miniature" :src="pfpSrc" @click="goToMyProfile"></img>
          <div class="publisher-name">
            <div class="publisher-username" @click="goToMyProfile">{{this.myDisplayedName}}</div>
            <div class="publisher-at" @click="goToMyProfile">{{'@'+this.myUsername}}</div>
          </div>
        </div>
        <textarea v-model="postContent" class="posts-text-add" placeholder="Write a post..." maxlength="1000"></textarea>
        <div class="post-bottom-bar">
          <div class="publish-post" @click="publishPost">Publish</div>
        </div>
    </div>
    <div class="posts">
      <singular-post
          v-for="post in filteredPosts"
          :key="post.postId"
          :postContent="post.content"
          :displayed-name="post.displayedName"
          :username="'@' + post.userId"
          :like-count="post.starCount"
          :comment-count="post.commentCount"
          :post-id="post.postId"
          :liked-by-user="post.likedByUser"
          @toggle-like="handleToggleLike(post.postId)"
          @read-more="showPostDetails(post)"
          @delete-post="deletePost"
      />

    </div>
    <!--<post-read-more v-if="viewPostDetails" :postDetails="selectedPost" :comments="getCommentsForPost(selectedPost.postId)" @back-to-posts="goBackToPosts" />-->
  </div>




    </div>
  </div>
</template>

<script>

import singularPost from "../components/singularPost.vue";
import FriendComponent from "../components/FriendComponent.vue";
import myProfile from "./MyProfile.vue";
import axios from 'axios';
import { store } from '../../store.js';
import {filterOptions} from "mongodb/lib/utils";
export default {

  computed:{

    pfpSrc() {
      return `/images/pfps/${this.myUsername}.png`;
    },

    filteredFriends() {
      if (this.searchPhraseFriends.trim() === '') {
        return this.friends;
      }
      return this.friends.filter(friend => {
        return friend.username.toLowerCase().startsWith(this.searchPhraseFriends.toLowerCase());
      });
    }
  },

  components: {
    'singular-post': singularPost,
    'friend-component': FriendComponent
  },
  data() {
    return {

      movies: [],
      postContent: '',


      filteredPosts: [],
      hasUnseenNotifications: false,
      myDisplayedName: store.state.currentUser.displayedName,
      myUsername: store.state.currentUser.username,
      isDesktop: true,
      searchPhraseFriends: '',
      searchPhraseDashboard: '',
      searchPhraseChats: '',
      viewPostDetails: false,
      selectedPost: null,

      friends: [],
      posts: [],

      comments: [
        {
          commentId: 1,
          postId:1,
          postContent: "cool post.",
          username: "john_doe",
          userId: '34763436437',

        },
        {
          commentId: 2,
          postId:2,
          postContent: "slay",
          username: "ssss",
          userId: 'sssss',

        },
        {commentId: 3,
          postId:1,
          postContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          username: "ssss",
          userId: 'sssss',}
      ],
    };
  },
  methods: {

    logOut(){
      store.state.currentUser.displayedName='';
      store.clearUser();
      this.$router.push({
        path: '/'
      });

    },

    async deletePost(postId) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`);

        this.posts = this.posts.filter(post => post.postId !== postId);

        this.filteredPosts = [...this.posts];

        console.log(`Post with ID ${postId} deleted successfully.`);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    },

    handlePfpError(event) {
      event.target.src = '/images/pfps/default.png';
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

    async fetchFriendsPosts() {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/friends/${this.myUsername}`);
        const fetchedPosts = response.data
            .map(post => ({
              ...post,
              likedByUser: post.likedBy && post.likedBy.includes(this.myUsername) || false
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        fetchedPosts.forEach(fetchedPost => {
          if (!this.posts.some(post => post.postId === fetchedPost.postId)) {
            this.posts.push(fetchedPost);
          }
        });

        this.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        this.filteredPosts = [...this.posts];
        console.error(this.filteredPosts);
      } catch (error) {
        console.error('Error fetching posts from friends:', error);
      }
    },



    async fetchFriends() {
      try {
        const response = await axios.get(`http://localhost:5000/api/friends/${this.myUsername}`);
        this.friends = response.data;
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },

    goToNotifications(){
      this.$router.push({
        path: '/notifications'
      });
    },


    async checkUnseenNotifications(){
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications/unseen/${this.myUsername}`);
        this.hasUnseenNotifications = response.data.hasUnseen;
      } catch (error) {
        console.error('Error checking unseen notifications:', error);
        throw error;
      }
    },

    init(){
       this.fetchFriends();
       this.fetchFriendsPosts();
       this.checkUnseenNotifications();
    },

    filterPosts() {
      console.error(this.posts);
      if (this.searchPhraseDashboard.trim() === '') {
        this.filteredPosts = this.posts;
      } else {
        this.filteredPosts = this.posts.filter(post =>
            post.content.toLowerCase().includes(this.searchPhraseDashboard.toLowerCase())
        );
      }
    },

    updateLayout() {
      this.isDesktop = window.innerWidth > 768;
    },

    showPostDetails(post) {
      this.selectedPost = post;
      this.viewPostDetails = true;
    },
    goToMyProfile(){
      this.$router.push({
        path: '/profile/my'
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
        this.filteredPosts = [...this.posts];


        this.postContent = '';
      } catch (error) {
        console.error('Error adding post:', error);
      }
    },



    goToFriendsSearch(){
      console.error("do szukania friendsow");
      this.$router.push({
        path: '/friends-search'
      });

    }
  },
  mounted() {

    this.updateLayout();
    window.addEventListener('resize', this.updateLayout);
    this.init();
    this.filteredPosts = this.posts;

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateLayout);
  }
};
</script>

<style scoped>

.empty-friend-list{
  text-align: center;
  color: rebeccapurple;
  font-family: system-ui;
  width:18vmin;
}

.log-out{
  font-size: small;
  font-family: system-ui;
  color: mediumpurple;
  cursor: pointer;
}
.log-out:hover {
  color: rebeccapurple;
}

.notification-badge{
  top: -10%;
  left: 65%;
  width: 10px;
  height: 10px;
  border-radius: 6px;
  position: absolute;
  background-color: red;
}



.notification-icon {
  position: absolute;
  left: 32%;
  top: 5%;
  color: white;
  border-radius: 50%;
  width: 2.5vmin;
  height: 2.5vmin;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.profile-pic-sidebar{
width: 7vmin;
aspect-ratio: 1 / 1;
margin: 1vmin;
border: 1px solid grey;
border-radius: 2vmin;
background-color: rebeccapurple;
}

.desktop-view {
display: block;
}
.mobile-view {
display: none;
}

@media (max-width: 768px) {
.desktop-view {
  display: none;
}
.mobile-view {
  display: block;
}
}

.chatlist-list{
padding-bottom: 3vmin;
height: 26vmin;
overflow-y: scroll;
margin-bottom: 2vmin;
}

.main-border{
border-left: 1px solid grey;
border-right: 1px solid grey;
//width: 80%;
height: 100%;
background: white;
display:flex;
  box-shadow: 0 0 10px rebeccapurple;
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
display:block;
width:100%;
height: 100%;
}

.background{
height: 30%;
border-bottom: 1px solid grey;
background-color: purple;
}

.profile-navbar{
height: 20%;
border-bottom: 1px solid grey;
}

.contents{
height: 45%;
display: flex;
padding-left: 10vmin;
padding-right: 10vmin;
padding-top: 5vmin;
overflow-y: scroll;
}

.profile-pic{
border: 1px solid grey;
width: 25vmin;
height: 25vmin;
position: relative;
left: 10vmin;
top: 10vmin;
background-color: rebeccapurple;
border-radius: 1vmin;
}

.username{
margin-right: 1vmin;
}

.bio{
position: relative;
width: 80%;
left: 10vmin;
top: 7vmin;
font-family: system-ui;

}

.singular-post{
border: 1px solid mediumpurple;
border-radius: 2vmin;
width: 95%;
margin: 0 auto;
margin-bottom: 2vmin;
margin-top: 2vmin;
display: block;
}

.posts{

}


.about-me{
border: 1px solid grey;
border-radius: 2vmin;
width: 35%;
margin-left: auto;
display: block;
}

.about-me-title{
font-family: system-ui;
font-weight: 600;
font-size: x-large;
padding: 1vmin;
}

.category-divider{
font-family: system-ui;
color: mediumpurple;
border-bottom: 1px solid grey;
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
overflow: hidden;

}

.star-icon{
width: 3vmin;
height: 3vmin;
stroke:mediumpurple;
margin-right: 0.5vmin;
}

.friend-list{
  padding-bottom: 3vmin;
  overflow-y: auto;
  height: 75%;
  width: 100%;
}
.post-bottom-bar{
display: flex;
padding-top: 1vmin;
padding-left: 1vmin;
padding-right: 1vmin;
margin-bottom: 2vmin;
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
margin-top: 1vmin;
}

.name{
display:flex;
font-weight: bold;
font-family: system-ui;
position: relative;
left: 10vmin;
top: 7vmin;
font-size: xx-large;
width: 80%;
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
  display: block;
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

.dashboard{
  border: 1px solid grey;
  width: 100vh;
  height: 100%;
  overflow-y: scroll;
}

.search-bar{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  height: 4vmin;
  width: 95%;
  margin: 0 auto;
  margin-top: 2vmin;
  color: mediumpurple;
  font-family: system-ui;
  display: flex;
  box-shadow: 0 0 10px rebeccapurple;

}


.search-bar-small{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 90%;
  margin: 0 auto;
  color: mediumpurple;
  font-family: system-ui;
  display: flex;
  margin-bottom: 2vmin;

}


.search-bar-input{
  color: mediumpurple;
  font-family: system-ui;
  border: 0;
  height: 85%;
  align-self: center;
  margin-left: 1vmin;
  outline: none;
  width:85%

}

.add-post{
  border: 1px solid mediumpurple;
  border-radius: 2vmin;
  height: 20vmin;
  width: 95%;
  margin: 0 auto;
  margin-bottom: 5vmin;
  margin-top: 2vmin;
  display: table;
  box-shadow: 0 0 10px rebeccapurple;
}

.friendlist{
  border: 1px solid mediumpurple;
  width: 20%;
  height: 100%
}

.chats{
  width: 25%;
}

.my-profile{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  position: relative;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1vmin;
  margin-top: 2vmin;
  display: flex;
  box-shadow: 0 0 10px rebeccapurple;
}

.friends{
  border-radius: 2vmin;
  border: 2px solid mediumpurple;
  width: 90%;
  margin: 0 auto;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 75vmin;
  box-shadow: 0 0 10px rebeccapurple;
}

.friend{
  display: flex;
  align-items: center;
}

.profile-pic-miniature-friend{
  width: 3vmin;
  height: 3vmin;
  margin: 1vmin;
  border: 1px solid grey;
  border-radius: 1vmin;
  background-color: rebeccapurple;
}

.friend-name{
  font-weight: bold;
  font-family: system-ui;
  font-size: 1.5vmin;
  padding-right: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-search{
  background-color: mediumpurple;
  border-radius: 1vmin;
  margin: 0 auto;
  text-align: center;
  font-family: system-ui;
  color: white;
  font-weight: 500;
  width: 90%;
  margin-top: 2vmin;
  margin-bottom: 2vmin;
  cursor: pointer;
}

.friend-search:hover{
  background-color: rebeccapurple;
}

.profile-username {
  font-weight: bold;
  font-family: system-ui;
  align-self: center;
  font-size: 1.5vmin;
  width: -webkit-fill-available;
  max-width: 92px;
  margin-right: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}


.profile-at{
  font-family: system-ui;
  color: grey;
}

.chatlist{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1vmin;
  margin-top: 2vmin;
}

.chatlist-title{
  font-family: system-ui;
  color: mediumpurple;
  margin-top: 1vmin;
  text-align: center;
  font-weight: 700;
  font-size: larger;
}

.active-chat{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 90%;
  height: 52vmin;
  margin: 0 auto;
  align-self: end;
  margin-bottom: 2vmin;
}

.message-one{
  background-color: mediumpurple;
  border-radius: 1vmin;
  width: 11vmin;
  height: 3vmin;
  margin-bottom: 2vmin;
  margin-top: 33vmin;
  margin-left: 1vmin;
}

.message-two{
  background-color: rebeccapurple;
  border-radius: 1vmin;
  width: 15vmin;
  height: 3vmin;
  margin-left: 20vmin;
  margin-bottom: 1vmin;
}

.type-bar{
  border-radius: 1vmin;
  border: 2px solid mediumpurple;
  width: 95%;
  height: 3vmin;
  margin: 0 auto;
}

.magni-glass-icon{
  width: 3vh;
  display: flex;
  padding-right: 2vmin;
  margin-left: auto;
}

.magni-glass-icon-small{
  width: 2vh;
  display: flex;
  padding-right: 2vmin;
  margin-left: auto;
}



</style>
