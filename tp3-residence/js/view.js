// Affichage : tout ce qui touche au DOM

const tableBody    = document.querySelector("#rentalsTableBody");
const resultCount  = document.querySelector("#resultCount");
const categoryBar  = document.querySelector("#categoryBar");
const errorMessage = document.querySelector("#errorMessage");

const stats = {
    customers:      document.querySelector("#statCustomers"),
    products:       document.querySelector("#statProducts"),
    orders:         document.querySelector("#statOrders"),
    revenue:        document.querySelector("#statRevenue"),
    visibleOrders:  document.querySelector("#statVisibleOrders"),
    visibleRevenue: document.querySelector("#statVisibleRevenue")
};

const modalTitle  = document.querySelector("#modalTitle");
const modalBody   = document.querySelector("#modalBody");
const rentalModal = new bootstrap.Modal(
    document.querySelector("#rentalModal")
);


// Affichage des statuts (les valeurs des JSON restent sans accents)
const STATUS_LABELS = {
    "Livree": "Livrée",
    "En attente": "En attente",
    "Annulee": "Annulée"
};

const STATUS_BADGES = {
    "Livree": "bg-success",
    "En attente": "bg-warning text-dark",
    "Annulee": "bg-danger"
};

const statusBadge = (status) =>
    `<span class="badge ${STATUS_BADGES[status] ?? "bg-secondary"}">
        ${STATUS_LABELS[status] ?? status}
     </span>`;

const formatMoney = (amount) => `${amount} DH`;

// Exemple : "3 jour(s)", "2 semaine(s)", "x 1"
const getQuantityText = (product, quantity) =>
    product.mode === "Unité"
        ? `x ${quantity}`
        : `${quantity} ${product.mode.toLowerCase()}(s)`;


// Une ligne du tableau 
const createRow = (order) => {

    const productNames = order.lines
        .map(line => line.product.name)
        .join(", ");

    return `
        <tr>
            <td>#${order.id}</td>
            <td class="fw-semibold">${order.customer.name}</td>
            <td>${order.customer.city}</td>
            <td>${order.date}</td>
            <td>${productNames}</td>
            <td>${formatMoney(order.total)}</td>
            <td>${statusBadge(order.status)}</td>
            <td>
                <button class="btn btn-sm btn-outline-dark details-btn"
                        data-id="${order.id}">
                    Voir
                </button>
            </td>
        </tr>
    `;
};


// Tableau des commandes (map) 
export const renderOrders = (orders) => {

    resultCount.textContent = `${orders.length} location(s) affichée(s)`;

    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    Aucune location ne correspond à votre recherche.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = orders.map(createRow).join("");
};


// Indicateurs
export const renderStats = (values) => {
    stats.customers.textContent      = values.customers;
    stats.products.textContent       = values.products;
    stats.orders.textContent         = values.orders;
    stats.revenue.textContent        = formatMoney(values.revenue);
    stats.visibleOrders.textContent  = values.visibleOrders;
    stats.visibleRevenue.textContent = formatMoney(values.visibleRevenue);
};


// Boutons de catégories 
export const renderCategories = (categories, selected) => {

    categoryBar.innerHTML = ["all", ...categories]
        .map(cat => `
            <button class="btn btn-sm category-btn
                ${cat === selected ? "btn-dark" : "btn-outline-dark"}"
                data-category="${cat}">
                ${cat === "all" ? "Toutes" : cat}
            </button>
        `)
        .join("");
};


// Détail d'une commande (modal) 
export const renderDetail = (order) => {

    modalTitle.textContent = `Location #${order.id}`;

    const linesHtml = order.lines
        .map(line => `
            <tr>
                <td>${line.product.name}</td>
                <td>${formatMoney(line.product.price)}</td>
                <td>${getQuantityText(line.product, line.quantity)}</td>
                <td class="text-end">${formatMoney(line.amount)}</td>
            </tr>
        `)
        .join("");

    modalBody.innerHTML = `
        <p class="mb-1"><strong>Commande :</strong> #${order.id}</p>
        <p class="mb-1"><strong>Client :</strong> ${order.customer.name}</p>
        <p class="mb-1"><strong>Ville :</strong> ${order.customer.city}</p>
        <p class="mb-1"><strong>Date :</strong> ${order.date}</p>
        <p class="mb-3"><strong>Statut :</strong> ${statusBadge(order.status)}</p>

        <div class="table-responsive">
            <table class="table table-sm align-middle">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th class="text-end">Montant</th>
                    </tr>
                </thead>
                <tbody>${linesHtml}</tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Total</th>
                        <th class="text-end">${formatMoney(order.total)}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    rentalModal.show();
};


// Erreur de chargement 
export const renderError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("d-none");
    resultCount.textContent = "";
    tableBody.innerHTML = "";
    categoryBar.innerHTML = "";
};