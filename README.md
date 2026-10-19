# 🚀 IziFacture — Solution SaaS de Facturation Moderne

> **IziFacture** est une application SaaS de facturation intuitive, puissante et hautement personnalisable conçue pour les freelances, créateurs, indépendants et TPE/PME.

---

## ✨ Fonctionnalités Clés

- 🔐 **Authentification Multi-Tenant (Supabase Auth)** :
  - Inscription, connexion sécurisée et réinitialisation de session.
  - Isolation stricte des données grâce au **Row Level Security (RLS)** de PostgreSQL.
  - Déclencheur SQL automatique créant le profil d'entreprise dès l'inscription.

- 🧾 **Studio de Facturation Avancé** :
  - **10 Modèles Visuels de Factures** (Classique, Moderne, Minimaliste, Audacieux, Élégant, Sidebar, Corporate, Créatif, Compact, Tech).
  - Personnalisation dynamique des couleurs d'accentuation (7 palettes soignées).
  - Support multi-devises (`€`, `$`, `FCFA`).
  - Upload et hébergement du logo d'entreprise via **Supabase Storage**.
  - Rendu direct et impression / export PDF haute fidélité via `react-to-print`.

- 👥 **Gestion des Clients & Catalogue** :
  - CRUD complet des clients avec suivi du chiffre d'affaires cumulé en direct.
  - Catalogue d'articles (Services et Biens) avec gestion des prix unitaire et TVA.
  - Pré-remplissage intelligent lors de la création de factures.

- 📊 **Tableau de Bord & Indicateurs KPI** :
  - Chiffre d'affaires encaissé, factures en attente et factures en retard calculés en direct.
  - Suivi des dernières factures émises avec accès rapide aux aperçus PDF.

- ⚡ **Expérience Utilisateur Ultra-Fluide** :
  - Skeleton loaders haute fidélité sur toutes les pages et lors des transitions Next.js streaming (`loading.tsx`).
  - Interface soignée avec Tailwind CSS v4, Base UI et Lucide Icons.

---

## 🛠️ Stack Technique

- **Framework Web** : [Next.js 16 (App Router)](https://nextjs.org/) + React 19
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Base de Données & Auth** : [Supabase](https://supabase.com/) (PostgreSQL 17, RLS, Storage, Auth)
- **Styles** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants d'interface** : Primitives `@base-ui/react` & composants `shadcn`
- **Impression PDF** : `react-to-print`
- **Icônes** : `lucide-react`

---

## 🚀 Démarrage Rapide

### 1. Cloner le dépôt

```bash
git clone https://github.com/PDGYAONEWGIT/IziFacture.git
cd IziFacture
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet en vous basant sur `.env.example` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Rendez-vous ensuite sur [http://localhost:3000](http://localhost:3000) pour tester l'application.

---

## 📦 Scripts Disponibles

- `npm run dev` : Démarre le serveur local de développement avec Turbopack.
- `npm run build` : Compile le projet pour la production.
- `npm run start` : Démarre le serveur de production.
- `npm run lint` : Exécute ESLint pour vérifier la qualité du code.

---

## 📄 Licence

Projet privé développé pour **IziFacture**. Tous droits réservés.
