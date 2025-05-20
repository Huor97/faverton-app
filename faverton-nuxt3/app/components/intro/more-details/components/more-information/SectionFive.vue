<script setup lang="ts">
import { gsap } from 'gsap';

const titleSectionFiveRef = ref<HTMLElement | null>(null);
const paragraphSectionFiveRef = ref<HTMLElement | null>(null);
const buttonSectionFiveRef = ref<HTMLElement | null>(null);
const logo1SectionFiveRef = ref<HTMLElement | null>(null);
const logo2SectionFiveRef = ref<HTMLElement | null>(null);
const logo3SectionFiveRef = ref<HTMLElement | null>(null);
const logo4SectionFiveRef = ref<HTMLElement | null>(null);
const logo5SectionFiveRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (logo1SectionFiveRef.value) {
    gsap.fromTo(
      logo1SectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: logo1SectionFiveRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
onMounted(() => {
  if (logo2SectionFiveRef.value) {
    gsap.fromTo(
      logo2SectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: logo2SectionFiveRef.value,
          start: `top 75%`,
          once: true,
        },
      },
    );
  }
});
onMounted(() => {
  if (logo3SectionFiveRef.value) {
    gsap.fromTo(
      logo3SectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: logo3SectionFiveRef.value,
          start: `top 70%`,
          once: true,
        },
      },
    );
  }
});
onMounted(() => {
  if (logo4SectionFiveRef.value) {
    gsap.fromTo(
      logo4SectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: logo4SectionFiveRef.value,
          start: `top 65%`,
          once: true,
        },
      },
    );
  }
});
onMounted(() => {
  if (logo5SectionFiveRef.value) {
    gsap.fromTo(
      logo5SectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -60,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: logo5SectionFiveRef.value,
          start: `top 60%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (titleSectionFiveRef.value) {
    gsap.fromTo (
      titleSectionFiveRef.value,
      {
        autoAlpha: 0,
        y: 50,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleSectionFiveRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (paragraphSectionFiveRef.value) {
    gsap.fromTo (
      paragraphSectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: paragraphSectionFiveRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (buttonSectionFiveRef.value) {
    gsap.fromTo (
      buttonSectionFiveRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: buttonSectionFiveRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
</script>

<template>
  <!-- top section -->
  <div class="grid grid-cols-5">
    <div class="border-2 border-black text-center">
      <h2
        ref="logo1SectionFiveRef"
        class="text-3xl p-16"
      >
        Nos partenaires
      </h2>
    </div>
    <div class="border-y-2 border-black text-center">
      <h2
        ref="logo2SectionFiveRef"
        class="text-3xl p-16"
      >
        12345
      </h2>
    </div>
    <div class="border-2 border-black text-center">
      <h2
        ref="logo3SectionFiveRef"
        class="text-3xl p-16"
      >
        12345
      </h2>
    </div>
    <div class="border-y-2 border-black text-center">
      <h2
        ref="logo4SectionFiveRef"
        class="text-3xl p-16"
      >
        12345
      </h2>
    </div>
    <div class="border-2 border-black text-center">
      <h2
        ref="logo5SectionFiveRef"
        class="text-3xl p-16"
      >
        12345
      </h2>
    </div>
  </div>
  <!-- bottom section -->
  <div class="grid grid-cols-5 border-x-2 border-b-2 border-black h-screen">
    <div class="col-span-3 border-r-2 border-black flex items-center justify-center">
      <h2
        ref="titleSectionFiveRef"
        class="text-3xl text-center"
      >
        Prêts pour l'accélération de <br> votre entreprise ?
      </h2>
    </div>
    <div class="col-span-2 flex justify-center items-center">
      <div>
        <div class="mb-10">
          <p
            ref="paragraphSectionFiveRef"
            class="w-[280px]"
          >
            <span>
              Paragraphe. Vous pouvez le modifier et ajouter votre texte. Double-cliquez ici ou cliquez sur « Modifier le texte » pour ajouter votre contenu et personnaliser la police.
            </span>
          </p>
        </div>
        <div ref="buttonSectionFiveRef">
          <NuxtLink
            to="/"
            text="mor information"
            class="text-3xl border-2 border-black p-2 hover:bg-sky-700 hover:text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>
