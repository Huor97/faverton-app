/**
 * Constantes par défaut pour les paramètres solaires
 * Centralisées pour éviter la duplication de code
 */

export const SOLAR_DEFAULTS = {
  /**
   * Inclinaison optimale en degrés pour la France métropolitaine
   * Basée sur la latitude moyenne (46°)
   */
  INCLINATION: 35,

  /**
   * Orientation azimutale optimale en degrés
   * 0° = Plein Sud (orientation optimale)
   */
  AZIMUT: 0,

  /**
   * Surface par défaut en m²
   */
  SURFACE: 250,
} as const;

/**
 * Limites de validation pour les paramètres solaires
 */
export const SOLAR_LIMITS = {
  INCLINATION: {
    MIN: 0, // Horizontal
    MAX: 90, // Vertical
  },
  AZIMUT: {
    MIN: -180, // Est complet
    MAX: 180, // Ouest complet
  },
} as const;

/**
 * Suggestions d'orientation prédéfinies
 */
export const ORIENTATION_SUGGESTIONS = [
  { value: 0, label: `Plein Sud (optimal)`, description: `Production maximale` },
  { value: -45, label: `Sud-Est`, description: `Production matinale` },
  { value: 45, label: `Sud-Ouest`, description: `Production en après-midi` },
  { value: -90, label: `Est`, description: `Production matinale réduite` },
  { value: 90, label: `Ouest`, description: `Production vespérale réduite` },
];
