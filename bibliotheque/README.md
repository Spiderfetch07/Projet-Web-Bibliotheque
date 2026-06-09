# Projet Bibliothèque — Programmation Web EPITA 2025-2026

## Auteurs

- COQUELLE Maëlie — maelie.coquelle@epita.fr
- BIDELOGNE Lorélyne — lorelyne.bidelogne@epita.fr

---

## Présentation

Application web de gestion de bibliothèque (frontend + backend) permettant de consulter, créer et modifier des livres et des auteurs.

---

## Lancement du projet

### Prérequis

- Node.js
- npm

### Installation et démarrage

```bash
cd back
npm install
npm start
```

Le serveur démarre sur **http://localhost:7542**

> Le frontend est servi directement par le backend, aucune commande supplémentaire n'est nécessaire.

### Identifiants de connexion

| Login | Mot de passe|
|-------|-------------|
| admin | password    |

---

## Structure du projet

```
├── README.md
├── back/                        # Serveur Node.js / Express
│   ├── index.js                 # Point d'entrée
│   ├── package.json
│   ├── package-lock.json
│   ├── data/
│   │   ├── books.json           # Base de données des livres
│   │   └── authors.json         # Base de données des auteurs
│   └── src/
│       ├── core/
│       │   ├── Database.js      # Lecture et écriture des fichiers JSON
│       │   └── ServerHttp.js    # Serveur Express + routage API
│       ├── models/
│       │   ├── BookModel.js     # Opérations sur les livres
│       │   └── AuthorModel.js   # Opérations sur les auteurs
│       └── controllers/
│           ├── AuthController.js        # Authentification
│           ├── BookController.js        # CRUD livres
│           ├── AuthorController.js      # CRUD auteurs
│           └── DashboardController.js   # Statistiques
│
└── front/                       # Interface utilisateur
    ├── index.html               # Page HTML racine
    └── public/
        ├── css/
        │   └── styles.css       # Styles globaux
        ├── js/
        │   ├── lib.js           # Framework Import() fourni
        │   ├── index.js         # Point d'entrée frontend
        │   ├── com/             # Composants réutilisables
        │   │   ├── Api.js       # Appels HTTP vers le backend
        │   │   ├── Auth.js      # Gestion session (sessionStorage)
        │   │   ├── Router.js    # Navigation entre pages
        │   │   └── Sidebar.js   # Menu latéral
        │   └── pages/           # Pages de l'application
        │       ├── Login.js
        │       ├── Dashboard.js
        │       ├── SearchBook.js
        │       ├── SearchAuthor.js
        │       ├── AddBook.js
        │       ├── AddAuthor.js
        │       ├── EditBook.js
        │       └── EditAuthor.js
        └── html/                # Templates HTML
            ├── layout.html      # Structure générale de la page
            ├── com/
            │   └── sidebar.html # Template du menu latéral
            └── pages/
                ├── login.html
                ├── dashboard.html
                ├── search-book.html
                ├── search-author.html
                ├── add-book.html
                ├── add-author.html
                ├── edit-book.html
                └── edit-author.html
```

---

## Architecture

### Backend — Model-Core-Controller

- **Core** (`Database.js`, `ServerHttp.js`) : couche infrastructure, lecture/écriture JSON, routage HTTP
- **Models** : logique métier et accès aux données
- **Controllers** : traitement des requêtes, appel des models, retour des réponses

### API REST

| Méthode | Route               | Description                     |
|---------|---------------------|---------------------------------|
| POST    | `/api/login/`       | Authentification                |
| GET     | `/api/dashboard/`   | Statistiques globales           |
| GET     | `/api/book/`        | Liste ou recherche de livres    |
| GET     | `/api/book/?id=X`   | Détail d'un livre               |
| POST    | `/api/book/`        | Créer un livre                  |
| PUT     | `/api/book/?id=X`   | Modifier un livre               |
| GET     | `/api/author/`      | Liste ou recherche d'auteurs    |
| GET     | `/api/author/?id=X` | Détail d'un auteur + ses livres |
| POST    | `/api/author/`      | Créer un auteur                 |
| PUT     | `/api/author/?id=X` | Modifier un auteur              |

### Frontend — Framework `Import()`

Le frontend utilise le système de modules `Import()` fourni (`lib.js`) qui charge les fichiers JS et HTML de manière asynchrone. Chaque page et composant est une classe instanciée avec son nœud DOM.

---

## Fonctionnalités

- Connexion sécurisée (identifiant + mot de passe)
- Tableau de bord avec chiffres clés (livres, auteurs, emprunts)
- Recherche de livres par nom avec filtrage
- Recherche d'auteurs par nom avec filtrage
- Création d'un livre (titre, auteur, statut)
- Création d'un auteur
- Modification d'un livre
- Modification d'un auteur avec liste de ses livres
- Navigation entre pages via sidebar
