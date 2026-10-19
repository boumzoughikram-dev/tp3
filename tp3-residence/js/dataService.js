// -------------------------------------------------
// Chargement des données externes
// -------------------------------------------------

export const fetchData = async () => {

    const response = await fetch("data/data.json");

    // fetch() ne lève pas d'erreur pour un 404 :
    // il faut vérifier response.ok soi-même.
    if (!response.ok) {
        throw new Error(
            `Chargement impossible (HTTP ${response.status})`
        );
    }

    return await response.json();
};
