document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadProducts();
});

function showSection(section) {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('editUsers').style.display = 'none';
    document.getElementById('editProducts').style.display = 'none';
    document.getElementById(section).style.display = 'block';
}

function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('editUsers').style.display = 'none';
    document.getElementById('editProducts').style.display = 'none';
    document.getElementById('userForm').style.display = 'none';
    document.getElementById('productForm').style.display = 'none';
}

function loadUsers() {
    fetch('../../backend/logic/requestHandler.php?method=loadAllUsers')
        .then(response => response.json())
        .then(users => {
            let table = '<table class="table">';
            table += '<tr><th>Username</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Actions</th></tr>';
            users.forEach(user => {
                table += `<tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.vorname}</td>
                    <td>${user.nachname}</td>
                    <td>
                        <button class="btn btn-warning" onclick="showEditUserForm(${user.id})">Edit</button>
                        <button class="btn btn-danger" onclick="toggleUserStatus(${user.id}, ${user.aktiv})">${user.aktiv ? 'Deactivate' : 'Activate'}</button>
                    </td>
                </tr>`;
            });
            table += '</table>';
            document.getElementById('usersTable').innerHTML = table;
        })
        .catch(error => console.error('Error loading users:', error));
}

function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    fetch('../../backend/logic/requestHandler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: currentStatus ? 'deactivateUser' : 'activateUser', param: { id: userId } })
    })
    .then(response => response.json())
    .then(data => {
        loadUsers(); // Refresh user list after status change
    })
    .catch(error => console.error('Error toggling user status:', error));
}

function showEditUserForm(userId) {
    fetch(`../../backend/logic/requestHandler.php?method=loadUserByID&param=${userId}`)
        .then(response => response.json())
        .then(user => {
            const form = `
                <form>
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" class="form-control" id="firstName" value="${user.vorname}">
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" class="form-control" id="lastName" value="${user.nachname}">
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" class="form-control" id="address" value="${user.adresse}">
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" class="form-control" id="city" value="${user.ort}">
                    </div>
                    <div class="form-group">
                        <label for="postcode">Postcode</label>
                        <input type="text" class="form-control" id="postcode" value="${user.plz}">
                    </div>
                    <div class="form-group">
                        <label for="country">Country</label>
                        <input type="text" class="form-control" id="country" value="${user.land}">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" value="${user.email}">
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" value="${user.username}">
                    </div>
                    <button type="button" class="btn btn-primary" onclick="saveUser(${user.id})">Save</button>
                </form>`;
            document.getElementById('userForm').innerHTML = form;
            document.getElementById('userForm').style.display = 'block';
        })
        .catch(error => console.error('Error loading user details:', error));
}

function saveUser(userId) {
    const user = {
        id: userId,
        vorname: document.getElementById('firstName').value,
        nachname: document.getElementById('lastName').value,
        adresse: document.getElementById('address').value,
        ort: document.getElementById('city').value,
        plz: document.getElementById('postcode').value,
        land: document.getElementById('country').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
    };

    fetch('../../backend/logic/requestHandler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'updateUserData', param: user })
    })
    .then(response => response.json())
    .then(data => {
        loadUsers();
        document.getElementById('userForm').style.display = 'none';
    })
    .catch(error => console.error('Error saving user:', error));
}

function showCreateUserForm() {
    const form = `
        <form>
            <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" class="form-control" id="firstName" placeholder="First Name">
            </div>
            <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" class="form-control" id="lastName" placeholder="Last Name">
            </div>
            <div class="form-group">
                <label for="address">Address</label>
                <input type="text" class="form-control" id="address" placeholder="Address">
            </div>
            <div class="form-group">
                <label for="city">City</label>
                <input type="text" class="form-control" id="city" placeholder="City">
            </div>
            <div class="form-group">
                <label for="postcode">Postcode</label>
                <input type="text" class="form-control" id="postcode" placeholder="Postcode">
            </div>
            <div class="form-group">
                <label for="country">Country</label>
                <input type="text" class="form-control" id="country" placeholder="Country">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Email">
            </div>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" placeholder="Username">
            </div>
            <button type="button" class="btn btn-primary" onclick="createUser()">Create</button>
        </form>`;
    document.getElementById('userForm').innerHTML = form;
    document.getElementById('userForm').style.display = 'block';
}

function createUser() {
    const user = {
        vorname: document.getElementById('firstName').value,
        nachname: document.getElementById('lastName').value,
        adresse: document.getElementById('address').value,
        ort: document.getElementById('city').value,
        plz: document.getElementById('postcode').value,
        land: document.getElementById('country').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: 'defaultPassword',  // Set a default password or prompt the admin to set it
        isAdmin: 0,
        aktiv: 1
    };

    fetch('../../backend/logic/requestHandler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'registerUser', param: user })
    })
    .then(response => response.json())
    .then(data => {
        loadUsers();
        document.getElementById('userForm').style.display = 'none';
    })
    .catch(error => console.error('Error creating user:', error));
}

