//functions that are being loaded on siteload
$(document).ready(function() {
    //load products from the json file
    loadProducts();
    
    // search input listener, activates upon each input to make the search happen in real time
    $('#search-input').on('input', function() {
        const query = $(this).val();
        liveSearch(query);
    });
    // clear search input
    $('#clear-icon').on('click', function() {
        $('#search-input').val('');
        liveSearch('');
        $('#clear-icon').hide();
    });
})

//live search function, makes a new variable with all found json data and sends this json data to the displayProducts function
function liveSearch(query) {
    $.ajax({
        url: '../logic/requestHandler.php',
        type: 'GET',
        data: { method: "searchProducts", query: query },
        success: function(data) {
            const products = JSON.parse(data);
            displayProducts(products);
            if (products.length === 0) {
                $('#no-products-text').show(); //shows the no products found text
            } else {
                $('#no-products-text').hide(); //hides the no products found text
            }
            $('#clear-icon').toggle(query.length > 0);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}


const cart = [];

//gets json data of each product
function loadProducts() {
    $.getJSON('../data/products.json', function(data) {
        // displays the products loaded
        displayProducts(data);
        console.log("Products loaded, yayaaaah!");
    });
}

// display the products, uses html to load the products into cards, adds purchase button    
function displayProducts(products) {
    const productContainer = $('#product-container');
    productContainer.empty();

    let row = null;
    products.forEach((product, index) => {
        //starts a new row every 3 products iterated, so the first product enters this query, then the fourth, then the seventh and so on
        if (index % 3 === 0) {
            if (row !== null) {
                // adds the finished row to the product container, actually only happens after the first row has been completed
                productContainer.append(row);
            }
            // starts a new row
            row = $('<div class="row mb-4"></div>');
        }

        //create the cards with html
        const card = $(`
            <div class="col-md-4 d-flex align-items-stretch">
                <div class="card mb-4">
                    <img style="height:300px; width: 350px" src="${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title mt-auto">${product.name}</h5>
                        <p class="card-text mt-auto">Price: €${product.price.toFixed(2)}</p>
                        <p class="card-text mt-auto">Size: ${product.size}</p>
                        <p class="card-text mt-auto">Color: ${product.color}</p>
                        <button class="btn btn-primary add-to-cart-btn mt-auto" data-product='${JSON.stringify(product)}'>Add To Cart</button>
                    </div>
                </div>
            </div>
        `);

        // add the card to the row
        row.append(card);
    });

    //if the system exited the function without appending the last row, it will be appended here
    //if the last row of products could not be properly finished because there are less then three products, we need to finish it here
    if (row !== null) {
        productContainer.append(row);
    }

    // function for add to card button, defines constant that saves the products in the cart and starts the addToCard function
    $('.add-to-cart-btn').on('click', function() {
        const product = JSON.parse($(this).attr('data-product'));
        addToCart(product);
    });
}

// function to add new products to card, checks if the product was already added or not, adds product or quantity
function addToCart(product) {
    const existingProduct = cart.find(item => item.art_num === product.art_num);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
}

// update cart, empties items each load, calculates total price, and displays products
function updateCartDisplay() {
    const cartItems = $('#cart-items');
    cartItems.empty();

    let totalPrice = 0;

    cart.forEach((item) => {
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        // use html to create a list for each cart item, adds input field to change quantity and trash bin button to delete item off of cart
        const cartItem = $(`
            <li class="cart-item">
                <span>${item.name}</span>
                <span>Price: €${itemTotalPrice.toFixed(2)}</span>
                <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-art-num="${item.art_num}">
                <button class="btn btn-danger delete-btn" data-art-num="${item.art_num}"><i class="fas fa-trash"></i></button>
            </li>
        `);
        cartItems.append(cartItem);
    });

    // update total price
    $('#total-price').text(`€${totalPrice.toFixed(2)}`);

    // simple event listener for quantity input and delete button
    $('.quantity-input').on('change', updateQuantity);
    $('.delete-btn').on('click', deleteCartItem);

    // updates the counter for the cart icon in the navbar
    $('#cart-count').text(cart.length);
}

// handles the quantity fields
function updateQuantity(event) {
    const artNum = parseInt($(event.target).data('art-num'));
    const newQuantity = parseInt($(event.target).val());

    const cartItem = cart.find(item => item.art_num === artNum);
    if (cartItem && newQuantity >= 1) {
        cartItem.quantity = newQuantity;
    }

    updateCartDisplay();
}

// deletes prduct off of cart
function deleteCartItem(event) {
    const artNum = parseInt($(event.target).data('art-num'));

    const cartIndex = cart.findIndex(item => item.art_num === artNum);
    if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);
    }

    updateCartDisplay();
}