# 🌱 Faverton - Simulateur de Potentiel Solaire pour Fermes Écologiques

## 📌 Introduction

Faverton est un simulateur web permettant d'évaluer le potentiel de production d'énergie solaire pour les exploitations agricoles et les propriétaires terriens. Né de la volonté de démocratiser l'accès aux énergies renouvelables, ce projet s'inscrit dans une démarche de transition écologique en offrant un outil accessible et précis pour estimer la viabilité d'installations photovoltaïques.

### Finalité environnementale

Dans un contexte de transition énergétique, Faverton répond à un besoin concret : permettre aux agriculteurs et propriétaires de prendre des décisions éclairées concernant leurs investissements en énergie solaire. L'application contribue ainsi à accélérer l'adoption des énergies renouvelables dans le secteur agricole.

### Fonctionnalités principales

- **🗺️ Cartographie interactive** : Dessinez directement sur une carte la surface destinée aux panneaux solaires
- **📊 Simulation précise** : Calcul du potentiel énergétique basé sur les données réelles d'ensoleillement (API PVGIS)
- **💰 Estimation financière** : Visualisation des revenus mensuels et annuels potentiels
- **💾 Historique des simulations** : Sauvegarde et comparaison de différents scénarios
- **📱 Interface responsive** : Utilisation optimale sur tous les appareils
- **🔐 Gestion utilisateur** : Authentification sécurisée avec Supabase

## 🏗️ Architecture technique

### Stack technologique et justifications

#### Frontend
- **Nuxt 3** : Framework full-stack choisi pour ses capacités SSR (amélioration du SEO et des performances), son écosystème Vue mature et l'intégration native de TypeScript
- **Vue 3** : Framework réactif avec Composition API pour une meilleure organisation du code
- **TypeScript** : Typage statique garantissant la robustesse du code, particulièrement important pour les calculs de rendement énergétique
- **TailwindCSS & NuxtUI** : Framework CSS utility-first pour un développement rapide et une cohérence visuelle
- **Leaflet** : Bibliothèque de cartographie open-source performante et bien documentée
- **Chart.js** : Visualisation de données avec vue-chartjs pour les graphiques de production
- **TresJS** : Wrapper Vue pour Three.js, utilisé pour les éléments 3D de l'interface

#### Backend
- **Nitro 3** : Serveur intégré à Nuxt 3, optimisé pour les performances avec HMR (Hot Module Replacement)
- **Supabase** : BaaS (Backend-as-a-Service) choisi pour :
  - Authentification intégrée conforme aux standards de sécurité
  - Base de données PostgreSQL robuste
  - API temps réel pour les mises à jour instantanées
  - Interface d'administration simplifiée

#### APIs externes
- **[API Adresse data.gouv.fr](https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage)** : Géocodage gouvernemental fiable et gratuit
- **[API PVGIS JRC Europa](https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis_en)** : Données scientifiques validées sur l'ensoleillement européen

### Diagramme d'architecture

```mermaid
graph TB
    subgraph "Client Web"
        A[Interface Vue 3<br/>+ TypeScript]
        B[Leaflet Maps]
        C[Chart.js]
        D[Pinia Store]
    end
    
    subgraph "Serveur Nuxt 3"
        E[Pages SSR]
        F[API Routes<br/>Nitro Server]
        G[Middleware Auth]
        H[Composables]
    end
    
    subgraph "Services Proxy"
        I[API Adresse<br/>Géocodage]
        J[API PVGIS<br/>Données solaires]
    end
    
    subgraph "Supabase Cloud"
        K[(PostgreSQL<br/>Database)]
        L[Auth Service]
        M[Realtime<br/>Subscriptions]
        N[Storage<br/>Avatars]
    end
    
    subgraph "APIs Externes"
        O[data.gouv.fr<br/>Géocodage]
        P[JRC Europa<br/>PVGIS]
    end
    
    %% Relations Client -> Serveur
    A --> E
    A --> F
    B --> F
    C --> F
    D <--> A
    
    %% Relations Serveur -> Services
    F --> I
    F --> J
    F --> K
    F --> L
    G <--> L
    
    %% Relations Services -> APIs
    I --> O
    J --> P
    
    %% Relations internes Supabase
    L --> K
    M --> K
    N --> K
    
    %% Styling
    classDef client fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    classDef server fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    classDef proxy fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    classDef supabase fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px
    classDef external fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px
    
    class A,B,C,D client
    class E,F,G,H server
    class I,J proxy
    class K,L,M,N supabase
    class O,P external
```

