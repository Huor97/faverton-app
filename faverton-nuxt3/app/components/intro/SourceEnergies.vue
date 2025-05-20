<script setup lang="ts">
import gsap from 'gsap';

const props = defineProps<{
  title: string
  subTitle: string
  button: string
}>();

// const data = [
//   {
//     title: `Vos données vous porterons vers de nouveaux sommets`,
//     subtitle: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum deleniti omnis, excepturi`,
//   },
//   {
//     title: `Vos données vous porterons vers de nouveaux sommets`,
//     subtitle: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum deleniti omnis, excepturi`,
//   },
//   {
//     title: `Vos données vous porterons vers de nouveaux sommets`,
//     subtitle: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum deleniti omnis, excepturi`,
//   },
//   {
//     title: `Vos données vous porterons vers de nouveaux sommets`,
//     subtitle: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum deleniti omnis, excepturi`,
//   },
// ];

const titleSection1 = ref<HTMLElement | null>(null);
const subTitleSection1 = ref<HTMLElement | null>(null);
const buttonSection1 = ref<HTMLElement | null>(null);

onMounted(() => {
  if (titleSection1.value) {
    gsap.fromTo(
      titleSection1.value,
      { autoAlpha: 0, x: -1000 },
      { autoAlpha: 1, x: 0, duration: 2 },
    );
  }
});

onMounted(() => {
  if (subTitleSection1.value) {
    gsap.fromTo(
      subTitleSection1.value,
      { autoAlpha: 0, x: -1000 },
      { autoAlpha: 1, x: 0, duration: 2.5 },
    );
  }
});

onMounted(() => {
  if (buttonSection1.value) {
    gsap.fromTo(
      buttonSection1.value,
      { autoAlpha: 0, x: -1000 },
      { autoAlpha: 1, x: 0, duration: 3 },
    );
  }
});
</script>

<template>
  <div>
    <AppHeader />
    <div class="bg-[url('../Ventilateurs.jpg')] bg-cover">
      <div class=" ml-10 w-2/4 flex flex-col justify-center h-screen">
        <div
          ref="titleSection1"
          class="p-5"
        >
          <h1 class="text-7xl font-extrabold">
            {{ props.title }}
          </h1>
        </div>
        <div
          ref="subTitleSection1"
          class="p-5"
        >
          <p class="text-3xl">
            {{ props.subTitle }}
          </p>
        </div>
        <div
          ref="buttonSection1"
          class="p-5"
        >
          <FavertonBtn :button="props.button" />
        </div>
      </div>
    </div>
    <div class="h-[50vh]" />

    <div class="h-[90vh] ml-14 mr-14 flex border-2 border-black">
      <IntroductionMoreDetailsComponentsMoreInformationSectionTwo />
    </div>
    <div class="h-[35vh]" />
    <div class="ml-14 mr-14 h-full flex border-2 border-black">
      <IntroductionMoreDetailsComponentsMoreInformationSectionThree />
    </div>
    <div class="h-[20vh]" />
    <div class="h-screen">
      <IntroductionMoreDetailsComponentsMoreInformationSectionFour />
    </div>
    <div class="ml-14 mr-14">
      <IntroductionMoreDetailsComponentsMoreInformationSectionFive />
    </div>
  </div>
</template>
