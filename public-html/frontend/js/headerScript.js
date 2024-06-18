$(document).ready(function() {
    // User icon dropdown
    $('.dropdown-toggle').dropdown();

    let username = getCookie('username');

    if (username) {
        document.getElementById("lbl-welcome").innerHTML = "Welcome, " + username + "!";
        document.getElementById("login-link").style.display = "none";
        document.getElementById("registration-link").style.display = "none";
        document.getElementById("profil-link").style.display = "block";
        document.getElementById("logout-link").style.display = "block";
    } else {
        document.getElementById("lbl-welcome").innerHTML = "You are currently not logged in!";
        document.getElementById("login-link").style.display = "block";
        document.getElementById("registration-link").style.display = "block";
        document.getElementById("profil-link").style.display = "none";
        document.getElementById("logout-link").style.display = "none";
    }

    // Logout functionality
    // Logout functionality
    document.getElementById("logout-link").addEventListener("click", function () {
        if (confirm("Are you sure you want to Logout?")) {
            // Call the PHP logout function via AJAX
            $.ajax({
                url: '../../backend/logic/requestHandler.php',
                type: 'POST',
                data: { method: 'logoutUser' },
                dataType: "json",
                success: function (response) {
                    // Assuming response contains JSON indicating success or failure
                    if (response.loggedIn === false) {
                        // Redirect to home page or login page
                        window.location.href = "login.html";
                    } else {
                        alert("Logout failed. Please try again.");
                    }
                },
                error: function () {
                    alert("An error occurred while logging out. Please try again.");
                }
            });
        }
    });

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
        window.location.href = 'home.html';
    });

    // If user is not logged in, show the popup when the checkout button is clicked
    $('#checkout').on('click', function() {
        if (!username) {
            showPopup();
        } else {
            if (cart.length === 0) {
                showEmptyCartPopup();
            } else {
                saveCartToSessionStorage();
                window.location.href = 'checkout.html';
            }
        }
    });

    // Load the cart from sessionStorage
    loadCartFromSessionStorage();
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

const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

// Function to add new products to cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.art_num === product.art_num);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    sessionStorage.setItem('cart', JSON.stringify(cart));
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

    sessionStorage.setItem('cart', JSON.stringify(cart));
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

// Save cart to sessionStorage
function saveCartToSessionStorage() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from sessionStorage
function loadCartFromSessionStorage() {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.length = 0; // Clear the current cart array
    savedCart.forEach(item => cart.push(item)); // Copy items from savedCart to cart
    updateCartDisplay();
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}