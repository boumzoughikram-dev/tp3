// find() 

// order.customerId
export const getCustomerById = (customers, customerId) =>
    customers.find(customer => customer.id === customerId);

// item.productId
export const getProductById = (products, productId) =>
    products.find(product => product.id === productId);


// Calculs 
export const getLineAmount = (product, quantity) =>
    product.price * quantity;

//  map()
export const getOrderLines = (order, products) =>
    order.items.map(item => {
        const product = getProductById(products, item.productId);

        return {
            product,
            quantity: item.quantity,
            amount: getLineAmount(product, item.quantity)
        };
    });

// montant total  : forEach()
export const getOrderTotal = (lines) => {
    let total = 0;
    lines.forEach(line => {
        total += line.amount;
    });
    return total;
};


// Commande enrichie 
export const buildOrderView = (order, state) => {

    const lines = getOrderLines(order, state.products);

    return {
        id: order.id,
        date: order.date,
        status: order.status,
        customer: getCustomerById(state.customers, order.customerId),
        lines,
        total: getOrderTotal(lines)
    };
};

export const getOrderViews = (state) =>
    state.orders.map(order => buildOrderView(order, state));

export const getOrderViewById = (state, orderId) => {
    const order = state.orders.find(o => o.id === orderId);
    return order ? buildOrderView(order, state) : undefined;
};


// Filtres : filter()
export const filterOrders = (orderViews, state) => {

    const text = state.search.toLowerCase();

    return orderViews.filter(order => {

        // Recherche : nom du client (via customers.json) ou nom d'un logement
        const matchesSearch =
            order.customer.name.toLowerCase().includes(text) ||
            order.lines.some(line =>
                line.product.name.toLowerCase().includes(text)
            );

        const matchesStatus =
            state.status === "all" ||
            order.status === state.status;

        // commande -> items -> productId -> produit -> catégorie
        const matchesCategory =
            state.category === "all" ||
            order.lines.some(line =>
                line.product.category === state.category
            );

        return matchesSearch && matchesStatus && matchesCategory;
    });
};


// Catégories disponibles (depuis products.json)
export const getCategories = (products) =>
    [...new Set(products.map(product => product.category))];


// Indicateurs 
export const getStats = (state, allOrders, visibleOrders) => ({
    customers: state.customers.length,
    products: state.products.length,
    orders: state.orders.length,
    revenue: getOrderTotal(allOrders.map(order => ({ amount: order.total }))),
    visibleOrders: visibleOrders.length,
    visibleRevenue: getOrderTotal(visibleOrders.map(order => ({ amount: order.total })))
});