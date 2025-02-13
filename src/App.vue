<template>
  <div id="app">
    <router-view></router-view>
  </div>
 </template>

<script>
import Dashboard from './components/Dashboard.vue';
import MyProfile from './components/MyProfile.vue';

export default {
  name: 'App',
  components: {
    Dashboard,
    MyProfile,
  },
};
</script>

<style>

</style>
