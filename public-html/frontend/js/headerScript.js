$(document).ready(function() {
    // Cart icon click listener
    $('#cart-icon').on('click', function() {
        $('#openPopupBtn').trigger('click');
    });

    // Search input listener, activates upon each input to make the search happen in real time
    $('#search-input').on('input', function() {
        const query = $(this).val();
        liveSearch(query);
    });

    // Clear search input
    $('#clear-icon').on('click', function() {
        $('#search-input').val('');
        liveSearch('');
        $('#clear-icon').hide();
    });

    // Pop-up
    const popup = document.getElementById("popup");
    const closeBtn = document.querySelector(".close-btn");
    const returnBtn = document.getElementById("returnBtn");
    const loginBtn = document.getElementById("loginBtn");

    function showPopup() {
        popup.style.display = "block";
    }

    function hidePopup() {
        popup.style.display = "none";
    }

    closeBtn.addEventListener("click", hidePopup);

    window.addEventListener("click", function(event) {
        if (event.target == popup) {
            hidePopup();
        }
    });

    returnBtn.addEventListener("click", function() {
        hidePopup();
    });

    loginBtn.addEventListener("click", function() {
        window.location.href = '../sites/login.html';
    });

    // Check if the user is logged in (placeholder condition)
    const isLoggedIn = false; // Replace this with actual login check, once implemented

    // If user is not logged in, show the popup when the checkout button is clicked
    $('#checkout').on('click', function() {
        if (!isLoggedIn) {
            showPopup();
        } else {
            // Proceed with checkout
        }
    });
});

function liveSearch(query) {
    $.ajax({
        url: '../../backend/logic/requestHandler.php',
        type: 'GET',
        data: { method: "searchProducts", query: query },
        success: function(data) {
            const products = JSON.parse(data);
            sortProducts(products);
            displayProducts(products);
            $('#clear-icon').toggle(query.length > 0);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

const cart = [];

// Function to add new products to cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.art_num === product.art_num);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
}

// Update cart, empties items each load, calculates total price, and displays products
function updateCartDisplay() {
    const cartItems = $('#cart-items');
    cartItems.empty();

    let totalPrice = 0;

    cart.forEach((item) => {
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        // Use HTML to create a list for each cart item
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

    // Update total price
    $('#total-price').text(`€${totalPrice.toFixed(2)}`);

    // Simple event listener for quantity input and delete button
    $('.quantity-input').on('change', updateQuantity);
    $('.delete-btn').on('click', deleteCartItem);

    // Updates the counter for the cart icon in the navbar
    $('#cart-count').text(cart.length);
}

// Handles the quantity fields
function updateQuantity(event) {
    const artNum = parseInt($(event.target).data('art-num'));
    const newQuantity = parseInt($(event.target).val());

    const cartItem = cart.find(item => item.art_num === artNum);
    if (cartItem && newQuantity >= 1) {
        cartItem.quantity = newQuantity;
    }

    updateCartDisplay();
}

// Deletes product off of cart
function deleteCartItem(event) {
    const artNum = parseInt($(event.target).data('art-num'));

    const cartIndex = cart.findIndex(item => item.art_num === artNum);
    if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);
    }

    updateCartDisplay();
}
