<script setup>
const route = useRoute();
const slug = route.params.slug;

const articles = [
  {
    articlesId: `green-energy`,
    title: `Solutions d'Énergie Durable.`,
    subTitle: `Solutions d'Énergie Durable.:Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    articlesId: `organic-waste-recycling`,
    title: `Pratiques de Conservation de l'Eau.`,
    subTitle: `Pratiques de Conservation de l'Eau.: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut `,
  },
  {
    articlesId: `sustainable-agriculture`,
    title: `Des Récoltes Fraîches et Durables.`,
    subTitle: `Des Récoltes Fraîches et Durables.:Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    articlesId: `education-workshops`,
    title: `Apprendre et Inspirer.`,
    subTitle: `Apprendre et Inspirer: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    articlesId: `restaurants-cultural-activities`,
    title: `Restaurant and Cultural Activities.`,
    subTitle: `Restaurant and Cultural Activities.:Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    articlesId: `coworking-accommodation`,
    title: `Travailler, Séjourner, Se Connecter.`,
    subTitle: `Travailler, Séjourner, Se Connecter: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
];

const article = articles.find(a => a.articlesId === slug);
</script>

<template>
  <div>
    <AppHeader />
    <div class="z-index-[999] absolute left-32 top-4">
      <UBreadcrumb
        :links="[{ label: 'Introduction', to: '/introduction' }, { label: article.title }]"
      >
        <template #default="{ link, isActive }">
          <UBadge
            :color="isActive ? 'primary' : 'gray'"
            class="rounded-full truncate"
          >
            {{ link.label }}
          </UBadge>
        </template>
      </UBreadcrumb>
    </div>
    <div class="bg-[url('../Ventilateurs.jpg')] bg-cover flex flex-col justify-center h-screen">
      <div
        ref="titleSection1"
        class="p-5 w-2/4 ml-24"
      >
        <h1 class="text-7xl font-extrabold">
          {{ article.title }}
        </h1>
      </div>
      <div
        ref="subTitleSection1"
        class="p-5 w-2/4 ml-24"
      >
        <p class="text-3xl">
          {{ article.subTitle }}
        </p>
      </div>
    </div>
  </div>
</template>
