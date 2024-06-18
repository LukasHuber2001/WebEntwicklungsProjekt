$(document).ready(function () {
    let userName = getCookie('username');

    if (userName != "") {
        loadProfileData();
    } else {
        alert("You need to be Logged in to use this feature!");
        setTimeout(function () {
            window.location.href = "login.html"; //will redirect to login.html
        }, 2000);
    }

    $(document).on('click', '#loadReceipts', function () {
        toggleOrderInfo();
    });

    $(document).on('click', '#changeButton', function () {
        changeProfileData();
        loadProfileData();
        location.reload();
        $('html,body').scrollTop(0);
    });
});

let ordersLoaded = false; // Flag to track if orders are loaded

function toggleOrderInfo() {
    if (ordersLoaded) {
        $('#ordersTable').empty(); // Clear the orders if already loaded
        $('#loadReceipts').text('Load Receipts'); // Change button text to "Load Receipts"
        ordersLoaded = false; // Update flag
    } else {
        getOrderInfo();
    }
}

function getOrderInfo() {
    let username = getCookie('username');  //infos aus der db zu den bestellungen eines users holen
    $.ajax({
        type: "GET",
        url: "../../Backend/logic/requestHandler.php",
        data: {
            method: "getOrders",
            param: JSON.stringify({
                username: username,
            }),
        },
        dataType: "json",
        success: function (response) {
            if (!(response.length === 1 && response[0].length === 0)) { //wenn es keine bestellungen gibt
                $('#ordersTable').removeClass('d-none');
                for (let i in response) {
                    displayOrder(response[i]); //bestellungsanzeigen funktion aufrufen
                }
                $('#loadReceipts').text('Unload Receipts'); // Change button text to "Unload Receipts"
                ordersLoaded = true; // Update flag
            } else {
                $('#message-container').html('<div class="alert alert-warning" role="alert">You haven\'t ordered anything yet!</div>');
                $('#ordersModal').modal('show');
            }
        },
        error: function () {
            alert("Fehler beim Laden der Bestellungen!");
        },
    });
}

function displayOrder(order) { //bestellungen anzeigen
    const ordersTable = $('#ordersTable');
    //es wird ein arr(order) weitergegenen mit einer bestimmten rechnungsid

    //table erstellen für je rechnungsid
    const table = $('<table>').addClass('table table-striped');
    const thead = $('<thead>').append('<tr><th>Articles</th><th>Price</th><th>Quantity</th></tr>');
    const tbody = $('<tbody>');

    for (let i = 0; i < order.length; i++) { //details zu den produkten anzeigen
        const productName = order[i].name;
        const price = order[i].preis;
        const quantity = order[i].anzahl;

        const row = $('<tr>');
        const productNameCell = $('<td>').text(productName);
        const priceCell = $('<td>').text(price + '€');
        const quantityCell = $('<td>').text(quantity);

        row.append(productNameCell, priceCell, quantityCell);
        tbody.append(row);
    }

    //Lieferdetails zu der Bestellung einer bestimmten rechnungsid
    table.append(thead, tbody);
    ordersTable.append(table);

    const details = $('<h6>').text('Order details:');
    ordersTable.append(details);

    const date = order[0].datum;
    const addressElement = $('<p>').text('Date: ' + date);
    ordersTable.append(addressElement);

    const address = order[0].adresse + ', ' + order[0].plz + ' ' + order[0].ort + ' ' + order[0].land;
    const addressElement1 = $('<p>').text(' Adress: ' + address);
    ordersTable.append(addressElement1);

    const total = order[0].total;
    const sumElement = $('<p>').addClass('sum-element').text('Total: ' + total + '€');

    const button = $('<button>').attr('type', 'button').addClass('btn btn-success').text('Show receipt');
    let receiptID = order[0].id;
    button.on('click', function () {
        let pdfPath = "../../backend/data/receipts/ZenMonkey_receiptNr" + receiptID + ".pdf" //rechnung drucken 
        window.open(pdfPath, "_blank")
    });

    const sumRow = $('<div>').addClass('row'); //um Button "Rechnung drucken" und die Summe in einer row anzuzeigen
    const leftCol = $('<div>').addClass('col-md-6').append(sumElement);
    const rightCol = $('<div>').addClass('col-md-6 text-right').append(button);
    sumRow.append(leftCol, rightCol);

    ordersTable.append(sumRow);

    $('#ordersModal').modal('show');

    const table1 = $('<table>').addClass('table table-striped');
    const thead1 = $('<thead>').append('<tr><th></th><th></th><th></th><th></th></tr>');
    const tbody1 = $('<tbody>');
    table1.append(thead1, tbody1);
    ordersTable.append(table1);
}

function changeProfileData() {
    let username = getCookie('username');
    let newData = [];
    newData.firstName = $('#firstNamenew').val();
    newData.lastName = $('#lastNamenew').val();
    newData.email = $('#emailnew').val();
    newData.pw = $('#passwordnew').val();
    newData.adress = $('#addressnew').val();
    newData.ort = $('#ortnew').val();
    newData.plz = $('#postcodenew').val();
    newData.land = $('#landnew').val();
    newData.username = $('#usernamenew').val();
    newData.pw_alt = $('#pw_alt').val();

    let allEmpty = Object.values(newData).every(value => value === '');
    if (allEmpty) {
        showModalAlert('Sie haben nichts eingegeben!', 'warning');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '../../Backend/logic/requestHandler.php',
        data: {
            method: 'updateUserData',
            param: JSON.stringify({
                actualusername: username,
                vorname: newData.firstName,
                nachname: newData.lastName,
                email: newData.email,
                pw: newData.pw,
                adresse: newData.adress,
                ort: newData.ort,
                plz: newData.plz,
                land: newData.land,
                username: newData.username,
                pw_alt: newData.pw_alt
            })
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                showModalAlert(response.success, 'success');
                $('#firstNamenew').val('');
                $('#lastNamenew').val('');
                $('#emailnew').val('');
                $('#passwordnew').val('');
                $('#addressnew').val('');
                $('#ortnew').val('');
                $('#landnew').val('');
                $('#postcodenew').val('');
                $('#usernamenew').val('');
                $('#pw_alt').val('');
                loadProfileData();
                //updateFeatures();
            } else if (response.error) {
                showModalAlert(response.error, 'warning');
            }
        },
        error: function () {
            alert("Fehler beim Aktualisieren der Daten!");
        }
    });
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

function loadProfileData() {
    //get the username from the cookie
    let username = getCookie("username");
    // Make an AJAX request to get profile data
    $.ajax({
        type: "GET",
        url: "../../Backend/logic/requestHandler.php",
        data: {
            method: "getProfileData",
            param: JSON.stringify(username),
        },
        dataType: "json",
        success: function (response) {
            // Fill HTML elements with the response data
            $("#firstNameold").text(response.vorname);
            $("#lastNameold").text(response.nachname);
            $("#addressold").text(response.adresse);
            $("#postcodeold").text(response.plz);
            $("#ortold").text(response.ort);
            $("#emailold").text(response.email);
            $("#usernameold").text(response.username);
            $("#landold").text(response.land);
        },
        // Show an error alert if the request fails
        error: function () {
            alert("Fehler beim Login!");
        },
    });
}
