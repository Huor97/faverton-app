const articlesDatabase: Article[] = [
  {
    id: `green-energy`,
    slug: `green-energy`,
    metadata: {
      title: `Produire Son Énergie Solaire`,
      summary: `Découvrez comment transformer vos surfaces inexploitées en source de revenus durables grâce au photovoltaïque.`,
      heroImage: `/images/articles/green-energy/hero.jpg`,
      publishDate: `2025-06-10`,
      readTime: `5 min`,
      category: `renewable-energy`,
    },
    sections: [
      {
        type: `hero`,
        title: `Produire Son Énergie Solaire`,
        subtitle: `Transformer vos surfaces en revenus durables`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749565438/panneaux-solaires-sur-le-toit-cellule-photovoltaique_hq3kwu.jpg`,
        animation: `fadeInUp`,
      },
      {
        type: `intro`,
        content: `En tant qu'agriculteur, vous disposez d'espaces qui peuvent générer des revenus complémentaires tout en participant à la transition énergétique.`,
        image: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749566484/2149232263_emfk35.jpg`,
        imagePosition: `right`,
        animation: `slideInFromRight`,
      },
      {
        type: `benefits`,
        title: `Notre approche s'appuie sur :`,
        items: [
          {
            title: `L'autoconsommation`,
            description: `Réduisez vos factures d'électricité jusqu'à 70%`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749585878/solar-house_8253956_yz369j.png`,
          },
          {
            title: `La revente EDF`,
            description: `Bénéficiez d'un tarif garanti pendant 20 ans`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749586124/sun_915204_lh0sbk.png`,
          },
          {
            title: `L'optimisation fiscale`,
            description: `Profitez des aides gouvernementales`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749586366/idea_1613114_1_vijhgh.png`,
          },
        ],
        animation: `scaleIn`,
      },
      {
        type: `statistics`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749566971/124634_mi8jwt.jpg`,
        stats: [
          {
            value: `22%`,
            label: `de rendement`,
            description: `Panneaux dernière génération`,
          },
          {
            value: `15-20k`,
            label: `kWh/an`,
            description: `Production pour 100m²`,
          },
          {
            value: `2500-3500€`,
            label: `revenus annuels`,
            description: `Potentiel de gains`,
          },
        ],
        animation: `countUp`,
      },
    ],
  },
  {
    id: `organic-waste-recycling`,
    slug: `organic-waste-recycling`,
    metadata: {
      title: `Économiser l'Eau, Préserver l'Avenir`,
      summary: `Solutions concrètes pour réduire votre consommation d'eau et valoriser chaque goutte sur votre exploitation.`,
      heroImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629243/13811_fnigbl.jpg`,
      publishDate: `2024-01-15`,
      readTime: `4 min`,
      category: `water-management`,
    },
    sections: [
      {
        type: `hero`,
        title: `Économiser l'Eau, Préserver l'Avenir`,
        subtitle: `Solutions concrètes pour une gestion raisonnée`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629243/13811_fnigbl.jpg`,
        animation: `fadeInUp`,
      },
      {
        type: `intro`,
        content: `La gestion raisonnée de l'eau est devenue cruciale face aux sécheresses répétées. Nos recommandations incluent la récupération des eaux pluviales, l'irrigation de précision, les bassins de rétention et la phytoépuration.`,
        image: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629362/2151896727_vmkvbk.jpg`,
        imagePosition: `left`,
        animation: `slideInFromLeft`,
      },
      {
        type: `benefits`,
        title: `Nos recommandations :`,
        items: [
          {
            title: `Récupération des eaux pluviales`,
            description: `Installer des cuves de stockage pour l'irrigation`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749587679/recuperation-des-eaux-pluviales_gbqwcn.png`,
          },
          {
            title: `Irrigation de précision`,
            description: `Systèmes goutte-à-goutte réduisant la consommation de 40%`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749587820/cycle-de-leau_oxctyk.png`,
          },
          {
            title: `Bassins de rétention`,
            description: `Créer des réserves naturelles favorisant la biodiversité`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749587991/bassin-versant_g9netw.png`,
          },
          {
            title: `Phytoépuration`,
            description: `Traiter naturellement les eaux usées de l'exploitation`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749588284/smart-farm_bcryvi.png`,
          },
        ],
        animation: `scaleIn`,
      },
      {
        type: `statistics`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749566971/124634_mi8jwt.jpg`,
        stats: [
          {
            value: `40%`,
            label: `d'économie d'eau`,
            description: `Avec l'irrigation de précision`,
          },
          {
            value: `60%`,
            label: `de récupération`,
            description: `Des eaux pluviales possibles`,
          },
          {
            value: `80%`,
            label: `de traitement naturel`,
            description: `Efficacité de la phytoépuration`,
          },
        ],
        animation: `countUp`,
      },
    ],
  },
  {
    id: `sustainable-farming`,
    slug: `sustainable-farming`,
    metadata: {
      title: `Cultiver Autrement, Récolter Mieux`,
      summary: `Techniques innovantes pour une agriculture productive et respectueuse de l'environnement.`,
      heroImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749568000/sustainable-farming-hero.jpg`,
      publishDate: `2024-01-20`,
      readTime: `6 min`,
      category: `sustainable-farming`,
    },
    sections: [
      {
        type: `hero`,
        title: `Cultiver Autrement, Récolter Mieux`,
        subtitle: `Techniques innovantes pour une agriculture durable`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629473/2151261184_j6xwbl.jpg`,
        animation: `fadeInUp`,
      },
      {
        type: `intro`,
        content: `L'agriculture durable n'est plus une option mais une nécessité économique et environnementale. Nos méthodes incluent l'agroforesterie, la rotation des cultures, les engrais verts et la lutte biologique.`,
        image: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629661/91057_vgirhk.jpg`,
        imagePosition: `right`,
        animation: `slideInFromRight`,
      },
      {
        type: `benefits`,
        title: `Nos méthodes validées par l'INRAE :`,
        items: [
          {
            title: `Agroforesterie`,
            description: `Associer arbres et cultures pour améliorer les rendements`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749592506/community-garden_ojkxvb.png`,
          },
          {
            title: `Rotation des cultures`,
            description: `Préserver la fertilité naturelle des sols`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749592629/plant_ymlar1.png`,
          },
          {
            title: `Engrais verts`,
            description: `Enrichir naturellement vos terres`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749592847/growing-seed_mav638.png`,
          },
          {
            title: `Lutte biologique`,
            description: `Réduire l'usage de pesticides de 80%`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749592968/growth_la1bwp.png`,
          },
        ],
        animation: `scaleIn`,
      },
    ],
  },
  {
    id: `training`,
    slug: `education-workshops`,
    metadata: {
      title: `Se Former pour Mieux Produire`,
      summary: `Ateliers pratiques et formations certifiantes pour maîtriser les nouvelles pratiques agricoles.`,
      heroImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629979/10389_amkurg.jpg`,
      publishDate: `2024-02-01`,
      readTime: `4 min`,
      category: `training`,
    },
    sections: [
      {
        type: `hero`,
        title: `Se Former pour Mieux Produire`,
        subtitle: `Formations certifiantes et ateliers pratiques`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749629979/10389_amkurg.jpg`,
        animation: `fadeInUp`,
      },
      {
        type: `intro`,
        content: `La transition écologique passe par le partage des connaissances. Nous proposons des formations pour agriculteurs et sensibilisation pour le grand public.`,
        image: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630068/2151205676_h2rhew.jpg`,
        imagePosition: `left`,
        animation: `slideInFromLeft`,
      },
      {
        type: `benefits`,
        title: `Nos programmes de formation :`,
        items: [
          {
            title: `Formations certifiantes`,
            description: `Agriculture biologique financée VIVEA`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749593189/organic_pa8vtn.png`,
          },
          {
            title: `Ateliers pratiques`,
            description: `Énergies renouvelables sur le terrain`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749593453/practice_gyivp0.png`,
          },
          {
            title: `Visites pédagogiques`,
            description: `Fermes en transition pour le grand public`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630155/tourism_zqolo9.png`,
          },
        ],
        animation: `scaleIn`,
      },
    ],
  },
  {
    id: `local-food`,
    slug: `restaurants-cultural-activities`,
    metadata: {
      title: `Du Champ à l'Assiette`,
      summary: `Valorisez vos produits en circuit court et créez du lien avec les consommateurs locaux.`,
      heroImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630276/2148579742_pr2sdf.jpg`,
      publishDate: `2024-02-10`,
      readTime: `5 min`,
      category: `local-food`,
    },
    sections: [
      {
        type: `hero`,
        title: `Du Champ à l'Assiette`,
        subtitle: `Circuit court et vente directe`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630276/2148579742_pr2sdf.jpg`,
        animation: `fadeInUp`,
      },
      {
        type: `intro`,
        content: `La vente directe et la restauration à la ferme offrent de nouvelles perspectives économiques tout en valorisant votre savoir-faire.`,
        image: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749632699/16533_wwg2dm.jpg`,
        imagePosition: `right`,
        animation: `slideInFromRight`,
      },
      {
        type: `benefits`,
        title: `Nos solutions de valorisation :`,
        items: [
          {
            title: `Marché à la ferme`,
            description: `Vente directe tous les vendredis`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630621/tourism_1_oiz6dj.png`,
          },
          {
            title: `Table d'hôtes`,
            description: `Repas gastronomiques avec vos produits`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749632697/hotel_ibmxix.png`,
          },
          {
            title: `Paniers hebdomadaires`,
            description: `Fidélisez une clientèle locale`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749632695/basket_gjyxoi.png`,
          },
        ],
        animation: `scaleIn`,
      },
      {
        type: `statistics`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749632487/_banni%C3%A8res_Twitter_rouh_smcdhz.png`,
        stats: [
          {
            value: `30%`,
            label: `de revenus supplémentaires`,
            description: `Potentiel de diversification`,
          },
          {
            value: `85%`,
            label: `de satisfaction client`,
            description: `Circuit court apprécié`,
          },
          {
            value: `50%`,
            label: `de marge améliorée`,
            description: `Vente directe vs intermédiaires`,
          },
        ],
        animation: `countUp`,
      },
    ],
  },
  {
    id: `eco-hosting`,
    slug: `eco-hosting`,
    metadata: {
      title: `Accueillir en Harmonie avec la Nature`,
      summary: `Développez l'agrotourisme avec des hébergements respectueux de l'environnement.`,
      heroImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630710/32392_fzkwbo.jpg`,
      publishDate: `2024-02-15`,
      readTime: `6 min`,
      category: `eco-hosting`,
    },
    sections: [
      {
        type: `hero`,
        title: `Accueillir en Harmonie avec la Nature`,
        subtitle: `Agrotourisme et hébergements écologiques`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630710/32392_fzkwbo.jpg`,
        animation: `fadeInUp`,
      },
      {
        type: `intro`,
        content: `L'agrotourisme représente une opportunité de diversification rentable avec 15 millions de Français pratiquant le tourisme vert.`,
        image: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749630793/2148195132_sihece.jpg`,
        imagePosition: `left`,
        animation: `slideInFromLeft`,
      },
      {
        type: `benefits`,
        title: `Nos solutions d'hébergement :`,
        items: [
          {
            title: `Gîtes écologiques`,
            description: `Hébergements autonomes en énergie`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749631040/lodge_p4mb2x.png`,
          },
          {
            title: `Camping à la ferme`,
            description: `Emplacements nature avec sanitaires éco-conçus`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749631072/picnic_thw8jj.png`,
          },
          {
            title: `Chambres d'hôtes`,
            description: `Accueil personnalisé et petit-déjeuner fermier`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749631097/key_wazyn4.png`,
          },
          {
            title: `Séminaires verts`,
            description: `Location d'espaces pour entreprises engagées`,
            icon: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749631105/training_nkse9s.png`,
          },
        ],
        animation: `scaleIn`,
      },
      {
        type: `statistics`,
        backgroundImage: `https://res.cloudinary.com/dizwmnpet/image/upload/v1749631364/oilseed-rape-5263591_1920_b0klqh.jpg`,
        stats: [
          {
            value: `15-40k€`,
            label: `revenus annuels`,
            description: `Potentiel agrotourisme`,
          },
          {
            value: `15M`,
            label: `français`,
            description: `Pratiquent le tourisme vert`,
          },
          {
            value: `70%`,
            label: `taux d'occupation`,
            description: `Moyenne hébergements verts`,
          },
        ],
        animation: `countUp`,
      },
    ],
  },
];

export function useArticles() {
  const getArticleBySlug = (slug: string): Article | undefined => {
    return articlesDatabase.find(article => article.slug === slug);
  };

  const getAllArticles = (): Article[] => {
    return articlesDatabase;
  };

  return {
    getArticleBySlug,
    getAllArticles,
  };
}
