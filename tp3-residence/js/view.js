// -------------------------------------------------
// Fonctions liées au DOM
// -------------------------------------------------

const tableBody     = document.querySelector("#rentalsTableBody");
const resultCount   = document.querySelector("#resultCount");
const categoryBar   = document.querySelector("#categoryBar");
const errorMessage  = document.querySelector("#errorMessage");

const statTotal     = document.querySelector("#statTotal");
const statPaid      = document.querySelector("#statPaid");
const statRevenue   = document.querySelector("#statRevenue");
const statVillas    = document.querySelector("#statVillas");

const modalTitle    = document.querySelector("#modalTitle");
const modalBody     = document.querySelector("#modalBody");
const rentalModal   = new bootstrap.Modal(
    document.querySelector("#rentalModal")
);


// Montant d'une location = prix unitaire x durée
const getTotal = (rental) => rental.price * rental.duration;

// Exemple : "3 jour(s)" ou "2 semaine(s)"
const getDurationText = (rental) =>
    `${rental.duration} ${rental.mode.toLowerCase()}(s)`;


// ---------- Une ligne du tableau ----------
const createRow = (rental) => {

    const payment = rental.paid
        ? `<span class="badge bg-success">Payée</span>`
        : `<span class="badge bg-danger">Non payée</span>`;

    return `
        <tr>
            <td>#${rental.id}</td>
            <td class="fw-semibold">${rental.client}</td>
            <td>${rental.unit}</td>
            <td>${rental.category}</td>
            <td>${getDurationText(rental)}</td>
            <td>${getTotal(rental)} DH</td>
            <td>${payment}</td>
            <td>
                <button class="btn btn-sm btn-outline-dark details-btn"
                        data-id="${rental.id}">
                    Voir
                </button>
            </td>
        </tr>
    `;
};


// ---------- Afficher les locations (map) ----------
export const renderItems = (items) => {

    resultCount.textContent = `${items.length} location(s) affichée(s)`;

    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    Aucune location ne correspond à votre recherche.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = items.map(createRow).join("");
};


// ---------- Afficher les indicateurs ----------
export const renderStats = (items) => {

    // 1) nombre de locations
    statTotal.textContent = items.length;

    // 2) locations payées (filter)
    statPaid.textContent =
        items.filter(rental => rental.paid).length;

    // 3) revenu total (forEach)
    let revenue = 0;
    items.forEach(rental => {
        revenue += getTotal(rental);
    });
    statRevenue.textContent = `${revenue} DH`;

    // 4) locations de villas (filter)
    statVillas.textContent =
        items.filter(rental => rental.category === "Villa").length;
};


// ---------- Boutons de types (générés depuis les données) ----------
export const renderCategories = (items, selected) => {

    const categories = [
        "all",
        ...new Set(items.map(rental => rental.category))
    ];

    categoryBar.innerHTML = categories
        .map(cat => `
            <button class="btn btn-sm category-btn
                ${cat === selected ? "btn-dark" : "btn-outline-dark"}"
                data-category="${cat}">
                ${cat === "all" ? "Tous" : cat}
            </button>
        `)
        .join("");
};


// ---------- Détail d'une location ----------
export const renderDetail = (rental) => {

    modalTitle.textContent = `Location #${rental.id} – ${rental.unit}`;

    modalBody.innerHTML = `
        <p><strong>Client :</strong> ${rental.client}</p>
        <p><strong>Logement :</strong> ${rental.unit} (${rental.category})</p>
        <p><strong>Mode :</strong> par ${rental.mode.toLowerCase()}</p>
        <p><strong>Durée :</strong> ${getDurationText(rental)}</p>
        <p><strong>Prix unitaire :</strong> ${rental.price} DH</p>
        <p><strong>Total :</strong> ${getTotal(rental)} DH</p>
        <p><strong>Début :</strong> ${rental.startDate}</p>
        <p><strong>Paiement :</strong>
            ${rental.paid ? "Payée" : "Non payée"}</p>
        <p class="text-muted mb-0">${rental.description}</p>
    `;

    rentalModal.show();
};


// ---------- Erreur ----------
export const renderError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("d-none");
    resultCount.textContent = "";
};
