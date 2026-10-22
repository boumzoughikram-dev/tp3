// -------------------------------------------------
// État courant de l'application
// -------------------------------------------------

export const state = {
     // Les trois sources de données : vides au démarrage,
    // remplies après le chargement des fichiers JSON.
    customers: [],
    products: [],      // logements et services de la résidence
    orders: [],        // locations

    // Filtres de l'interface
    search: "",        // nom du client ou du logement
    status: "all",     // all, Livree, En attente, Annulee
    category: "all"  // all, Studio, F2, F3, Villa, Service
};
