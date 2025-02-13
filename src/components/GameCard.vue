<template>
  <div class="game-card">
    <template v-if="isImageLoaded">
      <img :src="imgpath" :alt="name" @error="handleImageError">
    </template>
    <template v-else>
      <span class="game-title">{{ name }}</span>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      NAME: 'GameCard',
      isImageLoaded: true,
    };
  },
  props: {
    imgpath: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleImageError() {
      this.isImageLoaded = false;
    },
  },
};
</script>

<style scoped>
.game-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: mediumpurple;
  font-family: system-ui;
  border-radius: 5px;
  padding: 0vmin;
  width: 6vmin;
  height: 9vmin;
  color: white;
  font-size: 14px;
  margin: 0.5vmin;
  overflow: hidden;
}

.game-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.game-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  word-wrap: break-word;
}
</style>
