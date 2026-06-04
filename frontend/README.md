
# 🎨 StockMaster - Frontend

Interface utilisateur moderne pour la gestion d'inventaire.

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état légère
- **Axios** - Requêtes HTTP
- **React Router DOM** - Navigation

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- Backend StockMaster en cours d'exécution (port 5030)

## 🔧 Installation

### 1. Installer les dépendances
```bash
npm install


2. Configurer les variables d'environnement

Créez un fichier .env à la racine :

VITE_API_URL=http://localhost:5030/api

3. Démarrer l'application

# Mode développement
npm run dev


L'application tourne sur http://localhost:5173

🗂️ Architecture du projet


frontend/
├── src/
│   ├── components/
│   │   ├── Button.jsx        # Bouton réutilisable
│   │   ├── Input.jsx         # Champ de saisie
│   │   ├── Card.jsx          # Carte générique
│   │   ├── Alert.jsx         # Messages d'alerte
│   │   ├── Navbar.jsx        # Barre de navigation
│   │   └── ArticleCard.jsx   # Carte d'article
│   ├── pages/
│   │   ├── Login.jsx         # Page connexion
│   │   ├── Register.jsx      # Page inscription
│   │   └── Dashboard.jsx     # Tableau de bord
│   ├── store/
│   │   ├── authStore.js      # État authentification
│   │   └── itemStore.js      # État articles
│   ├── services/
│   │   └── api.js            # Configuration Axios
│   ├── layouts/
│   │   └── Layout.jsx        # Layout principal
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md




🎯 Pages et routes



Page	                   URL	             Description	             Protection
Connexion	             /login	          Formulaire de connexion	      Public
Inscription	          /register       	Formulaire d'inscription	    Public
Dashboard	           /dashboard	        Gestion des stocks	          Privé
Accueil           	    /	              Redirige vers dashboard       	-



🔐 Rôles et permissions (UI)




Action	                               admin	                  Employé
Voir la liste des articles	            ✅	                       ✅
Ajouter/Retirer du stock              	✅	                       ✅
Créer un article	                      ✅	                       ❌
Modifier un article	                    ✅	                       ❌
Supprimer un article	                  ✅	                       ❌
Voir boutons admin	                    ✅	                       ❌



🎨 Composants réutilisables

Button

<Button variant="primary" onClick={handleClick}>
  Cliquez ici
</Button>


Variants : primary, secondary, danger, success, outline

Input

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errorMessage}
/>


Card


<Card title="Mon Titre">
  <p>Contenu de la carte</p>
</Card>


Alert

<Alert type="success" message="Opération réussie" onClose={handleClose} />

Types : success, error, warning, info



🔄 Gestion d'état (Zustand)

Auth Store (useAuthStore)

const { user, login, register, logout, isAuthenticated } = useAuthStore();

// Connexion
await login(email, password);

// Déconnexion
logout();


Items Store (useItemStore)

const { items, fetchItems, createItem, addStock, removeStock } = useItemStore();

// Charger les articles
useEffect(() => {
  fetchItems();
}, []);

// Ajouter du stock
await addStock(itemId, quantity);


🌐 Communication API


Toutes les requêtes utilisent Axios avec :

    Intercepteur : Ajoute automatiquement le token JWT

    Gestion erreurs 401 : Déconnexion automatique

    Base URL : Configurable via .env


    import api from '../services/api';

// Exemple
const response = await api.get('/items');
const newItem = await api.post('/items', data);


🧪 Tests manuels


1. Créer un compte Admin

    Allez sur http://localhost:5173/register

    Remplissez :

        Nom: Admin Test

        Email: admin@test.com

        Mot de passe: admin123

        Rôle: admin

    Cliquez sur "S'inscrire"

2. Créer un compte Employé

    Déconnectez-vous

    Allez sur /register

    Remplissez avec rôle employe

    Connectez-vous

3. Tester les différences

    Admin : Voit les boutons "Modifier" et "Supprimer"

    Employé : Ne voit que les boutons "Ajouter" et "Retirer"

4. Tester les alertes

    Créez un article avec quantité ≤ 5

    La carte devient jaune

    Ajoutez du stock > 5 → couleur normale

    Retirez tout le stock → carte rouge


   🐛 Dépannage
L'API ne répond pas

# Vérifier que le backend tourne
curl http://localhost:5030/api/health


Erreur CORS

    Vérifier que le backend a bien app.use(cors())

Token expiré

    L'application déconnecte automatiquement

    Redirection vers /login