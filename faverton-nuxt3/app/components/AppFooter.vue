<template>
  <div>
    <!-- Footer comme dans votre image -->
    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          <!-- Colonne 1 - Société (span 2 sur mobile) -->
          <div class="md:col-span-2 lg:col-span-1">
            <h3 class="text-xl font-bold mb-6">
              FAVERTON
            </h3>
            <p class="text-gray-300 mb-6 leading-relaxed">
              Solutions agricoles durables pour un avenir responsable.
              Spécialistes en énergies renouvelables et pratiques écologiques.
            </p>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-5 h-5 text-green-400"
                />
                <span class="text-sm text-gray-300">123 Route de la Ferme, 12345 EcoVille</span>
              </div>
              <div class="flex items-center space-x-3">
                <UIcon
                  name="i-heroicons-phone"
                  class="w-5 h-5 text-green-400"
                />
                <span class="text-sm text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div class="flex items-center space-x-3">
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-5 h-5 text-green-400"
                />
                <span class="text-sm text-gray-300">contact@faverton.fr</span>
              </div>
            </div>
          </div>

          <!-- Colonne 2 - Navigation -->
          <div>
            <h4 class="text-lg font-semibold mb-6">
              Navigation
            </h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink
                  to="/"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Accueil</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/introduction"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Nos Solutions</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/simulator"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Simulation</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Colonne 3 - Services -->
          <div>
            <h4 class="text-lg font-semibold mb-6">
              Services
            </h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink
                  to="/introduction/green-energy"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Énergie Solaire</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/introduction/organic-waste-recycling"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Gestion de l'Eau</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/introduction/sustainable-farming"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Agriculture Durable</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/introduction/education-workshops"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Formation</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/introduction/restaurants-cultural-activities"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Agrotourisme</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/introduction/eco-hosting"
                  class="text-gray-300 hover:text-green-400 transition-colors"
                >Hébergements</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Colonne 4 - Contact enrichi -->
          <div class="md:col-span-2 lg:col-span-1">
            <h4 class="text-lg font-semibold mb-6">
              Contact & Réseaux
            </h4>

            <!-- Réseaux sociaux avec contexte -->
            <div class="mb-6">
              <h5 class="text-sm font-medium text-gray-400 mb-3">
                Suivez notre actualité
              </h5>
              <div class="flex space-x-3">
                <UButton
                  color="gray"
                  variant="ghost"
                  size="sm"
                  square
                >
                  <UIcon name="i-simple-icons-facebook" />
                </UButton>
                <UButton
                  color="gray"
                  variant="ghost"
                  size="sm"
                  square
                >
                  <UIcon name="i-simple-icons-twitter" />
                </UButton>
                <UButton
                  color="gray"
                  variant="ghost"
                  size="sm"
                  square
                >
                  <UIcon name="i-simple-icons-linkedin" />
                </UButton>
              </div>
            </div>

            <!-- Support client -->
            <div class="space-y-3">
              <h5 class="text-sm font-medium text-gray-400">
                Support client
              </h5>
              <p class="text-xs text-gray-400">
                support@faverton.fr
              </p>
              <div>
                <NuxtLink
                  to="/contact"
                >
                  Contact
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Ligne de séparation -->
        <div class="border-t border-gray-700 mt-12 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div class="text-sm text-gray-400">
              © 2024 Faverton. Tous droits réservés.
            </div>
            <div class="flex space-x-6 text-sm">
              <NuxtLink
                to="/privacy"
                class="text-gray-400 hover:text-green-400 transition-colors"
              >
                Politique de Confidentialité
              </NuxtLink>
              <NuxtLink
                to="/terms"
                class="text-gray-400 hover:text-green-400 transition-colors"
              >
                Conditions d'Utilisation
              </NuxtLink>
              <NuxtLink
                to="/cookies"
                class="text-gray-400 hover:text-green-400 transition-colors"
              >
                Cookies
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
