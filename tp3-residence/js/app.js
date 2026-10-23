
// Orchestration : chargement + événements + rendu

import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import {
    getOrderViews,
    getOrderViewById,
    filterOrders,
    getCategories,
    getStats
} from "./selectors.js";
import {
    renderOrders,
    renderStats,
    renderCategories,
    renderDetail,
    renderError
} from "./view.js";

const searchInput  = document.querySelector("#searchInput");
const statusSelect = document.querySelector("#statusSelect");
const categoryBar  = document.querySelector("#categoryBar");
const tableBody    = document.querySelector("#rentalsTableBody");


// render()
const render = () => {

    const allOrders     = getOrderViews(state);
    const visibleOrders = filterOrders(allOrders, state);

    renderCategories(getCategories(state.products), state.category);
    renderOrders(visibleOrders);
    renderStats(getStats(state, allOrders, visibleOrders));
};


// recherche par nom de client 
searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    render();
});

//  filtre par statut 
statusSelect.addEventListener("change", (event) => {
    state.status = event.target.value;
    render();
});

// filtre par catégorie de produit 
categoryBar.addEventListener("click", (event) => {
    const button = event.target.closest(".category-btn");
    if (!button) return;

    state.category = button.dataset.category;
    render();
});

// détail d'une commande 
tableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".details-btn");
    if (!button) return;

    const order = getOrderViewById(state, Number(button.dataset.id));

    if (order) {
        renderDetail(order);
    }
});


// chargement puis premier rendu 
const init = async () => {
    try {
        const data = await loadAllData();

        state.customers = data.customers;
        state.products  = data.products;
        state.orders    = data.orders;

        // Premier rendu : uniquement après le chargement des trois sources
        render();
    } catch (error) {
        console.error(error);
        renderError(
            "Impossible de charger les données de la résidence. " +
            error.message
        );
    }
};

init();
