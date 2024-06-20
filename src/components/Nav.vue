<script setup lang="ts">
import logoFaverton from "../assets/logoFaverton.jpg";
import menu from "../assets/menu.png";
</script>

<template>
  <div class="container__nav">
    <div class="logo">
      <div class="container__logo">
        <img width="100" :src="logoFaverton" alt="faverton" />
      </div>
    </div>
    <div class="navbar">
      <div class="container__nav">
        <img :src="menu" alt="nav" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container__nav {
  display: flex;
}

.logo,
.navbar {
  width: 50%;
}

.container__logo {
  margin-left: 20px;
}

.navbar {
  display: flex;
  justify-content: end;
}

.container__nav {
  margin-right: 20px;
}
</style>
