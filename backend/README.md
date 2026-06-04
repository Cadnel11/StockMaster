# 📦 StockMaster - Backend API

API REST complète pour la gestion d'inventaire d'un petit magasin.

## 🚀 Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des données

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🔧 Installation

### 1. Installer les dépendances
```bash
npm install


2. Configurer les variables d'environnement

Créez un fichier .env à la racine :

PORT=5030
MONGO_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=stockmaster_super_secret_key_2026
JWT_EXPIRE=7h
BCRYPT_ROUNDS=10


3. Démarrer le serveur

# Mode développement (avec nodemon)
npm run dev

Le serveur tourne sur http://localhost:5030

🗂️ Architecture du projet




backend/
├── src/
│   ├── config/
│   │   └── database.js      # Connexion MongoDB
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middlewares/
│   │   └── auth.js           # JWT + Rôles
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── StockMovement.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   └── itemService.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── itemValidator.js
│   └── app.js
├── .env
├── package.json
└── README.md


📡 Endpoints API

Authentification


Méthode	Endpoint	        Description	         Accès
POST	/api/auth/register	Inscription	         Public
POST	/api/auth/login	    Connexion	           Public
GET	/api/auth/profile	   Profil utilisateur	   Privé



Articles (Items)




Méthode	     Endpoint	                           Description	                      Rôle requis
GET	         /api/items	                        Lister tous les articles	          Admin/Employé
GET	         /api/items/:id                     Détails d'un article	              Admin/Employé
GET	         /api/items/:id/history	             Historique des mouvements	        Admin/Employé
POST	      /api/items	                         Créer un article	                  Admin
PUT	        /api/items/:id	                     Modifier un article	              Admin
DELETE	    /api/items/:id	                     Supprimer un article	              Admin
PATCH	      /api/items/:id/add	                 Ajouter du stock	                  Admin/Employé
PATCH	      /api/items/:id/remove	               Retirer du stock	                  Admin/Employé



🔐 Authentification

Pour accéder aux routes protégées, incluez le token JWT dans le header :

Authorization: Bearer <votre_token>


👥 Rôles et permissions



Action	                   Admin	               Employé
Consulter les articles	    ✅	                    ✅
Voir l'historique         	✅	                    ✅
Ajouter/Retirer du stock	  ✅	                    ✅
Créer un article	          ✅	                    ❌
Modifier un article	        ✅	                    ❌
Supprimer un article	      ✅	                    ❌




🧪 Exemples de requêtes Postman

1. Inscription

POST http://localhost:5030/api/auth/register
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@exemple.com",
  "password": "123456",
  "role": "employe"
}


2. Connexion

POST http://localhost:5030/api/auth/login
Content-Type: application/json

{
  "email": "jean@exemple.com",
  "password": "123456"
}


Réponse :


{
  "status": "success",
  "message": "Connexion réussie",
  "data": {
    "id": "...",
    "name": "Jean Dupont",
    "email": "jean@exemple.com",
    "role": "employe",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}


3. Créer un article (Admin uniquement)

POST http://localhost:5030/api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ordinateur Portable",
  "quantity": 10,
  "price": 799.99,
  "category": "Informatique"
}


4. Lister tous les articles

GET http://localhost:5030/api/items
Authorization: Bearer <token>


5. Ajouter du stock



PATCH http://localhost:5030/api/items/:id/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}


6. Retirer du stock


PATCH http://localhost:5030/api/items/:id/remove
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}



7. Modifier un article (Admin uniquement)


PUT http://localhost:5030/api/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop HP EliteBook",
  "quantity": 20,
  "price": 849.99,
  "category": "Informatique"
}



8. Supprimer un article (Admin uniquement)


DELETE http://localhost:5030/api/items/:id
Authorization: Bearer <token>


9. Voir l'historique d'un article

GET http://localhost:5030/api/items/:id/history
Authorization: Bearer <token>


10. Voir son profil


GET http://localhost:5030/api/auth/profile
Authorization: Bearer <token>







📊 Modèles de données
User
Champ	                Type	               Contrainte
name	                String	              Requis
email	                String	            Unique, requis
password	            String	            Haché, requis
role	                String	         'admin' ou 'employe'



Item
Champ	                 Type	                Contrainte
name	                String	               Requis
quantity	            Number	               Min: 0
price	                Number	               Min: 0
category	            String	               Requis
createdBy          	  ObjectId	          Référence User


StockMovement
Champ	                 Type	                Contrainte
itemId	              ObjectId	          Référence Item
userId	              ObjectId	          Référence User
type	                String	           'add' ou 'remove'
quantity	            Number	               Min: 1
previousQuantity    	Number	                  -
newQuantity	          Number	                  -


✅ Tests avec Postman

    Créez une nouvelle collection "StockMaster"

    Ajoutez une requête Register (POST /api/auth/register)

    Ajoutez une requête Login (POST /api/auth/login)

    Copiez le token reçu

    Ajoutez une variable d'environnement token

    Testez les routes protégées avec Bearer {{token}}


    🐛 Dépannage
MongoDB ne se connecte pas


# Démarrer MongoDB (Windows)
net start MongoDB

# Ou lancer manuellement
mongod --dbpath C:\data\db

# Vérifier l'URI
mongodb://localhost:27017/stockmaster


Port déjà utilisé


# Changer le port dans .env
PORT=5031



📝 Scripts                        disponibles
Commande	                         Description
npm run dev	                       Lance le serveur en mode développement (nodemon)
npm start	                         Lance le serveur en mode production
