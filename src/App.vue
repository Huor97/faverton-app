<script setup lang="ts">
import Nav from "./components/Nav.vue";
import Welcome from "./components/Welcome.vue";
import FirstPage from "./components/first-page.vue"
import Intro from "./components/intro.vue"
import { onMounted, ref } from "vue";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const section1 = ref<HTMLElement | null>(null);
const section2 = ref<HTMLElement | null>(null);
const section3 = ref<HTMLElement | null>(null);
const section4 = ref<HTMLElement | null>(null);

onMounted(() => {
  if (section1.value) {
    gsap.from(section1.value.children, {
      opacity: 0,
      y:20,
      stagger: 0.3,
      scrollTrigger: {
        trigger: section1.value,
        start: 'top 40%',
        end: 'bottom 45%',
        scrub: true,
        onLeave: () => gsap.to(section1.value.children, { opacity: 0 }),
        markers: true, // Utile pour le débogage, à retirer en production
      },
    });
  }
});

onMounted(() => {
  if (section2.value) {
    gsap.from(section2.value.children, {
      opacity: 0,
      y:20,
      stagger: 0.3,
      scrollTrigger: {
        trigger: section2.value,
        start: 'top 40%',
        end: 'bottom 50%',
        scrub: true,
        onLeave: () => gsap.to(section2.value.children, { opacity: 0 }),
        // markers: true, // Utile pour le débogage, à retirer en production
      },
    });
  }
});


onMounted(() => {
  if (section3.value) {
    gsap.from(section3.value.children, {
      opacity: 0,
      y:20,
      stagger: 0.3,
      scrollTrigger: {
        trigger: section3.value,
        start: 'top 80%',
        end: 'bottom 90%',
        scrub: true,
        onLeave: () => gsap.to(section3.value.children, { opacity: 0 }),
        // markers: true, // Utile pour le débogage, à retirer en production
      },
    });
  }
});

onMounted(() => {
  if (section4.value) {
    gsap.from(section4.value.children, {
      opacity: 0,
      y:20,
      stagger: 0.3,
      scrollTrigger: {
        trigger: section4.value,
        start: 'top 90%',
        end: 'bottom 95%',
        scrub: true,
        onLeave: () => gsap.to(section4.value.children, { opacity: 0 }),
        // markers: true, // Utile pour le débogage, à retirer en production
      },
    });
  }
});

</script>

<template>
  <!-- <Nav />
  <Welcome /> -->
  <FirstPage />

  <Intro />

  <div  class=" container-section">
    <div ref="section1" class="section1">
      <h2>Titre S1</h2>
      <p>
        Lorem ipsum dolor sit amet <span>consectetur adipisicing elit</span>. Magnam fugit, doloremque accusamus recusandae suscipit blanditiis, architecto eum ab accusantium dignissimos animi consequatur, pariatur qui delectus odio consectetur atque aut eius!
      Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus
    </p>
    </div>
  </div>

  <div class="container-section container-s2">
    <div ref="section2" class="section2">
      <h2 >Titre S2</h2>
      <p >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam fugit, doloremque accusamus recusandae suscipit blanditiis, architecto eum ab <span>consectetur adipisicing elit</span>, pariatur qui delectus odio consectetur atque aut eius!
      Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus
    </p>
    </div>

    <div ref="section3" class="section3">
      <h2>Titre S3</h2>
      <p>
        Lorem ipsum dolor sit amet <span>consectetur adipisicing elit</span>. Magnam fugit, doloremque accusamus recusandae suscipit blanditiis, architecto eum ab accusantium dignissimos animi consequatur, pariatur qui delectus odio consectetur atque aut eius!
      Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus
      </p>
    </div>

  </div>

  <div class="container-section">
    <div ref="section4" class="section4">
      <h2 >Titre S4</h2>
      <p>
        Lorem ipsum dolor sit amet <span>consectetur adipisicing elit</span>. Magnam fugit, doloremque accusamus recusandae suscipit blanditiis, architecto eum ab accusantium dignissimos animi consequatur, pariatur qui delectus odio consectetur atque aut eius!
      Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus
    </p>
    </div>

  </div>
  <div></div>
</template>

<style scoped>
div {
  height: 100vh;
}

.container-section {
  position: relative;
  color: aliceblue;
  width: 30%;
}

.container-section > h2, 
.container-section > p {
  position: fixed;
  margin: 0;
}

.section1 {
  position: relative;
  display: flex;
  flex-direction: column;
  left: 30vw;
  height: 200px;
}

.section2 {
  position: relative;
  display: flex;
  flex-direction: column;
  left: 60vw;
  height: 200px;
}

.section3 {
  position: relative;
  display: flex;
  flex-direction: column;
  left: 30vw;
  height: 200px;
}

.section4 {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 200px;
  left: 25vw;
}

.section1 > h2,
.section1 > p {
  margin: 0;
}

.section2 > h2,
.section2 > p {
  margin: 0;
}

.section3 > h2,
.section3 > p {
  margin: 0;
}

.section4 > h2,
.section4 > p {
  margin: 0;
}

span {
  background-color: #00acd4;
  color: rgb(0, 66, 18);
  padding: 1px;
}

</style>
