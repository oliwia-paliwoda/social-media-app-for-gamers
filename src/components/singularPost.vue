<template>
  <div class="singular-post"  @mouseenter="hoveredPostId=postId" @mouseleave="hoveredPostId=null">
    <div class="publisher-details">
      <img class="profile-pic-miniature"  @error="handleImageError"  :src="username.startsWith('@') ? `/images/pfps/${username.slice(1)}.png` : `/images/pfps/${username}.png`"  @click="goToUserProfile(username)"/>
      <div class="publisher-name">
        <div class="publisher-username" @click="goToUserProfile(username)">{{displayedName}}</div>
        <div class="publisher-at" @click="goToUserProfile(username)">{{username}}</div>
      </div>
      <div class="delete-post" v-if="!questionBoxVisible && (username.startsWith('@') ? username.slice(1) : username) === myUsername && hoveredPostId === postId">
        <svg @click="showQuestionBox()" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
          <g fill="#9874dc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M28,3c-2.209,0 -4,1.791 -4,4v2h-0.40039l-16.59961,2v3h50v-3l-16.59961,-2h-0.40039v-2c0,-2.209 -1.791,-4 -4,-4zM28,7h8v2h-8zM10,16l4,42h36l3.92383,-41zM32,23c1.333,0 2,1 2,1v29h-4v-29c0,0 0.667,-1 2,-1zM18.97656,23.07031c1.33,-0.093 2.06641,0.85938 2.06641,0.85938l1.96484,29.07031h-4.01172l-1.94336,-28.79297c0,0 0.59383,-1.04372 1.92383,-1.13672zM44.97852,23.07031c1.33,0.093 1.92578,1.13672 1.92578,1.13672l-1.94336,28.79297h-4.01172l1.96484,-29.07031c0,0 0.73445,-0.95238 2.06445,-0.85938z"></path></g></g>
        </svg>
      </div>
      <div v-if="questionBoxVisible" class="question-box">
        <div class="question-text">Delete post?</div>
        <div class="buttons">
          <div @click="removePost" class="button-yes-no">Yes</div>
          <div @click="dontRemovePost" class="button-yes-no">No</div>
        </div>
      </div>
    </div>
    <div class="posts-text">{{ isExpanded ? postContent : postContent.slice(0, 100) }}<span v-if="!isExpanded && postContent.length > 100" class="ellipsis" @click="toggleExpand"> ...</span></div>
    <div class="post-bottom-bar">
      <div class="star-icon" @click="toggleLike">
        <img style="width: 3.8vmin; height: 3.8vmin; margin-right: 1vmin; margin-top: 0.8vmin;" :src="likedByUser ? likedIconStar : defaultIconStar">
      </div>
      <div class="star-count">{{ likeCount}}</div>
      <div class="comment-icon"  @click="toggleComments">
        <img style="width: 3.8vmin; height: 3.7vmin; margin-top: 0.8vmin;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE0ElEQVR4nO1Za2hcVRA+PqvY1gf6xydSq5YqqAj6Q6r4S/GHpFIbK/hPqdVQd2du0iqy6C+VVl2b7Jy7phZURFPFQq3Wt4Jo1ahV0yR7Z26D8VEVEav1Tbsyd8+ma7LbJJvdmxvIBxeSnfOYc8/M3JlvjJnFLGYRC7rSfAYB30jIDxHyCwTymUUJLfIPpUf/lk9VZoEf9D1elm8PTjdJQGeKzyHg+y3ylxalWO0h4F/0qSlH/sIi36drmbhhobDEomy3wPudMgcsSi8BP5IDac2lg4s3rR46YfQ8/c33+BJKy00W+VG9oZFDAe8nkFf8dHhFPDeA/HLFG2VCRr8jPLPuNWH3WRbEIxCpuKWXfAwWNFZ7Y0zRFA+zyGmL/IfbbBehtOjvjdojkykensPwBgvS70zyd0rL6obt0bmqb64Ffr68uB6oZ1nxCNMkZDJvH6k3VPHSNqsOU1r08dTwSRb4w/It5Lzd55mY0NVeWETIAyVTkx25NV+dWNdC2bZgvguhRYv8Wrc3MM/EjG5vYB4hv1GyBvlk0jqo6WgEKTteti2YY6YJmzJDx5R1scDbJmXWPsq9zpx6n4Sdx5lpRueqvrll6yDgtROalMfCRYTyj0XZm4fBs01C4GOwgEB+JZC//VR44bgTRmwS+VaTMPgY3l722UMOJOCrnC1+3swQWy96Sr7bV9KxsKTmwCih00EeLzcJhY/hCue/z1Uf0BEeH/kG8B7/tt6jTELRk+k7WrNp9ZWq4VjT6tKVSd4kHBZ4o9N16VghysMq1AOZhMN6vNx98deNERLw6yrMp8NzTcLhp4fOd1/7V8cIy3nNRPzDh/A6i/INgXztg1wb17j/+0lkWv1mNAj5O0LZZyYA3bCiJhmOa1wlojQf5FszGvpGNHU2M/8gHNXdmqSNt4hev9t82CJfE9e4iZmWc3byZKFJOLraC4sO5ewPRM6O4QqTcORAWmuHX5QWJ/RNwkHITzhdW8YIte6wKL9ZkJ/UBk1CkW0L5hDIjxblr5oVo0V+Wk+qV2cSCkqHNzv/eLbmoIg8U7INpD+JaXxGGRaUXZEvj0fkEcqLrni5wyQMBHyn+9ZsH3ewlrfqK/rBSVLeRZ4s1MxD0/d8Oy+e0CQLstLZYV81DjduZNuC+Vq1uo9gx6QmW5RuF+LenU4mZX1q+Fit0V0JvlWp1UktoFnwQW5LdvjpwZNNzMiWSMK3HA30cd3UaRSzXR2vbLkPhctMTMi382ILPOic+4Mpm3jEXKCsc2H5X0K+xzQ5xPoYriHgP8skw5RJ7EoQ8vWO7/reNAFRWwGklZALzpz3abht+EYbvIFTncO918h1NdzrDVjgoYPdK9nSNJazzCcRcraa3Kb5bgJZT8i3KO2qbYDRTZqoTeHJpZpmEMhjFnlnZevNAm/NpYLLm3KAEUWBt7k87OrRNq2Hq9XsjBJRlL21m6UROZ2JhWemVOE0dXS9/so4ro0fAnnHvdE92uSMzAT5GY00mrNpOap+pe1pQv5IO1BR7QOyVM3VxAmLssHZ7kr9f+Pa4BTlwRxrH5WccXaz6kIO5AJVWKNI1BAF2aL5ToVpPNXQ8NhE9vv9Kk3+Axb5Td8LrjQzARa5zQL/rAyHc8rNFuWumUBQzMJMM/4DDq6rwRrMU54AAAAASUVORK5CYII=">
      </div>
      <div class="comment-count">{{localCommentCount}}</div>
      <!--<div class="read-more"  @click="$emit('read-more')">Read more</div>-->
      <div v-if="postContent.length>100" class="read-more" @click="toggleExpand">
        {{ isExpanded ? 'Show less' : 'Read more' }}
      </div>
      <div v-else class="read-more-hidden"></div>
    </div>

    <div class="comments-box" v-if="showComments">
      <div class="comment-scrollable">
      <div v-for="comment in comments" :key="comment.commentId" @mouseenter="hoveredCommentId = comment.commentId" @mouseleave="hoveredCommentId=null" class="comment-container">
      <div class="commenter-tab">
        <img class="commenter-profile-pic" :src="comment.username.startsWith('@') ? `/images/pfps/${comment.username.slice(1)}.png` : `/images/pfps/${comment.username}.png`" @error="handleImageError" @click="goToUserProfile(comment.username)"/>
        <div class="commenter-info">
          <div class="commenter-username"  @click="goToUserProfile(comment.userId)">{{ comment.displayedName }}</div>
          <div class="commenter-id"  @click="goToUserProfile(comment.userId)">@{{ comment.username }}</div>
        </div>
        <div class="date">{{formatDateTime(comment.createdAt)}}</div>
        <div class="remove-post" v-if="comment.username===myUsername && hoveredCommentId === comment.commentId">
          <svg @click="deleteComment(comment.commentId)" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0,0,256,256">
            <g fill="#9874dc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M28,3c-2.209,0 -4,1.791 -4,4v2h-0.40039l-16.59961,2v3h50v-3l-16.59961,-2h-0.40039v-2c0,-2.209 -1.791,-4 -4,-4zM28,7h8v2h-8zM10,16l4,42h36l3.92383,-41zM32,23c1.333,0 2,1 2,1v29h-4v-29c0,0 0.667,-1 2,-1zM18.97656,23.07031c1.33,-0.093 2.06641,0.85938 2.06641,0.85938l1.96484,29.07031h-4.01172l-1.94336,-28.79297c0,0 0.59383,-1.04372 1.92383,-1.13672zM44.97852,23.07031c1.33,0.093 1.92578,1.13672 1.92578,1.13672l-1.94336,28.79297h-4.01172l1.96484,-29.07031c0,0 0.73445,-0.95238 2.06445,-0.85938z"></path></g></g>
          </svg>
        </div>
      </div>
      <div class="comment-content">{{ comment.content }}</div>
    </div>
      </div>
      <input @keyup.enter="publishComment" v-model="newCommentContent" placeholder="Add comment..." class="add-comment-bar"/>
      </div>

  </div>
