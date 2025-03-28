<script setup lang="ts">
defineProps<{
  coverImage?: string
  titleImage?: string
  characterImage?: string
  link?: string
  altText?: string
  title?: string
}>();
</script>

<template>
  <NuxtLink
    :to="link"
    :alt="altText || 'Card link'"
  >
    <div class="card">
      <div class="wrapper">
        <img
          :src="coverImage"
          class="cover-image"
        >
      </div>

      <img
        :src="characterImage"
        class="character"
      >
      <div class="h-[100%] flex items-end">
        <h1 class="title text-center font-bold md:text-xs lg:text-2xl xl:p-2 "> {{ title }}</h1>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  perspective: 2500px;
}
.wrapper {
  transition: all 0.5s;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card:hover .wrapper {
  transform: perspective(900px) translateY(-5%) rotateX(25deg) translateZ(0);
  box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
}
.wrapper::before,
.wrapper::after {
  content: "";
  opacity: 0;
  width: 100%;
  height: 80px;
  transition: all 0.5s;
  position: absolute;
  left: 0;
}
.wrapper::before {
  top: 0;
  height: 100%;
  background-image: linear-gradient(
    to top,
    transparent 46%,
    rgba(12, 13, 19, 0.5) 68%,
    rgba(12, 13, 19) 97%
  );
}
.wrapper::after {
  bottom: 0;
  opacity: 1;
  background-image: linear-gradient(
    to bottom,
    transparent 46%,
    rgba(12, 13, 19, 0.5) 68%,
    rgba(12, 13, 19) 97%
  );
}
.card:hover .wrapper::before,
.wrapper::after {
  opacity: 1;
}
.card:hover .wrapper::after {
  height: 120px;
}
.title {
  width: 100%;
  transition: transform 0.5s;
}

.card:hover .title {
  transform: translate3d(0%, -60px, 100px);
}
.character {
  width: 80%;
  height: 80%;
  opacity: 0;
  transition: all 0.5s;
  position: absolute;
  z-index: -1;
}
.card:hover .character {
  opacity: 1;
  transform: translate3d(0%, -30%, 100px);
}
</style>
