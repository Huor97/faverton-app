<script setup lang="ts">
const activeCardIndex = ref<number | null>(null);

const detailProgram = [
  {
    title: `Solutions d'Énergie Durable.`,
    subtitle: `Les maisons de ferme vertes sont équipées de solutions énergétiques durables pour réduire leur empreinte carbone. Cela peut inclure l'utilisation de panneaux solaires pour la production d'électricité, de systèmes de chauffage géothermiques pour le chauffage et la climatisation, ainsi que la mise en place de systèmes de gestion de l'énergie pour optimiser la consommation. L'objectif est de minimiser la dépendance aux combustibles fossiles et de promouvoir l'utilisation d'énergies renouvelables.`,
    link: `/introduction/green-energy`,
  },

  {
    title: `Pratiques de Conservation de l'Eau.`,
    subtitle: ` La gestion de l'eau est un aspect crucial des maisons de ferme vertes. Des systèmes de collecte des eaux pluviales et de recyclage des eaux grises sont mis en place pour réduire la consommation d'eau potable. De plus, des aménagements paysagers intelligents et des méthodes d'irrigation économes en eau sont utilisés pour préserver les ressources hydriques et favoriser la croissance de plantes adaptées à l'environnement local.`,
    link: `/introduction/organic-waste-recycling`,
  },

  {
    title: `Des Récoltes Fraîches et Durables.`,
    subtitle: `Grâce à nos systèmes hydroponiques, nous cultivons des légumes frais avec un minimum de gaspillage d’eau, enrichis par du compost organique et l'énergie de la nature.`,
    link: `/introduction/sustainable-agriculture`,
  },

  {
    title: `Apprendre et Inspirer.`,
    subtitle: `Participez à nos ateliers et programmes de formation pour découvrir comment adopter des pratiques agricoles durables et renouvelables dans votre propre communauté.`,
    link: `/introduction/education-workshops`,
  },

  {
    title: `Restaurant and Cultural Activities.`,
    subtitle: `Savourez des repas de la ferme à l’assiette, assistez à des cours de cuisine et participez à des festivals culturels célébrant la nature, la gastronomie et la communauté.`,
    link: `/introduction/restaurants-cultural-activities`,
  },

  {
    title: `Travailler, Séjourner, Se Connecter.`,
    subtitle: `Profitez d’espaces de coworking modernes et d’hébergements éco-responsables, alliant productivité et sérénité au cœur de la nature.`,
    link: `/introduction/coworking-accommodation`,
  },
];

const setActiveCard = (index: number) => {
  activeCardIndex.value = index;
};
</script>

<template>
  <div class="flex justify-end gap-2">
    <div class="h-screen flex flex-col justify-center mt-15">
      <div class="cards-container h-80 mb-3 mt-15 w-full flex justify-center items-center">
        <div
          class="p-1 hover:p-10 hover:transition delay-300 duration-700 ease-in-out"
          @mouseenter="setActiveCard(0)"
          @mouseleave="setActiveCard(activeCardIndex.value)"
        >
          <FavertonCardHover
            cover-image="https://ggayane.github.io/css-experiments/cards/dark_rider-cover.jpg"
            character-image="https://ggayane.github.io/css-experiments/cards/dark_rider-character.webp"
            :link="detailProgram[0]?.link"
            alt-text="Dark Rider - Mythrill"
            :title="detailProgram[0]?.title"
          />
        </div>
        <div
          class="p-1 hover:p-10 hover:transition delay-300 duration-700 ease-in-out"
          @mouseenter="setActiveCard(1)"
          @mouseleave="setActiveCard(activeCardIndex.value)"
        >
          <FavertonCardHover
            :link="detailProgram[1]?.link"
            cover-image="https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg"
            character-image="https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
            alt-text="Force Mage - Mythrill"
            :title="detailProgram[1]?.title"
          />
        </div>
        <div
          class="p-1 hover:p-10 hover:transition delay-300 duration-700 ease-in-out"
          @mouseenter="setActiveCard(2)"
          @mouseleave="setActiveCard(activeCardIndex.value)"
        >
          <FavertonCardHover
            :link="detailProgram[2]?.link"
            cover-image="https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg"
            character-image="https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
            alt-text="Force Mage - Mythrill"
            :title="detailProgram[2]?.title"
          />
        </div>
      </div>
      <div class="cards-container h-80 mt-3 w-full flex justify-center items-center">
        <div
          class=" flex items-center justify-center p-1 hover:p-10 hover:transition delay-300 duration-700 ease-in-out"
          @mouseenter="setActiveCard(3)"
          @mouseleave="setActiveCard(activeCardIndex.value)"
        >
          <FavertonCardHover
            :link="detailProgram[3]?.link"
            cover-image="https://ggayane.github.io/css-experiments/cards/dark_rider-cover.jpg"
            character-image="https://ggayane.github.io/css-experiments/cards/dark_rider-character.webp"
            alt-text="Dark Rider - Mythrill"
            :title="detailProgram[3]?.title"
          />
        </div>
        <div
          class="p-1 hover:p-10 hover:transition delay-300 duration-700 ease-in-out"
          @mouseenter="setActiveCard(4)"
          @mouseleave="setActiveCard(activeCardIndex.value)"
        >
          <FavertonCardHover
            :link="detailProgram[4]?.link"
            cover-image="https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg"
            character-image="https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
            alt-text="Force Mage - Mythrill"
            :title="detailProgram[4]?.title"
          />
        </div>
        <div
          class="p-1 hover:p-10 hover:transition delay-300 duration-700 ease-in-out"
          @mouseenter="setActiveCard(5)"
          @mouseleave="setActiveCard(activeCardIndex.value)"
        >
          <FavertonCardHover
            :link="detailProgram[5]?.link"
            cover-image="https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg"
            character-image="https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
            alt-text="Force Mage - Mythrill"
            :title="detailProgram[5]?.title"
          />
        </div>
      </div>
    </div>
    <div class="w-64 mt-15 mr-5">
      <transition
        name="fade"
        mode="out-in"
      >
        <p
          v-if="activeCardIndex !== null"
          :key="activeCardIndex"
          class="indent-8 text-justify text-2xl font-bold leading-[1.1]"
        >
          {{ detailProgram[activeCardIndex].subtitle }}
        </p>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