</template>
<script>

import axios from "axios";
import { store } from '../../store.js';
export default {
  data() {
    return {


      comments: [],
      hoveredCommentId: null,
      hoveredPostId: null,
      newCommentContent: '',
      isExpanded: false,
      showComments: false,
      myDisplayedName:  store.state.currentUser.displayedName,
      myUsername:  store.state.currentUser.username,
      localCommentCount: this.commentCount || 0,
      questionBoxVisible: false,

      defaultIconStar: "data:image/png;base64,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",
      likedIconStar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAZzSURBVHhe7ZpfbBRFGMBnZu+w9AoUWmoJ+If2tuWBEBNRm4IEY4K+aYx/ohKNUdsrJSJtkfjCCY/Qu8Qg0EMJhhgf0AfQEHxU1IiBgCE+QLlS/ikNpYByV/5cdz6/2ZsDjjuut7PdXdvcr7nOzLd7M9/37ffNzuwtKVGiRIkSJbxha2e8Rnxk0xOoLF0jHAY2Kxn/EIfuwOZsIeOcnKeURwcq9E/Xr6dcyNyCydIVgAB9MNH3NRofweZsIkzFDyoxh1IWRcd8Jc4xT3YJVx0Q6zr5JqPktYzhWXAyhI55XZwjJa7gmgPMK8vJuhzD71Bl/sdz3IwC1xywvbPveRxOl838COcwpse64s+lBc7jmgM4hXZZHRUgZKWsOo4rodbT1VuPV7dXXF4pKghnHHxcm9cSrcfvOIsrEcCBrSjWeAEjjBoMWmTTURyPgFj4r3IjOXyOcTpDikYHXQWEXw3A8Jy3Io8lpdQRHI8ASFxfbsl4AU6GlLDKJA28ISWO4XwKAC968svCdAJ84PQt0VEH9HSeWIKpv0A2rcPZ/Fhn79Oy5QjORgDV2s17uypCO9GHgzgWXrGO/nkGM44xTvxSZBnOSEqUGtcWtEbnHjeFY8yYO0Ds9moT8SWU0h149eukWB2MAtwt9mkaf/fvcv3nsd4tFuUAYdScK6dmpvwwE5s1uKGpBU5mEgbV2EUtdlKDSprHUN1ZjLFyW6F/LzJROefD2LiA1Yu4qhjEFeNFnGUHcJ6sopT8woEMiGP+FB08P71usBhn3dcBu18BbejheBtQircx8jgq4TONyswama5FO1/dLe7V5y4whRIUYH/V2eDyV7+ht6Q4i7wO2B3+c9LQtbLvKSPLXDdorEEHAZBLAZJ4NN+iKuO/LC4nytZNCOMFaAOmR3WSBH6QkixyIiDWcthvVEwdxPX4NCka9+DmioAB4Eteq2jdvhDnkTvkRACfMlXHSWzCGC9gwG5pmkZhytRnpeg2OQ4A5jNkdeKAa2pR4CY7ZyLMcUDqxshpzJsh2ZwoPIDWQyo18pts3ybHAas2N9zEmNmSf3ocfxjUSE/ljBxA2/4163eR18wZZ4IbcBe2byI4QaMaQ1suok3LpCiLvCbiosGoCtx8CTNnlxSNT9A6jPzTFQHQLS2EMoi9eE9nPEyBhqVofCAMxz9K6O+h7mAzlvdd0RQMcvwitEX0T4DB29jDrXGREsJ4VFYj2s62br2pkPGCghFwN9u64ovwXrIH1xS4AfqfgsYbuPDVcC4PdeubpbQgRTtAsG1NXMdJdR+OVPgHDi9A44HzFFD2wopIcL+UjoolBwg+6+qv1UjqO8rZE1LkPcJ4wpOcaM3t3fXHpLQoLGf1yu65AywQWIrVvWmJxwgLONmLOtVYNV5gOQIymM8LHun7Fjt4Uey4vAIY2VN1pv5lceuWIktYjoAMYkDGtY+9NF6gcbpW1XiBsgME06ckT8mqZ0DiSr+sKmHLAUOJSUF7PdiHVk5rkFUlbKlPCVvsaQqg9tygi2RLCbvXz9bgtkk730MHULLY6xQwdbCBsvpiQYRFnZcpgBuef7Co27b6hPm6nQrKDvDTEUd/tCyGzINb5mPNpkABZQcAYO55vAbIYOqiiI0MprZyb2xR10VpKbyr84/AMFRcxaovLfGckZEbN6av3Do/IdtFoxQBaHwTFsrGY+akH67YiL8sGPH5ysqeki1LKKkA1Ma91zSca0DIF5TypUDhGZR8zhk3lB0i5iKmdjtUGxKg0fI3TcPN2kFG6ZNt3cH3Wzc1/NQW0X8MRYMtaIR4vnBQUSMCHJSWxErDUUIDsjoq5lseOApepEsA/L0LgfpFoU36EXn4NiuiDUfFMXEOfueSFBcH9k8JTJYtSyg5AFPgSFG3QOydca5hxMT8xqTGtkjDjkIvLYhj4hxxLmfQI8XFwdhRWbOE0l1gS8fJh9Djx3EhUi5F2Ui3AuGHGGjtrZH6Q2mJNXrWxBdiRGwt9PhNvFaLF+O6z0caWzY2nJfiolGKgPaofo4x0mpOXPeCPXICl3GSCw0E9CZV4wWhTcHDog9gJCRF2Rqn65wSrUXFeIHyIzGBeA8QiLYBU6IZdfHjimyQUPgS/bKxNTrPWh6PQqzjeDVn2kdA6Ds4VjXmUQrLXwkY4VCk8YA8zRsiq89Ojq3tc+2dgp2r+it3hvvLZLNEiRIlFCHkP8EcInUT29+7AAAAAElFTkSuQmCC",
    }

  },

  watch: {
    commentCount(newCount) {
      this.localCommentCount = newCount;
    },
  },


  props: {
    postId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    displayedName: {
      type: String,
      required: true,
    },
    postContent: {
      type: String,
      required: true
    },
    likeCount: {
      type: Number,
      required: true
    },
    commentCount: {
      type: Number,
    },
    likedByUser: {
      type: Boolean,
    },
  },

  methods: {

    removePost(){
      this.$emit('delete-post', this.postId);
    },

    dontRemovePost(){
      this.questionBoxVisible=false;
    },

    showQuestionBox(){
      this.questionBoxVisible=true;
    },

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


    async deleteComment(commentId) {
      try {
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`);

        this.comments = this.comments.filter(comment => comment.commentId !== commentId);

        this.localCommentCount -= 1;

        console.log(`Comment with ID ${commentId} deleted successfully.`);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    },

    async fetchComments() {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${this.postId}`);
        this.comments = response.data;
        console.log('Fetched comments:', this.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },

    async publishComment() {
      if (this.newCommentContent.trim() === '') {
        return;
      }

      const newComment = {
        commentId: Date.now(),
        postId: this.postId,
        username: this.myUsername,
        content: this.newCommentContent,
        createdAt: Date.now(),
      };

      try {
        const response = await axios.post('http://localhost:5000/api/comments', newComment);
        console.log('Comment published:', response.data);

        const newLocalComment = {
          ...newComment,
          displayedName: this.myDisplayedName
        }
        this.localCommentCount += 1;
        this.comments.push(newLocalComment);
        console.error("wszystkie komy po spushowaniu:", this.comments);
        console.error("do bazy:", newComment);
        console.error("lokalnie:", newLocalComment);
        this.newCommentContent = '';
      } catch (error) {
        console.error('Error publishing comment:', error);
      }
    },

    toggleComments() {
      this.showComments = !this.showComments;

      if (this.showComments) {
        this.fetchComments();
      }
    },


    handleImageError(event) {
      event.target.src = '/images/pfps/default.png';
    },

    goToPost() {
      console.error("idz do posta", this.postId);
    },

    goToUserProfile(userId) {
      console.error("argument:", userId);
      console.error("moj userid", this.myUserId);
      userId = userId.replace(/^@/, '');
      if (userId !== this.myUserId) {
        this.$router.push({
          path: `/profile/${userId}`
        });
      } else {
        this.$router.push({
          path: `/profile/my`
        });
      }
    },

    toggleLike() {
      this.$emit('toggle-like', this.postId);
    },

    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      console.error("lenght", this.postContent.length);
      console.error("content:", this.postContent);

    }
  },

};
</script>

