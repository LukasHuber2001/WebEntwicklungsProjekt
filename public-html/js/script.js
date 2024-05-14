// Globaler Warenkorb
const cart = [];

// Funktion zum Laden der Produkte aus der JSON-Datei
function loadProducts() {
    $.getJSON('../data/products.json', function(data) {
        // Produkte in der HTML-Seite anzeigen
        displayProducts(data);
    });
}

// Funktion zum Anzeigen der Produkte
function displayProducts(products) {
    const productContainer = $('#product-container');
    productContainer.empty();

    let row = null;
    products.forEach((product, index) => {
        // Wenn der Index durch 3 teilbar ist, beginnen wir eine neue Reihe
        if (index % 3 === 0) {
            if (row !== null) {
                // Wenn wir eine vorherige Reihe haben, fügen wir sie dem Container hinzu
                productContainer.append(row);
            }
            // Eine neue Reihe starten
            row = $('<div class="row mb-4"></div>');
        }

        // Erstelle eine Card für jedes Produkt
        const card = $(`
            <div class="col-md-4 d-flex align-items-stretch">
                <div class="card mb-4">
                    <img style="height:300px; width: 350px" src="${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title mt-auto">${product.name}</h5>
                        <p class="card-text mt-auto">Preis: €${product.price.toFixed(2)}</p>
                        <p class="card-text mt-auto">Größe: ${product.size}</p>
                        <p class="card-text mt-auto">Farbe: ${product.color}</p>
                        <button class="btn btn-primary add-to-cart-btn mt-auto" data-product='${JSON.stringify(product)}'>In den Warenkorb legen</button>
                    </div>
                </div>
            </div>
        `);

        // Die Karte der aktuellen Reihe hinzufügen
        row.append(card);
    });

    // Die letzte Reihe dem Container hinzufügen, falls es eine gibt
    if (row !== null) {
        productContainer.append(row);
    }

    // Füge Ereignis-Listener für den Warenkorb-Button hinzu
    $('.add-to-cart-btn').on('click', function() {
        const product = JSON.parse($(this).attr('data-product'));
        addToCart(product);
    });
}

// Funktion zum Hinzufügen eines Produkts in den Warenkorb
function addToCart(product) {
    const existingProduct = cart.find(item => item.art_num === product.art_num);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
}

// Funktion zum Anzeigen des Warenkorbs
function updateCartDisplay() {
    const cartItems = $('#cart-items');
    cartItems.empty();

    let totalPrice = 0;

    cart.forEach((item) => {
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        // Erstelle die Listenelemente für jedes Produkt im Warenkorb
        const cartItem = $(`
            <li class="cart-item">
                <span>${item.name}</span>
                <span>Preis: €${itemTotalPrice.toFixed(2)}</span>
                <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-art-num="${item.art_num}">
                <button class="btn btn-danger delete-btn" data-art-num="${item.art_num}"><i class="fas fa-trash"></i></button>
            </li>
        `);
        cartItems.append(cartItem);
    });

    // Gesamtpreis aktualisieren
    $('#total-price').text(`€${totalPrice.toFixed(2)}`);

    // Ereignis-Listener für Mengeingaben und Löschen-Buttons hinzufügen
    $('.quantity-input').on('change', updateQuantity);
    $('.delete-btn').on('click', deleteCartItem);

    // Warenkorb-Anzahl in der Navbar aktualisieren
    $('#cart-count').text(cart.length);
}

// Funktion zum Aktualisieren der Menge eines Produkts im Warenkorb
function updateQuantity(event) {
    const artNum = parseInt($(event.target).data('art-num'));
    const newQuantity = parseInt($(event.target).val());

    const cartItem = cart.find(item => item.art_num === artNum);
    if (cartItem && newQuantity >= 1) {
        cartItem.quantity = newQuantity;
    }

    updateCartDisplay();
}

// Funktion zum Löschen eines Produkts aus dem Warenkorb
function deleteCartItem(event) {
    const artNum = parseInt($(event.target).data('art-num'));

    const cartIndex = cart.findIndex(item => item.art_num === artNum);
    if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);
    }

    updateCartDisplay();
}

// Laden der Produkte beim Start der Seite
$(document).ready(function() {
    loadProducts();
});
