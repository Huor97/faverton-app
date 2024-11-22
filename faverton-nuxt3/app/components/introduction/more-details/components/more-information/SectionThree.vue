<script setup lang="ts">
import { gsap } from 'gsap';

const titleSectionThreeRef = ref<HTMLElement | null>(null);
const paragraphSectionThreeRef = ref<HTMLElement | null>(null);
const buttonSectionThreeRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (titleSectionThreeRef.value) {
    gsap.fromTo (
      titleSectionThreeRef.value,
      {
        autoAlpha: 0,
        y: 50,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleSectionThreeRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (paragraphSectionThreeRef.value) {
    gsap.fromTo (
      paragraphSectionThreeRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: paragraphSectionThreeRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (buttonSectionThreeRef.value) {
    gsap.fromTo (
      buttonSectionThreeRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: buttonSectionThreeRef.value,
          start: `top 80%`,
          once: true,
        },
      },
    );
  }
});
const data = {
  pargraphe: `Paragraphe. Vous pouvez le modifier et ajouter votre texte. Double-cliquez ici ou cliquez sur « Modifier le texte » pour ajouter votre contenu et personnaliser la police. Utilisez cet espace pour raconter une histoire et vous présenter à vos visiteurs. Vous pouvez le faire glisser-déposer où vous le souhaitez sur la page.`,
};
</script>

<template>
  <div class="w-2/4 border-r-2 border-black flex items-center justify-center">
    <FavertonChapterTitle title=" Vitesse sans précédent. Fiabilité impeccable." />
  </div>
  <div class="w-2/4 h-full">
    <div class="h-full w-full grid gap-4 justify-center">
      <div class="pt-32">
        <FavertonParagraphe :pargraphe="data.pargraphe">
          <span>
            {{ data.pargraphe }}
          </span>
          <br>
          <br>
          <span>
            {{ data.pargraphe }}
          </span>
        </FavertonParagraphe>
      </div>
      <div
        ref="buttonSectionThreeRef"
        class="pt-4 pb-28"
      >
        <FavertonBtn button="mor information" />
      </div>
    </div>
  </div>
</template>
