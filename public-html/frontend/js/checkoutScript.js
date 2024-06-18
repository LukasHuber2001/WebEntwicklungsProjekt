$(document).ready(function() {
    // Get username from cookie
    let username = getCookie('username');

    // Load cart items from sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Redirect user to home.html if not logged in or cart is empty
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "checkout.html" && (!username || cart.length === 0)) {
        window.location.href = "home.html";
    }

    // Load cart items from sessionStorage and display
    loadCartFromSessionStorage();

    // Event handler for Pay Now button
    $('#pay-now').on('click', async function() {
        try {
            // Process the order and get receipt ID
            const receipt_id = await processOrder();

            // Generate and save receipt if order processed successfully
            const receiptFileName = await generateAndSaveReceipt(receipt_id);

            if (receiptFileName) {
                // Clear cart from sessionStorage
                clearCartInSessionStorage();

                // Display success message and store receipt filename
                $('#checkout-cart').hide();
                $('#order-success').show();
                $('#download-receipt').data('receiptFileName', receiptFileName);
            }
        } catch (error) {
            console.error('Error processing order or generating receipt:', error);
            // Handle error, e.g., display an error message to the user
        }
    });

    // Event handler for Download Receipt button
    $('#download-receipt').on('click', function() {
        const receiptFileName = $(this).data('receiptFileName');
        if (receiptFileName) {
            window.open(`../../backend/data/receipts/${receiptFileName}`, '_blank');
        } else {
            alert('An error occurred while loading your receipt. Please contact customer support.');
        }
    });

    // Function to clear cart from sessionStorage
    function clearCartInSessionStorage() {
        sessionStorage.removeItem('cart');

    }

    // Function to load and display cart items from sessionStorage
    function loadCartFromSessionStorage() {
        displayCartItems(cart);
    }

    // Function to display cart items on the checkout page
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

    // Function to update quantity of a cart item
    function updateCartItemQuantity(artNum, newQuantity) {
        const cartItem = cart.find(item => item.art_num === artNum);

        if (cartItem && newQuantity >= 1) {
            cartItem.quantity = newQuantity;
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        loadCartFromSessionStorage();
    }

    // Function to delete a cart item
    function deleteCartItem(artNum) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.art_num !== artNum);
    
        sessionStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(cart); // Update the displayed cart items after deletion
        if(cart.length===0){
            window.location.href = "home.html";
        }
    }

    // Function to process order and return receipt ID
    async function processOrder() {
        let orderData = {
            username: username,
            cartItems: cart.map(item => ({
                id: item.art_num,
                price: item.price,
                quantity: item.quantity
            }))
        };

        try {
            const response = await $.ajax({
                url: '../../backend/logic/requestHandler.php',
                type: 'POST',
                data: { method: "processOrder", param: JSON.stringify(orderData) }
            });

            const receipt_id = response.receipt; // Assuming the server returns receipt ID in 'receipt' key
            console.log('Order processed. Receipt ID:', receipt_id);
            return receipt_id;

        } catch (error) {
            console.error('Error processing order on server:', error);
            throw new Error("Failed to process order on server.");
        }
    }

    // Function to generate and save receipt
    async function generateAndSaveReceipt(receipt_id) {
        try {
            const response = await $.ajax({
                url: '../../backend/logic/requestHandler.php',
                type: 'POST',
                data: { method: "getReceipt", param: JSON.stringify(receipt_id) }
            });
    
            if (!response || response.error) {
                throw new Error('Empty or error response from server.');
            }
    
            // Generate PDF and save receipt
            const { jsPDF } = window.jspdf;
            const companyAddress = "Feel Good Inc. & Co KG\nHochstädtplatz 6\n1200 Wien\nAUSTRIA"; // Example company address
            let currDate = ""; // Placeholder current date
    
            const receiptData = {
                datum: response.datum,
                products: response.products,
                buyer: {
                    vorname: response.buyer.vorname,
                    nachname: response.buyer.nachname,
                    address: response.buyer.address,
                    zip: response.buyer.zip,
                    city: response.buyer.city,
                    country: response.buyer.country
                },
                receipt_id: response.receipt_id
            };
    
            currDate = receiptData.datum.split(' ')[0]; // Extracting only the date part
    
            const products = receiptData.products.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));
    
            const doc = new jsPDF();
    
            const pageWidth = doc.internal.pageSize.getWidth();
            const lines = companyAddress.split('\n');
            lines.forEach((line, index) => {
                const textWidth = doc.getTextWidth(line);
                doc.text(line, pageWidth - textWidth - 10, 10 + (index * 10));
            });
    
            doc.setFont('helvetica', 'normal');
            const buyerAddress = `${receiptData.buyer.vorname},${receiptData.buyer.nachname}\n${receiptData.buyer.address}\n${receiptData.buyer.zip}, ${receiptData.buyer.city}\n${receiptData.buyer.country}`; // Buyer address with country
            const buyerLines = buyerAddress.split('\n');
            buyerLines.forEach((line, index) => {
                doc.text(line, 10, 50 + (index * 10));
            });
    
            doc.setFont('helvetica', 'bold');
            const dateText = `Date: ${currDate}`;
            const dateTextWidth = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - dateTextWidth - 10, 90);
            const nrText = `Receipt Number: ${receiptData.receipt_id}`;
            const nrTextWidth = doc.getTextWidth(nrText);
            doc.text(nrText, pageWidth - nrTextWidth - 10, 100);
            doc.setFontSize(26); // Larger font size for "Your Order" title
            doc.text("Your Order", 10, 120); // Title "Your order" above articles
            doc.setFontSize(16); // revert back to normal font size
            let y = 150; // Starting Y position for products list
            products.forEach(product => {
                const totalProductPrice = product.price * product.quantity;
                doc.setFont('helvetica', 'normal'); // Set font back to normal for product details
                doc.text(`${product.name}: €${product.price.toFixed(2)} x ${product.quantity} = €${totalProductPrice.toFixed(2)}`, 10, y);
                y += 10;
            });
    
            let totalPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0);
            doc.text(`Total: €${totalPrice.toFixed(2)}`, 10, y + 10);
    
            const pdfBlob = doc.output('blob');
            const formData = new FormData();
            formData.append('pdf', pdfBlob, `ZenMonkey_receiptNr${receipt_id}.pdf`);
    
            try {
                const saveResponse = await fetch('../../backend/logic/saveReceipts.php', {
                    method: 'POST',
                    body: formData
                });
    
                if (!saveResponse.ok) {
                    throw new Error('Failed to save receipt on server.');
                }
    
                return `ZenMonkey_receiptNr${receipt_id}.pdf`;
    
            } catch (error) {
                console.error('Error saving receipt:', error);
                return null;
            }
    
        } catch (error) {
            console.error('Error fetching or processing receipt:', error);
            // Handle error, e.g., show an error message
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
});    