Pour une vue plus détaillée des flux de données, voici un second diagramme focalisé sur le parcours d'une simulation :

### Flux de simulation

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Interface Web
    participant N as Nuxt Server
    participant G as API Géocodage
    participant P as API PVGIS
    participant DB as PostgreSQL
    
    U->>W: Saisit une adresse
    W->>N: POST /api/address
    N->>G: GET /search?q={address}
    G-->>N: Coordonnées GPS
    N-->>W: {lat, lon, city}
    W->>U: Affiche sur carte
    
    U->>W: Dessine zone
    W->>W: Calcule surface (m²)
    
    U->>W: Lance simulation
    W->>N: POST /api/simulation
    N->>P: GET /PVcalc
    P-->>N: Données mensuelles
    N->>N: Calcule rendement
    N->>DB: INSERT simulation
    DB-->>N: simulation_id
    N-->>W: Résultats complets
    W->>U: Graphiques + revenus
    
    opt Utilisateur connecté
        U->>W: Sauvegarde
        W->>N: PUT /api/simulation/{id}
        N->>DB: UPDATE history=true
        DB-->>N: OK
        N-->>W: Confirmation
    end
```

Et pour compléter, un diagramme de l'organisation des composants Vue :

### Architecture des composants Frontend

```mermaid
graph TD
    subgraph "Pages Nuxt"
        P1[index.vue<br/>Accueil]
        P2[simulator/index.vue<br/>Simulateur]
        P3[user/profile.vue<br/>Profil]
        P4[introduction/slug.vue<br/>Articles]
    end
    
    subgraph "Composants Métier"
        C1[SimulationParameters]
        C2[SimulationResult]
        C3[SimulationHistory]
        C4[FavertonMap.client]
    end
    
    subgraph "Composants UI"
        U1[FavertonCard]
        U2[FavertonModal]
        U3[FavertonTabs]
        U4[FavertonInputSearch]
    end
    
    subgraph "Stores Pinia"
        S1[addressStore<br/>Localisation]
        S2[mapStore<br/>Surface dessinée]
    end
    
    %% Relations Pages -> Composants
    P2 --> C1
    P2 --> C2
    P2 --> C3
    P2 --> C4
    
    %% Relations Composants -> UI
    C1 --> U4
    C2 --> U1
    C3 --> U3
    
    %% Relations Composants -> Stores
    C1 --> S1
    C1 --> S2
    C4 --> S2
    
    classDef pages fill:#C8E6C9,stroke:#388E3C
    classDef components fill:#E1F5FE,stroke:#0277BD
    classDef ui fill:#FFF9C4,stroke:#F57C00
    classDef stores fill:#FCE4EC,stroke:#C2185B
    
    class P1,P2,P3,P4 pages
    class C1,C2,C3,C4 components
    class U1,U2,U3,U4 ui
    class S1,S2 stores
```

## 🚀 Guide d'installation

### Prérequis système

- **Node.js** : v18.0.0 ou supérieur (recommandé : v20.x LTS)
- **pnpm** : v8.0.0 ou supérieur
- **Git** : v2.25.0 ou supérieur
- **PostgreSQL** : v14.0 ou supérieur (si installation locale)

### Installation pas à pas

1. **Cloner le repository**
   ```bash
   git clone git@github.com:Huor97/faverton-app.git
   cd faverton-nuxt3
   ```

Installer les dépendances
```bash
 pnpm install
```

Configuration de l'environnement

 Créer un fichier .env à la racine du projet :
```bash
 cp .env.example .env
