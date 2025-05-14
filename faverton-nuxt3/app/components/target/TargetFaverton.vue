<script setup lang="ts">
import { gsap } from 'gsap';

const activeCardIndex = ref<number | null>(null);
const emit = defineEmits([`hover-change`]);
const textElement = ref(null);

function handleMouseLeave() {
  activeCardIndex.value = null;
  emit(`hover-change`, false);
}

const setActiveCard = (index: number) => {
  emit(`hover-change`, true);
  activeCardIndex.value = index;

  nextTick(() => {
    animateTextEntry();
  });
};

function animateTextEntry() {
  if (!textElement.value) return;

  // Animation d'entrée du texte par la droite
  gsap.fromTo(
    textElement.value,
    {
      autoAlpha: 0,
      x: 100,
    },
    {
      autoAlpha: 1,
      x: 0,
      duration: 0.6,
      ease: `power2.out`,
    },
  );
}

const detailProgram = [
  {
    title: `Solutions d'Énergie Durable.`,
    subtitle: `Les maisons de ferme vertes sont équipées de solutions énergétiques durables pour réduire leur empreinte carbone. Cela peut inclure l'utilisation de panneaux solaires pour la production d'électricité, de systèmes de chauffage géothermiques pour le chauffage et la climatisation, ainsi que la mise en place de systèmes de gestion de l'énergie pour optimiser la consommation. L'objectif est de minimiser la dépendance aux combustibles fossiles et de promouvoir l'utilisation d'énergies renouvelables.`,
    link: `green-energy`,
    coverImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743028555/Top_Right_Faverton_mi2csg.png`,
    characterImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743166508/Energies_Faverton_tljokh.png`,
  },

  {
    title: `Pratiques de Conservation de l'Eau.`,
    subtitle: `La gestion de l'eau est un aspect crucial des maisons de ferme vertes. Des systèmes de collecte des eaux pluviales et de recyclage des eaux grises sont mis en place pour réduire la consommation d'eau potable. De plus, des aménagements paysagers intelligents et des méthodes d'irrigation économes en eau sont utilisés pour préserver les ressources hydriques et favoriser la croissance de plantes adaptées à l'environnement local.`,
    link: `organic-waste-recycling`,
    coverImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743028555/Top_Middle_Faverton_nm9vsd.png`,
    characterImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743166412/HydroPower_Faverton_tpnxay.png`,
  },

  {
    title: `Des Récoltes Fraîches et Durables.`,
    subtitle: `Grâce à nos systèmes hydroponiques, nous cultivons des légumes frais avec un minimum de gaspillage d’eau, enrichis par du compost organique et l'énergie de la nature.`,
    link: `sustainable-agriculture`,
    coverImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743028555/Top_Right_Faverton_mi2csg.png`,
    characterImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1747181176/4_cbgeqj.png`,
  },

  {
    title: `Apprendre et Inspirer.`,
    subtitle: `Participez à nos ateliers et programmes de formation pour découvrir comment adopter des pratiques agricoles durables et renouvelables dans votre propre communauté.`,
    link: `education-workshops`,
    coverImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743028554/Bottom_Left_Faverton_htilsr.png`,
    characterImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1747181177/8_odhv6f.png`,
  },

  {
    title: `Restaurant et Activités Culturelles.`,
    subtitle: `Savourez des repas de la ferme à l’assiette, assistez à des cours de cuisine et participez à des festivals culturels célébrant la nature, la gastronomie et la communauté.`,
    link: `restaurants-cultural-activities`,
    coverImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743028554/Bottom_Center_Faverton_ojl2zi.png`,
    characterImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1747181178/5_jvbn9r.jpg`,
  },

  {
    title: `Travailler, Séjourner, Se Connecter.`,
    subtitle: `Profitez d’espaces de coworking modernes et d’hébergements éco-responsables, alliant productivité et sérénité au cœur de la nature.`,
    link: `coworking-accommodation`,
    coverImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1743028554/Bottom_Right_Faverton_ux8jvb.png`,
    characterImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1747181177/6II_zuqetz.png`,
  },
];
</script>

