---
name: IziFacture Design System
description: Règles de design obligatoires pour la création et la modification de composants UI afin de garantir une cohérence parfaite avec les pages Dashboard et Factures.
---

# IziFacture Design System

Tu DOIS impérativement suivre ces règles de design pour TOUS les nouveaux composants et toutes les modifications d'interface dans le projet IziFacture.

## 1. Formes, Bordures et Ombres (Style "Soft & Modern")
- **Rayons de bordure (Border Radius)** : Utilise des arrondis généreux pour un look moderne et "SaaS pro".
  - Conteneurs principaux / Cartes : `rounded-3xl`.
  - Éléments internes (Boutons, Inputs, petites cartes) : `rounded-2xl` ou `rounded-xl`.
  - Badges et conteneurs d'icônes : `rounded-full`.
- **Cartes** : Utilise `bg-white shadow-sm border-none`. Évite les bordures dures (`border`), préfère les ombres douces ou des séparateurs discrets (`divide-y divide-slate-100`).

## 2. Couleurs et Typographie
- **Fonds (Backgrounds)** : `bg-slate-50` pour le fond principal de l'application, `bg-white` pour les cartes.
- **Accents (Primary/Headers)** : `bg-slate-950` pour les en-têtes de grilles ou éléments très contrastés. `bg-violet-600` pour les boutons d'action principale.
- **Textes** : `text-slate-900` pour les titres et textes principaux, `text-slate-500` pour les textes secondaires, labels et icônes.
- **Polices** : Utilise `font-semibold` pour les grands titres, et `font-medium` pour les labels et sous-titres.

## 3. Animations et Micro-Interactions ("Pro & User-friendly")
- **Survol (Hover)** : Tous les éléments cliquables (cartes, boutons, lignes de tableau) DOIVENT avoir une animation fluide.
- **Transitions standard** : Ajoute systématiquement `transition-all duration-300 ease-in-out`.
- **Effet de flottaison (Cartes cliquables)** : `hover:-translate-y-1 hover:shadow-md`.
- **Effet de clic (Active)** : `active:scale-[0.98]` pour donner un retour tactile.
- **Group Hover** : Utilise `group` sur le parent et `group-hover:text-violet-600` ou `group-hover:bg-slate-50` pour animer les enfants (icônes, textes) au survol de la carte.

## 4. Layout et Espacements
- **Conteneur de page** : `max-w-[1200px] mx-auto` pour limiter la largeur sur les très grands écrans.
- **Marges (Gaps)** : Utilise des espacements généreux pour laisser respirer le contenu (`gap-8` pour les blocs principaux, `gap-6` ou `space-y-6` pour l'intérieur des cartes).
- **Flexbox anti-débordement** : Ajoute TOUJOURS `min-w-0` sur les enfants `flex-1` pour empêcher le contenu de forcer la largeur du conteneur parent.

## 5. Responsivité, Tableaux et Grilles
- **RÈGLE D'OR : ZÉRO SCROLL HORIZONTAL.** L'interface ne doit jamais forcer l'utilisateur à scroller horizontalement.
- **Mise en page des listes / données (Data Lists)** :
  - **Grands écrans (`hidden md:block`)** : Utilise TOUJOURS la **CSS Grid** (ex: `grid-cols-[3fr_1fr_1.5fr]`) au lieu des balises HTML `<Table>` (`table-layout`). La grille empêche le chevauchement des inputs et garantit des largeurs proportionnelles strictes.
  - **Petits écrans (`md:hidden`)** : Utilise des **Piles de cartes** (`flex flex-col divide-y divide-slate-100`) pour afficher chaque ligne de donnée sous forme de carte individuelle.
- **Mise en page avec Sidebar** : Si une page contient une barre latérale de paramètres (`w-80`), place-la à côté des informations d'en-tête, mais libère l'espace en dessous pour que la grille de données prenne **100% de la largeur** de l'écran.