```

Configurer les variables d'environnement (voir section suivante)


Lancer le serveur de développement

 pnpm run dev
 L'application sera accessible sur http://localhost:3000


### 🔧 Configuration et variables d'environnement
Variables requises Créez un fichier .env avec les variables suivantes :
```bash
# ===== Configuration Supabase =====
# URL de votre instance Supabase (obtenue depuis le dashboard Supabase)
NUXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co

# Clé anonyme publique pour l'accès côté client
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clé de service pour les opérations côté serveur (garder secrète!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== Configuration APIs externes =====
# Endpoint de l'API JRC pour les données solaires
JRC_API_ENDPOINT=https://re.jrc.ec.europa.eu/api/v5_3/PVcalc

# API de géocodage (nouvelle version)
GEOCODING_API_URL=https://data.geopf.fr/geocodage/search

# ===== Configuration application =====
# Mode de l'application (development, production)
NODE_ENV=development

# URL de base de l'application
NUXT_PUBLIC_APP_URL=http://localhost:3000

# ===== Configuration optionnelle =====
# Cloudinary pour l'optimisation d'images (optionnel)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
```

### Obtenir les clés Supabase
1. Créez un compte sur supabase.com
2. Créez un nouveau projet
3. Dans Settings > API, copiez :
- `URL → NUXT_PUBLIC_SUPABASE_URL`
- `anon public → NUXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role → SUPABASE_SERVICE_ROLE_KEY`

## 📦 Déploiement
### Déploiement local (production)
```bash
# Build de l'application
pnpm run build
```
```bash
# Preview local du build de production
pnpm run preview
```

### Déploiement avec Docker
```bash
# Build de l'image Docker
docker build -t faverton-app .
```
```bash
# Lancer le conteneur
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_SUPABASE_URL=your_url \
  -e NUXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  faverton-app
```

#### Configuration Docker multi-stage
Le Dockerfile utilise une approche multi-stage pour optimiser la taille de l'image :
```bash
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN npm i -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
```

```bash
# Stage 2: Build
FROM node:18-alpine AS builder
RUN npm i -g pnpm
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build
```

```bash
# Stage 3: Production
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### Déploiement sur Vercel (recommandé)
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans le dashboard Vercel
3. Déploiement automatique à chaque push sur `main`

### Déploiement statique (SSG)
Pour générer une version statique :
```bash
pnpm run generate
```
Les fichiers statiques seront dans le dossier `.output/public/`

## 🧪 Tests
```bash
# Lancer les tests unitaires
pnpm run test
```
```bash
# Lancer les tests avec coverage
pnpm run test:coverage
```
```bash
# Tests en mode watch
pnpm run test:watch
```

## 📚 Documentation

- Documentation technique complète : `/docs`
- Documentation API : Commentaires inline dans `/server/api/`
- Types TypeScript : `/app/types/` et `/server/types/`

## 🛣️ Roadmap
### Phase 1 - MVP (✅ Complété)
- [x] Architecture Nuxt 3 avec TypeScript
- [x] Intégration API JRC Europa
- [x] Cartographie interactive avec Leaflet
- [x] Calculs de rendement énergétique
- [x] Authentification Supabase
- [x] Historique des simulations
- [x] Interface responsive
### Phase 2 - Optimisations (🔄 En cours)
- [ ] Tests unitaires complets
- [ ] Optimisation des performances
- [ ] Mode hors ligne (PWA)
- [ ] Export PDF des résultats
### Phase 3 - Fonctionnalités avancées (🎯 Planifié)
- [ ] Comparaison multi-scénarios
- [ ] Prise en compte de l'ombrage
- [ ] Types de panneaux étendus
- [ ] API publique

## 📄 Licence
Ce projet est sous licence MIT.

## 📨 Contact
- [GitHub](https://github.com/Huor97)
- [LinkedIn](https://www.linkedin.com/in/rouhkarimi/)

Développé avec 💚 pour la transition écologique

## Licence
This software is published under the [MIT License](https://github.com/Huor97/faverton-app?tab=MIT-1-ov-file).