<template>
  <div class="text-white h-screen w-full flex justify-end sm:max-w-[94%] xl:max-w-[95%]">
    <div
      class="mt-15 flex sm:justify-between flex-wrap sm:items-start gap-1 w-[95%] sm:w-[50%]"
    >
      <div
        class="w-[48%] h-[30%] sm:h-[48%] sm:w-[32%] md:h-[48.71%] lg:w-[31.6%] lg:h-[48%] xl:w-[32.4%] xl:h-[48.75%]"
        :class="{
          grayscale: activeCardIndex !== null && activeCardIndex !== 0,
        }"
        @mouseenter="setActiveCard(0)"
        @mouseleave="handleMouseLeave"
      >
        <FavertonCardHover
          :cover-image="detailProgram[0]?.coverImage"
          :character-image="detailProgram[0]?.characterImage"
          :link="detailProgram[0]?.link"
          alt-text="Dark Rider - Mythrill"
          :title="detailProgram[0]?.title"
        />
      </div>

      <div
        class="w-[48%] h-[30%] sm:h-[48%] sm:w-[32%] md:h-[48.71%] lg:w-[31.6%] lg:h-[48%] xl:w-[32.4%] xl:h-[48.75%]"
        :class="{
          grayscale: activeCardIndex !== null && activeCardIndex !== 1,
        }"
        @mouseenter="setActiveCard(1)"
        @mouseleave="handleMouseLeave"
      >
        <FavertonCardHover
          :link="detailProgram[1]?.link"
          :cover-image="detailProgram[1]?.coverImage"
          :character-image="detailProgram[1]?.characterImage"
          alt-text="Force Mage - Mythrill"
          :title="detailProgram[1]?.title"
        />
      </div>

      <div
        class="w-[48%] h-[30%] sm:h-[48%] sm:w-[32%] md:h-[48.71%] lg:w-[31.6%] lg:h-[48%] xl:w-[32.4%] xl:h-[48.75%]"
        :class="{
          grayscale: activeCardIndex !== null && activeCardIndex !== 2,
        }"
        @mouseenter="setActiveCard(2)"
        @mouseleave="handleMouseLeave"
      >
        <FavertonCardHover
          :link="detailProgram[2]?.link"
          :cover-image="detailProgram[2]?.coverImage"
          :character-image="detailProgram[2]?.characterImage"
          alt-text="Force Mage - Mythrill"
          :title="detailProgram[2]?.title"
        />
      </div>

      <div
        class="w-[48%] h-[30%] sm:h-[48%] sm:w-[32%] md:h-[48.71%] lg:w-[31.6%] lg:h-[48%] xl:w-[32.4%] xl:h-[48.75%]"
        :class="{
          grayscale: activeCardIndex !== null && activeCardIndex !== 3,
        }"
        @mouseenter="setActiveCard(3)"
        @mouseleave="handleMouseLeave"
      >
        <FavertonCardHover
          :link="detailProgram[3]?.link"
          :cover-image="detailProgram[3]?.coverImage"
          :character-image="detailProgram[3]?.characterImage"
          alt-text="Dark Rider - Mythrill"
          :title="detailProgram[3]?.title"
        />
      </div>

      <div
        class="w-[48%] h-[30%] sm:h-[48%] sm:w-[32%] md:h-[48.71%] lg:w-[31.6%] lg:h-[48%] xl:w-[32.4%] xl:h-[48.75%]"
        :class="{
          grayscale: activeCardIndex !== null && activeCardIndex !== 4,
        }"
        @mouseenter="setActiveCard(4)"
        @mouseleave="handleMouseLeave"
      >
        <FavertonCardHover
          :link="detailProgram[4]?.link"
          :cover-image="detailProgram[4]?.coverImage"
          :character-image="detailProgram[4]?.characterImage"
          alt-text="Force Mage - Mythrill"
          :title="detailProgram[4]?.title"
        />
      </div>

      <div
        class="w-[48%] h-[30%] sm:h-[48%] sm:w-[32%] md:h-[48.71%] lg:w-[31.6%] lg:h-[48%] xl:w-[32.4%] xl:h-[48.75%]"
        :class="{
          grayscale: activeCardIndex !== null && activeCardIndex !== 5,
        }"
        @mouseenter="setActiveCard(5)"
        @mouseleave="handleMouseLeave"
      >
        <FavertonCardHover
          :link="detailProgram[5]?.link"
          :cover-image="detailProgram[5]?.coverImage"
          :character-image="detailProgram[5]?.characterImage"
          alt-text="Force Mage - Mythrill"
          :title="detailProgram[5]?.title"
        />
      </div>
    </div>

    <div class="title mt-15 w-[40%] w-[25%] md:w-[22%] xl:w-[22.37%] mx-[1.31%]">
      <p
        v-if="activeCardIndex !== null"
        ref="textElement"
        :key="activeCardIndex"
        class="text-justify font-bold text-xs sm:text-xs md:text-xl"
      >
        {{ detailProgram[activeCardIndex]?.subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .title {
  display:none
  }
}
@keyframes revealText {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
