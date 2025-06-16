<script setup lang="ts">
import contactData from '~/data/contact.json';

// Métadonnées SEO
useSeoMeta({
  title: `Politique de Confidentialité - Faverton`,
  description: `Politique de confidentialité et protection des données personnelles de Faverton, conformément au RGPD.`,
  ogTitle: `Politique de Confidentialité - Faverton`,
  ogDescription: `Découvrez comment Faverton protège vos données personnelles conformément au RGPD.`,
});

// Fonction utilitaire pour formater la date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(`fr-FR`, {
    year: `numeric`,
    month: `long`,
    day: `numeric`,
  }).format(date);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Politique de Confidentialité
          </h1>

          <p class="text-sm text-gray-600 mb-8">
            <strong>Dernière mise à jour :</strong> {{ formatDate(new Date()) }}
          </p>

          <div class="prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed mb-6">
              Chez Faverton, nous nous engageons à protéger et respecter votre vie privée.
              Cette politique explique comment nous collectons, utilisons et protégeons vos données
              personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>

            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Responsable du traitement
            </h2>

            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <p class="font-semibold text-gray-900">
                Faverton
              </p>
              <p class="text-gray-700">
                Email : {{ contactData.support.email }}
              </p>
              <p class="text-gray-700">
                Développeur : {{ contactData.developer.name }} ({{ contactData.developer.email }})
              </p>
            </div>

            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Données collectées
            </h2>

            <p class="text-gray-700 mb-4">
              Nous collectons uniquement les données essentielles au fonctionnement de l'application :
            </p>

            <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Données de compte :</strong> Adresse email, nom d'utilisateur</li>
              <li><strong>Données de simulation :</strong> Coordonnées géographiques des surfaces simulées, paramètres de calcul</li>
              <li><strong>Données techniques :</strong> Logs de connexion, données de session</li>
            </ul>

            <UAlert
              icon="i-heroicons-shield-check"
              color="green"
              variant="soft"
              title="Données protégées"
              description="Nous ne collectons aucune donnée sensible comme les informations bancaires, l'adresse postale complète ou des données biométriques."
              class="mb-6"
            />

            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Finalités du traitement
            </h2>

            <p class="text-gray-700 mb-4">
              Vos données sont utilisées exclusivement pour :
            </p>

            <div class="grid md:grid-cols-2 gap-4 mb-6">
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-user-circle"
                      class="text-blue-500"
                    />
                    <h4 class="font-semibold">
                      Gestion de compte
                    </h4>
                  </div>
                </template>
                <p class="text-sm text-gray-600">
                  Créer et gérer votre compte utilisateur
                </p>
              </UCard>

              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-chart-bar"
                      class="text-green-500"
                    />
                    <h4 class="font-semibold">
                      Simulations
                    </h4>
                  </div>
                </template>
                <p class="text-sm text-gray-600">
                  Sauvegarder et afficher l'historique de vos simulations
                </p>
              </UCard>
            </div>

            <!-- Continuer avec les autres sections... -->

            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              7. Vos droits
            </h2>

            <p class="text-gray-700 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>

            <div class="space-y-3 mb-6">
              <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <UIcon
                  name="i-heroicons-eye"
                  class="text-blue-500 mt-1 flex-shrink-0"
                />
                <div>
                  <h4 class="font-semibold text-gray-900">
                    Droit d'accès
                  </h4>
                  <p class="text-sm text-gray-600">
                    Consulter vos données personnelles
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <UIcon
                  name="i-heroicons-pencil"
                  class="text-green-500 mt-1 flex-shrink-0"
                />
                <div>
                  <h4 class="font-semibold text-gray-900">
                    Droit de rectification
                  </h4>
                  <p class="text-sm text-gray-600">
                    Corriger vos informations
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <UIcon
                  name="i-heroicons-trash"
                  class="text-red-500 mt-1 flex-shrink-0"
                />
                <div>
                  <h4 class="font-semibold text-gray-900">
                    Droit à l'effacement
                  </h4>
                  <p class="text-sm text-gray-600">
                    Supprimer votre compte
                  </p>
                </div>
              </div>
            </div>

            <UAlert
              icon="i-heroicons-envelope"
              color="blue"
              variant="soft"
              title="Exercer vos droits"
              description="Pour exercer ces droits, contactez-nous à : support@faverton.fr"
              class="mb-8"
            />

            <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              10. Contact et réclamations
            </h2>

            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="text-gray-700 mb-4">
                Pour toute question concernant cette politique ou vos données :
              </p>
              <div class="space-y-2">
                <p class="text-gray-700">
                  <strong>Email :</strong>
                  <a
                    href="mailto:support@faverton.fr"
                    class="text-blue-600 hover:underline"
                  >
                    support@faverton.fr
                  </a>
                </p>
                <p class="text-gray-700">
                  Vous pouvez également exercer votre droit de réclamation auprès de la
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    CNIL
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
