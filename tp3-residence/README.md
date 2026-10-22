## Locations de la résidence — TP4
 
Application web JavaScript structurée qui relie trois fichiers JSON
(customers, products, orders) pour afficher et filtrer des locations.
 
## Structure
tp3-residence/
  index.html, css/style.css
  data/  customers.json, products.json, orders.json
  js/    app.js, state.js, dataService.js, selectors.js, view.js
 
## Fonctionnalités
- Chargement de 3 fichiers JSON (fetch, async/await, try/catch)
- État central et rendu dynamique (init + render)
- Relations commande -> client -> produits par identifiants
- Calcul du montant de ligne, du total et de 6 indicateurs
- Recherche par client, filtres par statut et catégorie (combinés)
- Détail d'une commande dans un modal Bootstrap
- Gestion des erreurs de chargement
 
## Lancer le projet
1. Cloner le dépôt : git clone <URL_DU_DEPOT>
2. Ouvrir le dossier tp3-residence dans VS Code
3. Lancer avec l'extension Live Server (clic droit sur index.html)
   (les modules ES et fetch() nécessitent un serveur HTTP)
## Tester l'erreur de chargement
Renommer temporairement `data/orders.json` (ou changer le chemin dans
`js/dataService.js`) : l'application affiche un message d'erreur et la
console indique le fichier en cause (onglet Network : réponse 404).
