$(document).ready(function() {
    // Load products from the database via PHP
    loadProducts();

    // Sort change listener
    $('#sort-dropdown').on('change', function() {
        const query = $('#search-input').val();
        liveSearch(query);
    });
});

// Function to count the found products to display on index.html
function productCounter(products) {
    const productCount = products.length;
    $('#product-count').text(`${productCount === 1 ? '1 product' : `${productCount} products`} found`);
    $('#no-products-text').toggle(productCount === 0);
}

function sortProducts(products) {
    const sortBy = $('#sort-dropdown').val();
    switch (sortBy) {
        case 'priceAsc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'priceDesc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'dateDesc':
            products.sort((a, b) => b.art_num - a.art_num);
            break;
        case 'dateAsc':
            products.sort((a, b) => a.art_num - b.art_num);
            break;
        default:
            // Do nothing for default
            break;
    }
}

function loadProducts() {
    $.ajax({
        type: 'POST',
        url: '../../backend/logic/requestHandler.php',
        data: {
            method: 'loadAllProducts',
            param: JSON.stringify({})
        },
        dataType: 'json',
        success: function(data) {
            // Check if there's an error in the response
            if (data.error) {
                console.error(data.error);
            } else {
                // Displays the products loaded
                displayProducts(data);
                console.log("Products loaded, yayaaaah!");
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading products: ', error);
        }
    });
}

function displayProducts(products) {
    const productContainer = $('#product-container');
    productContainer.empty();

    let row = null;
    products.forEach((product, index) => {
        // Starts a new row every 3 products iterated
        if (index % 3 === 0) {
            if (row !== null) {
                // Adds the finished row to the product container
                productContainer.append(row);
            }
            // Starts a new row
            row = $('<div class="row mb-4"></div>');
        }

        // Create the cards with HTML
        const card = $(`
            <div class="col-md-4 d-flex align-items-stretch">
                <div class="card mb-4" style="width: 340px">
                    <img style="height:300px; width: 340px" src="${product.image_url}" class="card-img-top" alt="${product.name}">
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

        // Add the card to the row
        row.append(card);
    });

    // If the system exited the function without appending the last row, it will be appended here
    if (row !== null) {
        productContainer.append(row);
    }

    // Function for add to cart button
    $('.add-to-cart-btn').on('click', function() {
        const product = JSON.parse($(this).attr('data-product'));
        addToCart(product);
    });

    // Send displayed products to product counter
    productCounter(products);
}