# MovieBooker API

API de réservation de films utilisant NestJS, Prisma et l'API TMDB.

## Table des matières

- [Authentification](#authentification)
- [Films](#films)
- [Réservations](#réservations)

## Configuration

1. Créez un fichier `.env` avec les variables suivantes :

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/MovieBooker"
JWT_SECRET="votre_secret_jwt"
TMDB_API_KEY="votre_clé_api_tmdb"
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez les migrations Prisma :

```bash
npx prisma migrate dev
```

4. Démarrez le serveur :

```bash
npm run start:dev
```

L'API sera disponible sur `http://localhost:3000` et la documentation Swagger sur `http://localhost:3000/api`.

## Authentification

### Inscription

```http
POST /auth/register
```

Créez un nouveau compte utilisateur.

**Corps de la requête :**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Connexion

```http
POST /auth/login
```

Connectez-vous pour obtenir un token JWT.

**Corps de la requête :**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**

```json
{
  "access_token": "eyJhbGciOiJ..."
}
```

⚠️ Le token expire après 240 secondes. Vous devrez vous reconnecter après expiration.

## Films

Toutes les routes de films sont publiques et ne nécessitent pas d'authentification.

### Films à l'affiche

```http
GET /movies/now-playing?page=1
```

### Rechercher un film

```http
GET /movies/search?title=Matrix
```

### Détails d'un film

```http
GET /movies/movie/:id
```

### Liste des genres

```http
GET /movies/genres
```

### Liste des films populaires

```http
GET /movies/movies?page=1&search=optional
```

## Réservations

Toutes les routes de réservation nécessitent une authentification. Incluez le token JWT dans l'en-tête :

```http
Authorization: votre_token_jwt
```

### Créer une réservation

```http
POST /reservations
```

**Corps de la requête :**

```json
{
  "movieId": 550,
  "startTime": "2024-03-20T15:00:00Z"
}
```

**Notes :**

- La durée du film est automatiquement fixée à 2 heures
- Vous ne pouvez pas avoir deux réservations qui se chevauchent
- Le `movieId` doit correspondre à un film existant dans TMDB

### Consulter mes réservations

```http
GET /reservations
```

Retourne la liste de toutes vos réservations actives.

### Annuler une réservation

```http
DELETE /reservations/:id
```

Annule une réservation spécifique. Vous ne pouvez annuler que vos propres réservations.

## Modèles de données

### User

```prisma
model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  password     String
  createdAt    DateTime      @default(now())
  reservations Reservation[]
}
```

### Reservation

```prisma
model Reservation {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
  movieId    Int
  movieTitle String
  startTime  DateTime
  endTime    DateTime
  createdAt  DateTime @default(now())
  @@index([userId, startTime])
}
```
