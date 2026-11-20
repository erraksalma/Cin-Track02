#  CinéTrack V2

##  Présentation du projet

CinéTrack V2 est une application web de découverte et de gestion de films et de séries. Elle permet aux utilisateurs de parcourir un catalogue de contenus, de rechercher leurs films et séries préférés, de consulter leurs détails, de gérer leurs favoris et de partager leurs avis à travers un système de commentaires.

Cette deuxième version apporte également un espace d'administration permettant de gérer dynamiquement le catalogue grâce aux opérations CRUD (Create, Read, Update, Delete).

##  Fonctionnalités

###  1. Page utilisateur

- Affichage dynamique des films et des séries depuis une API.
- Recherche de contenus par titre.
- Filtrage des contenus selon leur type : films ou séries.
- Pagination du catalogue.
- Consultation des détails d'un film ou d'une série.
- Ajout et suppression des contenus dans les favoris.
- Sauvegarde des favoris avec `localStorage`.
- Ajout de commentaires sur les contenus.
- Consultation des commentaires associés aux films et aux séries.

###  2. Page administration

Un espace dédié à l'administration permet de gérer le catalogue des contenus.

- Affichage de la liste des films et des séries.
- Ajout de nouveaux contenus.
- Modification des contenus existants.
- Suppression des contenus.
- Gestion des champs selon le type de contenu :
  - **Film :** titre, description, genre, année, image et durée.
  - **Série :** titre, description, genre, année, image et nombre de saisons.
- Validation des formulaires avant l'envoi des données.
- Mise à jour des données via les requêtes API.

###  3. Gestion des données et API

- Communication avec MockAPI à l'aide de `fetch`.
- Utilisation de `async/await` pour gérer les opérations asynchrones.
- Gestion des erreurs avec `try...catch`.
- Séparation de la logique API et de la logique d'affichage.
- Utilisation de `localStorage` pour conserver les favoris.

##  Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS
- MockAPI
- Fetch API
- Async/Await
- DOM Manipulation
- ES Modules
- LocalStorage
- Git & GitHub

##  Structure du projet

```text
Cin-Track02/
│
├── index.html              # Page utilisateur
├── admin.html              # Page administration
│
├── css/
│   ├── input.css
│   └── output.css
│
├── js/
│   ├── api.js              # Gestion des requêtes API
│   ├── main.js             # Logique principale utilisateur
│   ├── admin.js            # Logique de la page administration
│   └── render.js           # Affichage des contenus
│
└── img/
    └── images/             # Images et ressources
```

##  Réalisation

Projet réalisé dans le cadre de la formation en développement web à **YouCode – UM6P**.

Découvrez CinéTrack V2 : https://cintrack02.vercel.app/
---

