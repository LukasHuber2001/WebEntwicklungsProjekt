$(document).ready(function() {
    // Load cart items from sessionStorage
    loadCartFromSessionStorage();

    // Pay Now button click event
    $('#pay-now').on('click', async function() {
        // Process the order
        await processOrder();

        // Clear cart in sessionStorage
        clearCartInSessionStorage();

        // Generate and save receipt
        const receiptFileName = await generateAndSaveReceipt();

        // Display order success message
        $('#checkout-cart').hide();
        $('#order-success').show();

        // Store receipt filename for download
        $('#download-receipt').data('receiptFileName', receiptFileName);
    });

    // Download receipt button click event
    $('#download-receipt').on('click', function() {
        const receiptFileName = $(this).data('receiptFileName');
        if (receiptFileName) {
            window.location.href = `../../backend/data/receipts/${receiptFileName}`;
        } else {
            alert('An Error has occurred while loading your receipt, please contact customer Support.');
        }
    });
});

function clearCartInSessionStorage() {
    sessionStorage.removeItem('cart');
    console.log('Cart cleared in sessionStorage');
}

function loadCartFromSessionStorage() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    displayCartItems(cart);
}

function displayCartItems(cart) {
    const cartItems = $('#checkout-cart-items');
    cartItems.empty();

    let totalPrice = 0;

    cart.forEach((item) => {
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        const cartItem = $(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <span>${item.name}</span><br>
                    <small>Price: ${item.price.toFixed(2)}€ each</small>
                </div>
                <span>Product Total: ${itemTotalPrice.toFixed(2)}€</span>
                <div class="d-flex align-items-center">
                    <input type="number" class="form-control form-control-sm quantity-input mr-2" value="${item.quantity}" min="1" data-art-num="${item.art_num}" style="width: 60px;">
                    <button class="btn btn-danger btn-sm delete-btn" data-art-num="${item.art_num}"><i class="fas fa-trash"></i></button>
                </div>
            </li>
        `);
        cartItems.append(cartItem);
    });

    $('#checkout-total-price').text(`€${totalPrice.toFixed(2)}`);

    // Event listeners for quantity changes and delete buttons
    $('.quantity-input').on('change', function() {
        const artNum = parseInt($(this).data('art-num'));
        const newQuantity = parseInt($(this).val());
        updateCartItemQuantity(artNum, newQuantity);
    });

    $('.delete-btn').on('click', function() {
        const artNum = parseInt($(this).data('art-num'));
        deleteCartItem(artNum);
    });
}

function updateCartItemQuantity(artNum, newQuantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.art_num === artNum);

    if (cartItem && newQuantity >= 1) {
        cartItem.quantity = newQuantity;
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
}

function deleteCartItem(artNum) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.art_num !== artNum);

    sessionStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
}

async function processOrder() {
    let username = getCookie('username');
    let orderData = {
        username: username,
        cartItems: []
    };
    let myCart = JSON.parse(sessionStorage.getItem('cart'));
    let cartItems = myCart.map(item => {
        return {
            id: item.art_num,
            price: item.price,
            quantity: item.quantity
        };
    });
    orderData.cartItems = cartItems;

    // Send order data to server-side
    try {
        const response = await $.ajax({
            url: '../../backend/logic/requestHandler.php',
            type: 'POST',
            data: { method: "processOrder", param: JSON.stringify(orderData) },
            success: function(data) {
                return data;
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                throw new Error("Failed to process order on server.");
            }
        });

        console.log('Order processed:', response);
    } catch (error) {
        console.error('Error processing order:', error);
    }
}

async function generateAndSaveReceipt() {
    const { jsPDF } = window.jspdf;

    const companyAddress = "Feel Good Inc. & Co KG\nHochstädtplatz 6\n1200 Wien\nAUSTRIA";

    // Fetch customer data from JSON
    const response = await fetch('../../backend/data/users.json');
    const customers = await response.json();

    const customerId = 11; // Placeholder customer ID
    const customer = customers.find(c => c.id == customerId);

    if (!customer) {
        console.error('Customer not found');
        return;
    }

    const buyerAddress = `${customer.vorname} ${customer.nachname}\n${customer.adresse}\n${customer.ort}, ${customer.plz}`;
    const invoiceNumber = 1; // Placeholder invoice number
    const currDate = "01.01.2000"; // Placeholder current date

    // Example products (mocking)
    const products = [
        { name: "Product 1", price: 10.0, quantity: 2 },
        { name: "Product 2", price: 20.0, quantity: 1 },
    ];

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const lines = companyAddress.split('\n');
    lines.forEach((line, index) => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, pageWidth - textWidth - 10, 10 + (index * 10));
    });

    doc.setFont('helvetica', 'bold');
    doc.text("BILLED TO:", 10, 50);
    doc.setFont('helvetica', 'normal');
    const buyerLines = buyerAddress.split('\n');
    buyerLines.forEach((line, index) => {
        doc.text(line, 10, 60 + (index * 10));
    });

    const dateText = `Date: ${currDate}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - dateTextWidth - 10, 90);
    const invoiceText = `Invoice Number: ${invoiceNumber}`;
    const invoiceTextWidth = doc.getTextWidth(invoiceText);
    doc.text(invoiceText, pageWidth - invoiceTextWidth - 10, 100);

    let total = 0;
    let y = 130;
    products.forEach(product => {
        const totalProductPrice = product.price * product.quantity;
        doc.text(`${product.name}: $${product.price} x ${product.quantity} = $${totalProductPrice.toFixed(2)}`, 10, y);
        y += 10;
        total += totalProductPrice;
    });

    doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `ZenMonkey_receiptNr${invoiceNumber}.pdf`);

    try {
        const response = await fetch('../../backend/logic/saveReceipts.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to save receipt on server.');
        }

        return `ZenMonkey_receiptNr${invoiceNumber}.pdf`;
    } catch (error) {
        console.error('Error saving receipt:', error);
        return null;
    }
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
