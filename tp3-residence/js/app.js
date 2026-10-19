// -------------------------------------------------
// Orchestration : données + événements + rendu
// -------------------------------------------------

import { state } from "./state.js";
import { fetchData } from "./dataService.js";
import {
    renderItems,
    renderStats,
    renderCategories,
    renderDetail,
    renderError
} from "./view.js";

const searchInput = document.querySelector("#searchInput");
const modeSelect  = document.querySelector("#modeSelect");
const paidOnly    = document.querySelector("#paidOnly");
const categoryBar = document.querySelector("#categoryBar");
const tableBody   = document.querySelector("#rentalsTableBody");


// ---------- filter() : combine tous les critères ----------
const getVisibleItems = () => {

    return state.items.filter(rental => {

        const text = state.search.toLowerCase();

        const matchesSearch =
            rental.client.toLowerCase().includes(text) ||
            rental.unit.toLowerCase().includes(text);

        const matchesCategory =
            state.category === "all" ||
            rental.category === state.category;

        const matchesMode =
            state.mode === "all" ||
            rental.mode === state.mode;

        const matchesPaid =
            !state.paidOnly || rental.paid;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesMode &&
            matchesPaid
        );
    });
};


// ---------- render() : state -> traitement -> DOM ----------
const render = () => {

    const visibleItems = getVisibleItems();

    renderCategories(state.items, state.category);
    renderItems(visibleItems);
    renderStats(visibleItems);   // indicateurs sur les locations visibles
};


// ---------- Interaction 1 : recherche ----------
searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    render();
});

// ---------- Interaction 2 : filtre par type de logement ----------
categoryBar.addEventListener("click", (event) => {
    const button = event.target.closest(".category-btn");
    if (!button) return;

    state.category = button.dataset.category;
    render();
});

// ---------- Interaction 3 : mode jour / semaine ----------
modeSelect.addEventListener("change", (event) => {
    state.mode = event.target.value;
    render();
});

// ---------- Interaction 4 : locations payées uniquement ----------
paidOnly.addEventListener("change", (event) => {
    state.paidOnly = event.target.checked;
    render();
});

// ---------- Interaction 5 : détail (find) ----------
tableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".details-btn");
    if (!button) return;

    const id = Number(button.dataset.id);
    const rental = state.items.find(item => item.id === id);

    if (rental) {
        renderDetail(rental);
    }
});


// ---------- Chargement initial ----------
const init = async () => {
    try {
        state.items = await fetchData();
        render();
    } catch (error) {
        console.error(error);
        renderError(
            "Impossible de charger les locations. " +
            "Vérifiez le fichier data/data.json."
        );
    }
};

init();
