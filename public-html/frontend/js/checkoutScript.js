$(document).ready(function() {
    // Load cart items from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCartItems(cart);

    // Pay Now button click event
    $('#pay-now').on('click', async function() {
        // Clear cart in local storage
        localStorage.removeItem('cart');

        // Generate and save receipt
        const receiptFileName = await generateAndSaveReceipt();

        // Display order success message
        $('#checkout-cart-items').hide();
        $('#pay-now').hide();
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
            alert('An Error has occured while loading your receipt, please contact customer Support.');
        }
    });
});

async function generateAndSaveReceipt() {
    const { jsPDF } = window.jspdf;

    // Placeholder company address (unchanged)
    const companyAddress = "Feel Good Inc. & Co KG\nHochstädtplatz 6\n1200 Wien\nAUSTRIA";

    // Fetch customer data from JSON
    const response = await fetch('../../backend/data/users.json');
    const customers = await response.json();

    const customerId = 11;
    const customer = customers.find(c => c.id == customerId);

    if (!customer) {
        console.error('Customer not found');
        return;
    }

    const buyerAddress = `${customer.vorname} ${customer.nachname}\n${customer.adresse}\n${customer.ort}, ${customer.plz}`;
    const invoiceNumber = 1;
        // Mock current date for now
        const currDate = "01.01.2000"; // Replace with actual current date logic from database

    // Example products (mocking)
    const products = [
        { name: "Product 1", price: 10.0, quantity: 2 },
        { name: "Product 2", price: 20.0, quantity: 1 },
    ];

    // Create new jsPDF instance
    const doc = new jsPDF();

    // Company address, right-aligned
    const pageWidth = doc.internal.pageSize.getWidth();
    const lines = companyAddress.split('\n');
    lines.forEach((line, index) => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, pageWidth - textWidth - 10, 10 + (index * 10));
    });

    // Customer address
    doc.setFont('helvetica', 'bold');
    doc.text("BILLED TO:", 10, 50);
    doc.setFont('helvetica', 'normal');
    const buyerLines = buyerAddress.split('\n');
    buyerLines.forEach((line, index) => {
        doc.text(line, 10, 60 + (index * 10));
    });

    // Invoice number, right-aligned
    const dateText = `Date: ${currDate}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - dateTextWidth - 10, 90);
    const invoiceText = `Invoice Number: ${invoiceNumber}`;
    const invoiceTextWidth = doc.getTextWidth(invoiceText);
    doc.text(invoiceText, pageWidth - invoiceTextWidth - 10, 100);

    // Product list
    let y = 130;
    let total = 0;
    products.forEach(product => {
        const totalProductPrice = product.price * product.quantity;
        doc.text(`${product.name}: $${product.price} x ${product.quantity} = $${totalProductPrice.toFixed(2)}`, 10, y);
        y += 10;
        total += totalProductPrice;
    });

    // Total price
    doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

    // Save the file on the server
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

        // Return the filename for client-side download
        return `ZenMonkey_receiptNr${invoiceNumber}.pdf`;
    } catch (error) {
        console.error('Error saving receipt:', error);
        return null;
    }
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

    // Quantity input change event
    $('.quantity-input').on('change', function() {
        const artNum = parseInt($(this).data('art-num'));
        const newQuantity = parseInt($(this).val());
        updateCartQuantity(artNum, newQuantity);
    });

    // Delete button click event
    $('.delete-btn').on('click', function() {
        const artNum = parseInt($(this).data('art-num'));
        deleteCartItem(artNum);
    });
}

function updateCartQuantity(artNum, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.art_num === artNum);

    if (cartItem && newQuantity >= 1) {
        cartItem.quantity = newQuantity;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
}

function deleteCartItem(artNum) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.art_num !== artNum);

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
}
