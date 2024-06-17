$(document).ready(function() {
    // User icon dropdown
    $('.dropdown-toggle').dropdown();

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
    const emptyCartPopup = document.getElementById("empty-cart-popup");
    const closeBtn = document.querySelector(".close-btn");
    const returnBtn = document.getElementById("returnBtn");
    const loginBtn = document.getElementById("loginBtn");
    const buyStuffBtn = document.getElementById("buyStuffBtn");

    function showPopup() {
        popup.style.display = "block";
    }

    function hidePopup() {
        popup.style.display = "none";
    }

    function showEmptyCartPopup() {
        emptyCartPopup.style.display = "block";
    }

    function hideEmptyCartPopup() {
        emptyCartPopup.style.display = "none";
    }

    closeBtn.addEventListener("click", function(event) {
        if (event.target.closest(".popup-content").parentNode === popup) {
            hidePopup();
        } else {
            hideEmptyCartPopup();
        }
    });

    window.addEventListener("click", function(event) {
        if (event.target == popup) {
            hidePopup();
        } else if (event.target == emptyCartPopup) {
            hideEmptyCartPopup();
        }
    });

    returnBtn.addEventListener("click", function() {
        hidePopup();
    });

    loginBtn.addEventListener("click", function() {
        window.location.href = '../sites/login.html';
    });

    buyStuffBtn.addEventListener("click", function() {
        window.location.href = 'index.html';
    });

    // Check if the user is logged in (placeholder condition)
    const isLoggedIn = true; // Replace this with actual login check, once implemented

    // If user is not logged in, show the popup when the checkout button is clicked
    $('#checkout').on('click', function() {
        if (!isLoggedIn) {
            showPopup();
        } else {
            if (cart.length === 0) {
                showEmptyCartPopup();
            } else {
                saveCartToServer(function() {
                    window.location.href = 'checkout.html';
                });
            }
        }
    });
});

function liveSearch(query) {
    $.ajax({
        url: '../../backend/logic/requestHandler.php',
        type: 'GET',
        data: { method: "searchProducts", param: JSON.stringify({ query: query }) },
        success: function(products) {
            try {
                products = JSON.parse(products);
                if (products.error) {
                    console.error(products.error);
                    return;
                }
                sortProducts(products);
                displayProducts(products);
                $('#clear-icon').toggle(query.length > 0);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", error);
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
    localStorage.setItem('cart', JSON.stringify(cart));
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

    localStorage.setItem('cart', JSON.stringify(cart));
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

// Save cart to server via AJAX
function saveCartToServer(callback) {
    $.ajax({
        url: '../../backend/logic/requestHandler.php',
        type: 'POST',
        data: { method: "saveCart", cart: JSON.stringify(cart) },
        success: function(response) {
            console.log('Cart saved to server:', response);
            if (callback) callback();
        },
        error: function(xhr, status, error) {
            console.error('Error saving cart:', error);
        }
    });
}

// Function to load cart from server
function loadCartFromServer(callback) {
    $.ajax({
        url: '../../backend/logic/requestHandler.php',
        type: 'GET',
        data: { method: 'loadCart' },
        success: function(data) {
            const cart = JSON.parse(data) || [];
            displayCartItems(cart);
            if (callback) callback(cart);
        },
        error: function(xhr, status, error) {
            console.error('Error loading cart:', error);
        }
    });
}

