// -------------------------------------------------
// État courant de l'application
// -------------------------------------------------

export const state = {
    items: [],            // vide au démarrage, rempli après fetch()
    search: "",           // nom du client ou du logement
    category: "all",      // Studio, F2, F3, Villa...
    mode: "all",          // all, Jour ou Semaine
    paidOnly: false       // afficher seulement les locations payées
};
