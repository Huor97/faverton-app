<script setup lang="ts">
interface Props {
  /** Nom de l'icône Heroicons à afficher */
  icon?: string
  /** Titre principal du prompt */
  title?: string
  /** Description/message explicatif */
  description?: string
  /** Texte optionnel de sécurité/confidentialité */
  securityText?: string
  /** Classes CSS personnalisées pour le conteneur principal */
  containerClass?: string
  /** Classes CSS personnalisées pour la section des boutons */
  buttonsClass?: string
  /** Classes CSS personnalisées pour l'icône */
  iconClass?: string
}

const _props = withDefaults(defineProps<Props>(), {
  icon: 'i-heroicons-lock-closed',
  title: 'Authentification requise',
  description: 'Veuillez vous connecter pour accéder à cette fonctionnalité.',
  containerClass: 'flex flex-col items-center justify-center',
  buttonsClass: 'flex gap-4',
  iconClass: 'w-16 h-16 mb-4 text-gray-400',
});
</script>

<template>
  <div :class="containerClass">
    <UIcon
      :name="icon"
      :class="iconClass"
    />

    <h2 class="text-2xl font-medium mb-3 text-center">
      {{ title }}
    </h2>

    <p class="text-center mb-6 max-w-md">
      {{ description }}
    </p>

    <div :class="buttonsClass">
      <slot name="buttons">
        <!-- Boutons par défaut si aucun slot n'est fourni -->
        <UButton
          to="/user/login"
          color="primary"
          size="lg"
        >
          Se connecter
        </UButton>
        <UButton
          to="/user/register"
          color="gray"
          variant="outline"
          size="lg"
        >
          Créer un compte
        </UButton>
      </slot>
    </div>

    <p class="text-xs text-gray-500 mt-4">
      🔒 Vos données de simulation sont sécurisées et privées
    </p>
  </div>
</template>
