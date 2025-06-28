# Contrôles de Carte Utilisateur

## Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs de personnaliser l'affichage de la carte dans le simulateur avec :

- **Visibilité** : Cacher/Afficher la carte
- **Taille** : Choisir entre 3 tailles (Petit 30%, Moyen 50%, Grand 70% de la hauteur d'écran)
- **Persistance** : Les préférences sont sauvegardées automatiquement

## Interface Utilisateur

### Contrôles Principaux
- **Bouton Afficher/Cacher** : En haut à droite, permet de basculer la visibilité
- **Boutons de taille** : Petit/Moyen/Grand, visibles uniquement quand la carte est affichée
- **Bouton flottant** : Apparaît en bas à droite quand la carte est cachée pour la réafficher

### Comportements
1. **Taille par défaut** : Petit (30vh)
2. **Affichage automatique** : Changer la taille réaffiche automatiquement la carte si elle était cachée
3. **Transitions fluides** : Animations CSS pour tous les changements
4. **Responsive** : S'adapte à toutes les tailles d'écran

## Architecture Technique

### Composable `useMapPreferences`

```typescript
const {
  isMapVisible,    // Ref<boolean> - État de visibilité
  mapSize,         // Ref<'small'|'medium'|'large'> - Taille actuelle
  mapSizeClasses,  // ComputedRef<string> - Classes CSS correspondantes
  toggleMapVisibility, // () => void - Basculer visibilité
  setMapSize       // (size) => void - Changer la taille
} = useMapPreferences();
```

### Persistance des Données

Les préférences sont automatiquement sauvegardées dans `localStorage` :

```json
{
  "isMapVisible": true,
  "mapSize": "medium"
}
```

### Classes CSS Générées

| Taille | Classe CSS | Hauteur |
|--------|------------|---------|
| small  | `h-[30vh]` | 30% viewport |
| medium | `h-[50vh]` | 50% viewport |
| large  | `h-[70vh]` | 70% viewport |

## Tests

### Tests Unitaires Couverts

#### Page Simulateur (`index.test.ts`)
- ✅ Affichage par défaut (visible, taille small)
- ✅ Basculement de visibilité
- ✅ Changement de taille
- ✅ Affichage automatique lors du changement de taille
- ✅ Calcul correct des classes CSS

#### Composable (`useMapPreferences.test.ts`)
- ✅ Initialisation avec valeurs par défaut
- ✅ Calcul des classes CSS
- ✅ Toggle de visibilité
- ✅ Changement de taille
- ✅ Sauvegarde localStorage
- ✅ Chargement depuis localStorage
- ✅ Gestion d'erreurs (JSON invalide, localStorage absent)
- ✅ Préférences partielles

### Commandes de Test

```bash
# Tests unitaires de la page
pnpm test app/pages/simulator/index.test.ts

# Tests du composable
pnpm test app/composables/useMapPreferences.test.ts

# Tous les tests
pnpm test
```

## Utilisation dans d'Autres Composants

Le composable peut être réutilisé ailleurs :

```vue
<script setup>
import { useMapPreferences } from '~/composables/useMapPreferences';

const { 
  isMapVisible, 
  mapSize, 
  mapSizeClasses,
  toggleMapVisibility,
  setMapSize 
} = useMapPreferences();
</script>

<template>
  <div v-if="isMapVisible" :class="mapSizeClasses">
    <MapComponent />
  </div>
  
  <button @click="toggleMapVisibility">
    {{ isMapVisible ? 'Cacher' : 'Afficher' }}
  </button>
</template>
```

## Améliorations Futures

### Possibles Extensions
1. **Tailles personnalisées** : Slider pour ajustement fin
2. **Position de la carte** : Gauche/Droite/Bas/Flottante
3. **Modes d'affichage** : Plein écran, mini-carte, overlay
4. **Préférences globales** : Synchronisation entre pages
5. **Thèmes de carte** : Satellite, plan, terrain

### Performance
- **Lazy loading** : Charger la carte uniquement si visible
- **Débounce** : Éviter les sauvegardes trop fréquentes
- **Cache** : Mémoriser les états de carte

## Notes de Développement

### Choix Techniques

1. **Pourquoi `vh` plutôt que `%`** : Plus prévisible sur mobile
2. **Pourquoi 30/50/70%** : Équilibre usage/lisibilité
3. **Pourquoi localStorage** : Simplicité, pas besoin de backend
4. **Pourquoi un composable** : Réutilisabilité et testabilité

### Bonnes Pratiques Respectées

- ✅ **Tests complets** : Couverture > 95%
- ✅ **TypeScript strict** : Types explicites
- ✅ **Accessibilité** : Boutons avec labels appropriés
- ✅ **Performance** : Pas de re-render inutiles
- ✅ **UX** : Transitions fluides et feedback visuel
- ✅ **Responsabilité unique** : Composable dédié
- ✅ **Gestion d'erreurs** : Fallbacks gracieux
