<script setup lang="ts">
const route = useRoute();
const rawSlug = route.params.slug;
const slug = typeof rawSlug === `string`
  ? rawSlug
  : Array.isArray(rawSlug) && rawSlug.length > 0
    ? rawSlug[0]
    : ``;

const { getArticleBySlug } = useArticles();
const article = getArticleBySlug(slug || ``);

if (!article) {
  throw createError({
    statusCode: 404,
    statusMessage: `Article "${slug}" non trouvé`,
  });
}

useSeoMeta({
  title: article.metadata.title,
  description: article.metadata.summary,
  ogImage: article.metadata.heroImage,
});

const { isMobile } = useDevice();
const isSmallScreen = computed(() => isMobile);
</script>

<template>
  <div>
    <ClientOnly>
      <template #default>
        <div
          v-if="!isSmallScreen"
          class="header-container"
        >
          <AppHeader />
        </div>
        <MobileMenu v-else />
      </template>
    </ClientOnly>

    <div
      class="z-50 fixed top-4"
      :class="!isSmallScreen? 'left-32':'left-16'"
    >
      <UBreadcrumb
        :links="[
          { label: 'Accueil', to: '/introduction' },
          { label: article.metadata.title },
        ]"
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

    <!-- Hero Section -->
    <section
      class="relative h-screen flex items-center justify-center bg-cover bg-center"
      :style="{ backgroundImage: `url(${article.sections?.[0]?.backgroundImage || ''})` }"
    >
      <div class="absolute inset-0 bg-black/40" />

      <div class="relative z-10 max-w-4xl mx-auto text-white text-center px-6">
        <h1 class="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          {{ article.metadata.title }}
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
          {{ article.metadata.summary }}
        </p>
      </div>
    </section>

    <div class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-6">
        <section
          v-for="(section, index) in article.sections.slice(1)"
          :key="index"
          class="mb-20"
        >
          <div
            v-if="section.type === 'intro'"
            class="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div class="grid lg:grid-cols-2 gap-0">
              <div class="relative h-96 lg:h-auto">
                <NuxtImg
                  :src="section.image"
                  :alt="section.title || 'Article image'"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="p-12 flex items-center">
                <div>
                  <div class="text-sm text-gray-500 mb-4 leading-relaxed">
                    {{ section.content }}
                  </div>
                  <div class="text-xs text-gray-400 italic">
                    En tant qu'agriculteur responsable, nous privilégions les énergies renouvelables et les pratiques écologiques.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="section.type === 'benefits'"
            class="text-center"
          >
            <h2 class="text-4xl font-bold mb-4 text-gray-800">
              Notre approche s'appuie sur :
            </h2>
            <p class="text-gray-600 mb-16 max-w-3xl mx-auto">
              Des solutions durables et innovantes pour transformer votre exploitation agricole.
            </p>

            <!-- Cards en grille comme dans votre image -->
            <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div
                v-for="(item, itemIndex) in section.items"
                :key="itemIndex"
                class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <!-- Icône comme dans votre design -->
                <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center">
                  <NuxtImg
                    :src="item.icon"
                    :alt="item.title"
                    class="w-16 h-16"
                  />
                </div>

                <h3 class="text-xl font-semibold mb-4 text-gray-800">
                  {{ item.title }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ item.description }}
                </p>

                <!-- Badge style pourcentage si pertinent -->
                <div
                  v-if="itemIndex === 0"
                  class="mt-6"
                />
              </div>
            </div>
          </div>

          <!-- Section Statistics - Style de votre image -->
          <div
            v-else-if="section.type === 'statistics'"
            class="relative bg-cover bg-center rounded-2xl overflow-hidden"
            :style="{ backgroundImage: `url(${section.backgroundImage})` }"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />

            <div class="relative z-10 py-20 px-8">
              <div class="grid md:grid-cols-3 gap-12 text-center text-white max-w-5xl mx-auto">
                <div
                  v-for="(stat, statIndex) in section.stats"
                  :key="statIndex"
                  class="group"
                >
                  <div class="text-5xl lg:text-6xl font-bold mb-4 text-green-400 group-hover:scale-110 transition-transform">
                    {{ stat.value }}
                  </div>
                  <div class="text-xl lg:text-2xl font-semibold mb-2">
                    {{ stat.label }}
                  </div>
                  <div class="text-sm lg:text-base opacity-90 leading-relaxed">
                    {{ stat.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  animation: fadeOutOnScroll linear both;
  animation-timeline: scroll(root);
  animation-range: 0px 100vh;
}

@keyframes fadeOutOnScroll {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

/* Fallback pour navigateurs ne supportant pas animation-timeline */
@supports not (animation-timeline: scroll()) {
  .header-container {
    animation: none;
  }
}
</style>
