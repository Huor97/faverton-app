/**
 * Composable pour gérer les préférences de la carte utilisateur
 * Persiste les préférences dans le localStorage
 */
export const useMapPreferences = () => {
  const MAP_PREFERENCES_KEY = `faverton-map-preferences`;

  // États réactifs
  const isMapVisible = ref(true);
  const mapSize = ref<`small` | `medium` | `large`>(`small`);

  // Classes CSS pour les différentes tailles
  const mapSizeClasses = computed(() => {
    const sizes = {
      small: `h-[30vh]`, // 30% de la hauteur de l'écran
      medium: `h-[50vh]`, // 50% de la hauteur de l'écran
      large: `h-[70vh]`, // 70% de la hauteur de l'écran
    };
    return sizes[mapSize.value];
  });

  // Sauvegarder les préférences
  const savePreferences = () => {
    if (typeof localStorage !== `undefined`) {
      const preferences = {
        isMapVisible: isMapVisible.value,
        mapSize: mapSize.value,
      };
      localStorage.setItem(MAP_PREFERENCES_KEY, JSON.stringify(preferences));
    }
  };

  // Charger les préférences sauvegardées
  const loadPreferences = () => {
    if (typeof localStorage !== `undefined`) {
      try {
        const saved = localStorage.getItem(MAP_PREFERENCES_KEY);
        if (saved) {
          const preferences = JSON.parse(saved);
          isMapVisible.value = preferences.isMapVisible ?? true;
          mapSize.value = preferences.mapSize ?? `small`;
        }
      }
      catch (error) {
        console.warn(`Erreur lors du chargement des préférences de carte:`, error);
      }
    }
  };

  // Actions
  const toggleMapVisibility = () => {
    isMapVisible.value = !isMapVisible.value;
    savePreferences();
  };

  const setMapSize = (size: `small` | `medium` | `large`) => {
    mapSize.value = size;
    if (!isMapVisible.value) {
      isMapVisible.value = true; // Afficher la carte si elle était cachée
    }
    savePreferences();
  };

  // Initialiser les préférences au montage (seulement si on est dans un composant)
  if (getCurrentInstance()) {
    onMounted(() => {
      loadPreferences();
    });
  }
  else {
    // Si on n'est pas dans un composant (ex: tests), charger immédiatement
    loadPreferences();
  }

  // Watchers pour sauvegarder automatiquement
  watch([isMapVisible, mapSize], () => {
    savePreferences();
  });

  return {
    // États
    isMapVisible: readonly(isMapVisible),
    mapSize: readonly(mapSize),
    mapSizeClasses,

    // Actions
    toggleMapVisibility,
    setMapSize,

    // Utilitaires
    loadPreferences,
    savePreferences,
  };
};
