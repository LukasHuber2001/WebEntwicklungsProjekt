$(document).ready(function(){
    let isLoggedIn = !!getCookie('username');
    let isAdmin = getCookie('admin');
    let dashboard = document.getElementById("adminDashboard");
    dashboard.style.visibility = "hidden";
    let userManagement = document.getElementById("userManagement");
    userManagement.style.visibility = "hidden";
    let productManagement = document.getElementById("productManagement");
    productManagement.style.visibility = "hidden";
    let profilManagement = document.getElementById("profilManagement");
    profilManagement.style.visibility = "hidden";
    
    console.log(isAdmin);
    if(isAdmin == 1){
        dashboard.style.visibility = "visible";
        userManagement.style.visibility = "visible";
        productManagement.style.visibility = "visible";
        profilManagement.style.visibility = "visible";

    }else if(isLoggedIn == true){
        profilManagement.style.visibility = "visible";
    }else{
        alert("You need to be Logged in to use this feature!");
        setTimeout(function () {
            window.location.href = "login.html"; //will redirect to login.html
         }, 2000);
    }
    loadProfileData
    
$(document).on('click', '#changeButton', function () {
    changeProfileData();
  })})
 // Wenn man seine Profildaten ändern will, dann wird die Funktion changeProfileData aufgerufen,
  // welche einen Postrequest an den requestHandler schickt, der die updateuserData-Method aufruft.
  // Im Success-Fall werden die aktualisierten User-Daten geladen und im Error-Fall eine entsprechende Meldung.
    function changeProfileData() {
    let username = getCookie('username');
    let newData = [];
    newData.firstName = $('#firstNamenew').val();
    newData.lastName = $('#lastNamenew').val();
    newData.email = $('#emailnew').val();
    newData.pw = $('#passwordnew').val();
    newData.adress = $('#addressnew').val();
    newData.city = $('#citynew').val();
    newData.plz = $('#postcodenew').val();
    newData.username = $('#usernamenew').val();
    newData.pw_alt = $('#pw_alt').val();
    let allEmpty = Object.values(newData).every(value => value === '');
    let oldFormOfAddress = $('#formofAddressold').text();
    newData.formofAddress = $('#formofAddressnew').val();
    if (allEmpty && (oldFormOfAddress == newData.formofAddress)) {
      showModalAlert('Sie haben nichts eingegeben!', 'warning');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '../Backend/logic/requestHandler.php',
      data: {
        method: 'updateUserData',
        param: JSON.stringify({
          actualusername: username,
          firstName: newData.firstName,
          lastName: newData.lastName,
          email: newData.email,
          pw: newData.pw,
          adress: newData.adress,
          city: newData.city,
          postcode: newData.plz,
          username: newData.username,
          formofAddress: newData.formofAddress,
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
          $('#citynew').val('');
          $('#postcodenew').val('');
          $('#usernamenew').val('');
          $('#pw_alt').val('');
          loadProfileData();
          updateFeatures();
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
    let username = getCookie("username");
    $.ajax({
      type: "GET",
      url: "../Backend/logic/requestHandler.php",
      data: {
        method: "getProfileData",
        param: JSON.stringify(username),
      },
      dataType: "json",
      success: function (response) {
        $("#firstNameold").text(response.vorname);
        $("#lastNameold").text(response.nachname);
        $("#addressold").text(response.adresse);
        $("#postcodeold").text(response.plz);
        $("#ortold").text(response.ort);
        $("#emailold").text(response.email);
        $("#usernameold").text(response.username);
        $("#landold").text(response.land);
      },
      error: function () {
        alert("Fehler beim Login!");
      },
    });
  }

