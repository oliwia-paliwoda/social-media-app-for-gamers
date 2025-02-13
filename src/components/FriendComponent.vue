<template>
  <div class="friend">
    <img @error="handleImageError" :src="`/images/pfps/${username}.png`" class="profile-pic-miniature-friend" @click="goToUserProfile(username)"/>
    <div class="friend-name" @click="goToUserProfile(userId)">{{username}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      NAME: 'FriendComponent',

    }

  },

  props: {
    username: {
      type: String,
      required: true
    },
    displayedName: {
      type: String,
      required: true
    }
  },

  methods: {
    goToUserProfile(userId) {
      console.error("argument:",userId);
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

    handleImageError(event) {
      event.target.src = '/images/pfps/default.png';
    },

  }
};

</script>

<style>

.friend-name{
  font-weight: bold;
  font-family: system-ui;
  font-size: 1.5vmin;
  padding-right: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

friend-name{
  font-weight: bold;
  font-family: system-ui;
  font-size: 1.5vmin;
  padding-right: 1vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>