function loadProducts() {
    fetch('../../backend/logic/requestHandler.php?method=loadAllProducts')
        .then(response => response.json())
        .then(products => {
            let table = '<table class="table">';
            table += '<tr><th>Art. Num</th><th>Name</th><th>Gender</th><th>Price</th><th>Size</th><th>Color</th><th>Category</th><th>Image</th><th>Actions</th></tr>';
            products.forEach(product => {
                table += `<tr>
                    <td>${product.art_num}</td>
                    <td>${product.name}</td>
                    <td>${product.gender}</td>
                    <td>${product.price}</td>
                    <td>${product.size}</td>
                    <td>${product.color}</td>
                    <td>${product.category}</td>
                    <td><img src="${product.image_url}" alt="${product.name}" style="max-width: 100px; max-height: 100px;"></td>
                    <td>
                        <button class="btn btn-warning" onclick="showEditProductForm(${product.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>`;
            });
            table += '</table>';
            document.getElementById('productsTable').innerHTML = table;
        })
        .catch(error => console.error('Error loading products:', error));
}

function showEditProductForm(productId) {
    fetch(`../../backend/logic/requestHandler.php?method=loadProductByID&param=${productId}`)
        .then(response => response.json())
        .then(product => {
            const form = `
                <form>
                    <div class="form-group">
                        <label for="productName">Product Name</label>
                        <input type="text" class="form-control" id="productName" value="${product.name}">
                    </div>
                    <div class="form-group">
                        <label for="productGender">Gender</label>
                        <input type="text" class="form-control" id="productGender" value="${product.gender}">
                    </div>
                    <div class="form-group">
                        <label for="productPrice">Price</label>
                        <input type="text" class="form-control" id="productPrice" value="${product.price}">
                    </div>
                    <div class="form-group">
                        <label for="productSize">Size</label>
                        <input type="text" class="form-control" id="productSize" value="${product.size}">
                    </div>
                    <div class="form-group">
                        <label for="productColor">Color</label>
                        <input type="text" class="form-control" id="productColor" value="${product.color}">
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Category</label>
                        <input type="text" class="form-control" id="productCategory" value="${product.category}">
                    </div>
                    <div class="form-group">
                        <label for="productImage">Image URL</label>
                        <input type="text" class="form-control" id="productImage" value="${product.image}">
                    </div>
                    <button type="button" class="btn btn-primary" onclick="saveProduct(${product.id})">Save</button>
                </form>`;
            document.getElementById('productForm').innerHTML = form;
            document.getElementById('productForm').style.display = 'block';
        })
        .catch(error => console.error('Error loading product details:', error));
}

function saveProduct(productId) {
    const product = {
        id: productId,
        name: document.getElementById('productName').value,
        gender: document.getElementById('productGender').value,
        price: document.getElementById('productPrice').value,
        size: document.getElementById('productSize').value,
        color: document.getElementById('productColor').value,
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value,
    };

    fetch('../../backend/logic/requestHandler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'updateProductData', param: product })
    })
    .then(response => response.json())
    .then(data => {
        loadProducts();
        document.getElementById('productForm').style.display = 'none';
    })
    .catch(error => console.error('Error saving product:', error));
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch('../../backend/logic/requestHandler.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ method: 'deleteProduct', param: { id: productId } })
        })
        .then(response => response.json())
        .then(data => {
            loadProducts();
        })
        .catch(error => console.error('Error deleting product:', error));
    }
}

function showCreateProductForm() {
    const form = `
        <form>
            <div class="form-group">
                <label for="productName">Product Name</label>
                <input type="text" class="form-control" id="productName" placeholder="Product Name">
            </div>
            <div class="form-group">
                <label for="productGender">Gender</label>
                <input type="text" class="form-control" id="productGender" placeholder="Gender">
            </div>
            <div class="form-group">
                <label for="productPrice">Price</label>
                <input type="text" class="form-control" id="productPrice" placeholder="Price">
            </div>
            <div class="form-group">
                <label for="productSize">Size</label>
                <input type="text" class="form-control" id="productSize" placeholder="Size">
            </div>
            <div class="form-group">
                <label for="productColor">Color</label>
                <input type="text" class="form-control" id="productColor" placeholder="Color">
            </div>
            <div class="form-group">
                <label for="productCategory">Category</label>
                <input type="text" class="form-control" id="productCategory" placeholder="Category">
            </div>
            <div class="form-group">
                <label for="productImage">Image URL</label>
                <input type="text" class="form-control" id="productImage" placeholder="Image URL">
            </div>
            <button type="button" class="btn btn-primary" onclick="createProduct()">Create</button>
        </form>`;
    document.getElementById('productForm').innerHTML = form;
    document.getElementById('productForm').style.display = 'block';
}

function createProduct() {
    const product = {
        name: document.getElementById('productName').value,
        gender: document.getElementById('productGender').value,
        price: document.getElementById('productPrice').value,
        size: document.getElementById('productSize').value,
        color: document.getElementById('productColor').value,
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value,
    };

    fetch('../../backend/logic/requestHandler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'createProduct', param: product })
    })
    .then(response => response.json())
    .then(data => {
        loadProducts();
        document.getElementById('productForm').style.display = 'none';
    })
    .catch(error => console.error('Error creating product:', error));
}
