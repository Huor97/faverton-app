# 🌞 Simulateur de Potentiel Solaire

## 📌 Description

Ce projet est un simulateur permettant d'estimer le potentiel solaire d'une installation photovoltaïque. Il affiche une estimation du montant économisé en € par an et par mois en fonction des données fournies par l'utilisateur.

## ✨ Fonctionnalités

- 📊 **Estimation des économies** : Calcul du montant économisé grâce à l'énergie solaire.
    
- ⭐ **Ajout aux favoris** : Possibilité d'enregistrer une simulation pour la consulter plus tard.
    
- 📥 **Téléchargement des résultats** : Exportation des estimations au format PDF.
    

## 🔧 Technologies utilisées

- Nuxt 3 -> Nitro / Supabase -> PostreSQL
    
- TresJS -> Three.js (pour la visualisation 3D) 
    
- API :
	- [API JRC Europa Puissance Energétique](https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis_en)
	- [API Gouvernementale Géocodage](https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage)
    

## 🚀 Installation et exécution

1. Clonez le repo :  
    ```bash 
    git clone git@github.com:Huor97/faverton-app.git 
    cd faverton-nuxt3
    ```
    
2. Installez les dépendances :  
    ```bash 
    pnpm install
    ```
    
3. Démarrez le projet :  
    ```bash 
    pnpm run dev
    ```
    
## 🌳 Production

Build the application for production:
```bash
# pnpm
pnpm run build
```

Locally preview production build:
```bash
# pnpm
pnpm run preview
```

Static build page 
```bash
#pnpm
pnpm run generate
```

## 📌 Roadmap

### Phase 1 - Fonctionnalités de Base ✅

- [x] Mise en place de l'architecture Nuxt 3
- [x] Intégration de l'API JRC Europa pour les calculs de puissance
- [x] Implémentation du formulaire de saisie des données
- [x] Développement de l'API pour le calcul des estimations financières
- [x] Affichage du tableau des économies annuelles
- [ ] Ajout de graphiques pour visualiser les économies mensuelles
- [ ] Création de l'interface utilisateur de base
- [ ] Mise en place de l'export PDF des résultats

<!-- TODO: à discuter -->
### Phase 2 - Visualisation et Export 🔄

- [ ]  Intégration de TresJS pour la visualisation 3D des panneaux
- [ ]  Développement de l'orientation dynamique des panneaux
- [ ]  Implémentation des animations d'interface

<!-- TODO: à discuter -->
### Phase 3 - Personnalisation et Données 🎯

- [ ]  Intégration de Supabase et PostgreSQL
- [ ]  Système d'authentification utilisateur
- [ ]  Sauvegarde des simulations favorites
- [ ]  Ajout de paramètres avancés :
    - Coût de l'installation
    - Rendement des panneaux
    - Orientation personnalisée
    - Types de panneaux solaires

<!-- TODO: à discuter -->
### Phase 4 - Optimisation et Améliorations 🚀

- [ ]  Optimisation des performances de calcul
- [ ]  Mode hors ligne avec PWA
- [ ]  Support multilingue
- [ ]  Système de notifications pour le suivi des économies
- [ ]  Interface responsive optimisée

<!-- TODO: à discuter -->
### Phase 5 - Fonctionnalités Avancées 🌟

- [ ]  Comparaison entre différents scénarios
- [ ]  Calcul du retour sur investissement
- [ ]  Intégration des données météorologiques en temps réel
- [ ]  Assistant virtuel pour les recommandations
- [ ]  API publique pour les développeurs

## 📨 Contact

Si tu as des questions, n'hésite pas à me contacter ! 😊
rouh.karimi0@gmail.com