<style scoped>

.buttons{
  display: flex;
  justify-content: flex-end;
  gap: 2vmin;
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

.question-box{
border-radius: 1vmin;
display: flex;
align-items: center;
width: 200px;
position: relative;
height: 60px;
left: 45vmin;
margin-top: 2vmin;
background-color: rgba(147, 112, 219, 0.3);
}

.comment-scrollable{
overflow-y: auto;
max-height: 50vh;
background: lavender;
}
.comments-box{

}

.add-comment-bar{
font-size: small;
padding: 1vmin;
padding-top: 1.5vmin;
width: 95%;
margin: 0 auto;
margin-top: 1.5vmin;
margin-bottom: 1.5vmin;
font-family: system-ui;
border: 1px solid grey;
border-radius: 2vmin;
display: flex;
outline: none;
resize: none;
overflow: hidden;
}

.comment-content{
padding: 0 1vmin 1vmin 1vmin;
font-family: system-ui;
max-width: 95vmin;
}

.commenter-tab{
display: flex;
align-items: center;
height: 75%;
}

.commenter-info{
display: flex;
}

.commenter-id{
color: mediumpurple;
font-family: system-ui;
font-size: 1.5vmin;
}

.commenter-profile-pic{
width: 3vmin;
height: 3vmin;
margin: 1vmin;
border: 1px solid grey;
border-radius: 1vmin;
background-color: rebeccapurple;
}

.commenter-username{
font-weight: bold;
font-family: system-ui;
font-size: 1.5vmin;
padding-right: 0.5vmin;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.comment-divider{
width: 95%;
margin: inherit;
border-top: 1px solid mediumpurple;
}

.comment-container {
width: 100%;
margin-bottom: 1vmin;
display: block;
}

.profile-pic-sidebar{
width: 7vmin;
aspect-ratio: 1 / 1;
margin: 1vmin;
border: 1px solid grey;
border-radius: 2vmin;
background-color: rebeccapurple;
}

.posts-text .ellipsis {
color: mediumpurple;
  font-weight: bold;
  cursor: pointer;
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
}

.main-border{
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  width: 80%;
  height: 100%;
  background: white;
  display:flex;
}

.main-container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
  box-shadow: 0 0 10px rebeccapurple;
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
}

.posts-text{
  font-size: large;
  padding: 1.5vmin;
  font-family: system-ui;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  max-width: 95vmin;
}

.posts-text-add{
  font-size: large;
  padding: 1vmin;
  width: 95%;
  margin: 0 auto;
  font-family: system-ui;
  border: 1px solid grey;
  border-radius: 2vmin;
}

.star-icon{
  width: 3vmin;
  height: 3vmin;
  stroke:mediumpurple;
  margin-right: 0.5vmin;
}

.friend-list{
  padding-bottom: 3vmin;
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

.read-more{
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

.read-more-hidden{
  margin-left: auto;
  font-family: system-ui;
  background-color: transparent;
  border-radius: 2vmin;
  color: transparent;
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
  width: 60%;
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

}

.add-post{
  border: 1px solid mediumpurple;
  border-radius: 2vmin;
  height: 20vmin;
  width: 95%;
  margin: 0 auto;
  margin-bottom: 2vmin;
  margin-top: 2vmin;
  display: block;
}

.friendlist{
  border: 1px solid mediumpurple;
  width: 20%;
}

.chats{
  width: 25%;
}

.my-profile{
  border: 2px solid mediumpurple;
  border-radius: 2vmin;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1vmin;
  margin-top: 2vmin;
  display: flex;
}

.friends{
  border-radius: 2vmin;
  border: 2px solid mediumpurple;
  width: 90%;
  margin: 0 auto;
  height: 75vmin;



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
}

.profile-username{
  font-weight: bold;
  font-family: system-ui;
  align-self: center;
  font-size: 1vw;
  padding-right: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.remove-post{
  display: flex;
  position: relative;
  left: -2vmin;
  margin-left: 2vmin;
}

.delete-post{
  display: flex;
  position: relative;
  left: -3vmin;
  margin-left: auto;
}

.date{
  position: relative;
  margin-left: auto;
  left: -2vmin;
  font-family: system-ui;
  color: rebeccapurple;
  font-size: small;
}


</style>