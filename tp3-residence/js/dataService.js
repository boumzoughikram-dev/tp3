// Chargement des données (aucun accès au DOM ici)

const DATA_FILES = {
    customers: "data/customers.json",
    products: "data/products.json",
    orders: "data/orders.json"
};

// Charge un fichier JSON et vérifie qu'il contient un tableau.
export const loadJson = async (path) => {
    try {
        const response = await fetch(path);

       
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("le contenu n'est pas un tableau");
        }

        return data;
    } catch (error) {
        // On précise quel fichier pose problème.
        throw new Error(`Chargement de « ${path} » impossible : ${error.message}`);
    }
};


export const validateData = ({ customers, products, orders }) => {

    orders.forEach(order => {

        const customer = customers.find(c => c.id === order.customerId);
        if (!customer) {
            throw new Error(
                `Données invalides : la commande ${order.id} référence ` +
                `un client inexistant (customerId = ${order.customerId}).`
            );
        }

        if (!Array.isArray(order.items) || order.items.length === 0) {
            throw new Error(
                `Données invalides : la commande ${order.id} ne contient aucun produit.`
            );
        }

        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new Error(
                    `Données invalides : la commande ${order.id} référence ` +
                    `un produit inexistant (productId = ${item.productId}).`
                );
            }
        });
    });
};

// Charge les trois sources en parallèle puis les valide.
export const loadAllData = async () => {

    const [customers, products, orders] = await Promise.all([
        loadJson(DATA_FILES.customers),
        loadJson(DATA_FILES.products),
        loadJson(DATA_FILES.orders)
    ]);

    const data = { customers, products, orders };
    validateData(data);

    return data;
};
