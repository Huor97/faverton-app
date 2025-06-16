<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-12">
      <FavertonHeaderConcat
        :title="contactData.title"
        :description="contactData.project.description"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Support technique -->
        <FavertonCardContact
          title="Support technique"
          icon="i-heroicons-wrench-screwdriver"
        >
          <div class="space-y-2">
            <p class="text-sm text-gray-600">
              {{ contactData.support.title }}
            </p>
            <UButton
              :to="`mailto:${contactData.support.email}`"
              variant="ghost"
              size="sm"
              class="p-0 h-auto font-normal justify-start"
            >
              {{ contactData.support.email }}
            </UButton>
            <p class="text-xs text-gray-500">
              {{ contactData.support.responseTime }}
            </p>
          </div>
        </FavertonCardContact>

        <!-- Développeur -->
        <FavertonCardContact
          title="Développeur"
          icon="i-heroicons-user"
        >
          <div class="space-y-3">
            <p class="font-medium">
              {{ contactData.developer.name }}
            </p>
            <div class="space-y-1">
              <UButton
                :to="`mailto:${contactData.developer.email}`"
                variant="ghost"
                size="sm"
                class="p-0 h-auto font-normal justify-start"
              >
                {{ contactData.developer.email }}
              </UButton>
            </div>
            <div class="flex gap-2">
              <UButton
                :to="contactData.developer.github"
                target="_blank"
                variant="outline"
                size="xs"
                icon="i-simple-icons-github"
              >
                GitHub
              </UButton>
              <UButton
                :to="contactData.developer.linkedin"
                target="_blank"
                variant="outline"
                size="xs"
                icon="i-simple-icons-linkedin"
              >
                LinkedIn
              </UButton>
            </div>
          </div>
        </FavertonCardContact>

        <!-- Projet open-source -->
        <FavertonCardContact
          title="Contribuer"
          icon="i-heroicons-code-bracket"
        >
          <div class="space-y-3">
            <UButton
              :to="contactData.project.repository"
              target="_blank"
              variant="solid"
              size="sm"
              icon="i-simple-icons-github"
              class="w-full"
            >
              Code source
            </UButton>
            <div class="text-sm text-gray-600 space-y-1">
              <p>• Ouvrir une issue</p>
              <p>• Proposer des améliorations</p>
              <p>• Consulter la documentation</p>
            </div>
          </div>
        </FavertonCardContact>
      </div>

      <!-- Infrastructure -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-server" />
          Infrastructure technique
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="font-medium">Application:</span> {{ contactData.project.infrastructure.app }}
          </div>
          <div>
            <span class="font-medium">Base de données:</span> {{ contactData.project.infrastructure.database }}
          </div>
          <div>
            <span class="font-medium">Région:</span> {{ contactData.project.infrastructure.region }}
          </div>
        </div>
      </div>

      <!-- Footer message -->
      <div class="text-center mt-12 pt-8 border-t border-gray-200">
        <p class="text-gray-600 flex items-center justify-center gap-2">
          <span>Développé avec</span>
          <UIcon
            name="i-heroicons-heart"
            class="text-green-500"
          />
          <span>pour la transition écologique</span>
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Faverton - Simulateur de potentiel solaire pour fermes écologiques
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Import des données externalisées
import contactData from '~/data/contact.json';

// Métadonnées
useSeoMeta({
  title: `Contact - Faverton`,
  description: `Contactez l'équipe Faverton pour toute question sur notre simulateur de potentiel solaire open-source.`,
});
</script>
