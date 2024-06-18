$(document).ready(function () {
//get username cookie
    let username = getCookie('username');

    //redirect user to profil.html if he is logged in
    const currentPage = window.location.pathname.split("/").pop();
    if ((currentPage === "login.html" || currentPage === "registration.html") && username) {
        window.location.href = "profil.html";
    }
    //login function
    $(document).on('click', '#btn-login', function () {
        let userInput = $('#userInput').val().trim();
        let passwordInput = $('#passwordInput').val().trim();
    
        //check if email and password are not empty
        if (userInput === '') {
            alert('Enter a username or email!', 'warning');
            return;
        }
    
        if (passwordInput === '') {
            alert('Enter a password!', 'warning');
            return;
        }
    
//ajax call for loginUser function
        $.ajax({
            type: 'POST',
            url: '../../backend/logic/requestHandler.php',
            data: {
                method: 'loginUser',
                param: JSON.stringify({ 
                    userInput: userInput,
                    passwordInput: passwordInput,
                    rememberCheck: $('#rememberCheck').prop('checked')
                })
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    //if login was successfull
                    alert(response.success);
                    window.location.href = 'home.html';
                } else if (response.error) {
                    alert(response.error, 'warning');
                }
            },
            error: function () {
                alert('Error during request!');
            }
        });
    });
    

  //register function
  $(document).on("click", "#btn-register", function () {
    //check if TOS are checked
    if (!$("#termsCheck").prop("checked")) {
        $("#termsCheck").addClass("is-invalid");
        alert("Please accept our Terms of Service!", "warning");
        return;
    }
    if (!validateRegisterForm()) {
        alert("Please fill out the form correctly", "warning");
        return;
    }
//save data from form
    const registerData = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        address: $("#address").val(),
        postcode: $("#postcode").val(),
        city: $("#city").val(),
        country: $("#country").val(),
        email: $("#email").val(),
        username: $("#username").val(),
        password: $("#password").val(),
        password2: $("#password2").val()
    };
//call the registerUser function from php
    $.ajax({
        type: "POST",
        url: "../../backend/logic/requestHandler.php",
        data: {
            method: "registerUser",
            param: JSON.stringify(registerData), // Ensure this is a JSON string
        },
        dataType: "json",
        success: function (response) {
            if (response.success) {
                $("#firstName").val("");
                $("#lastName").val("");
                $("#address").val("");
                $("#postcode").val("");
                $("#city").val("");
                $("#country").val("");
                $("#email").val("");
                $("#username").val("");
                $("#password").val("");
                $("#password2").val("");
                document.getElementById('termsCheck').checked = false;
                alert("Registration successful, you can now log in!", "success");
                window.location.href = "login.html";
            } else if (response.error) {
                alert(response.error, "danger");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error response from server:", xhr.responseText);
            alert("An Error has occured trying to register, please contact support!");
        },
    });
});

//function to call in validateRegisterForm, validates the input in the form
function validateInput(input) {
    if (input.val().trim().length === 0) {
        input.addClass("is-invalid");
        return false;
    } else {
        input.removeClass("is-invalid");
        return true;
    }
}
//check client side if the form was correctly filled out
function validateRegisterForm() {
    let isValid = true;
    isValid = validateInput($("#firstName")) && isValid;
    isValid = validateInput($("#lastName")) && isValid;
    isValid = validateInput($("#address")) && isValid;
    isValid = validateInput($("#postcode")) && isValid;
    isValid = validateInput($("#city")) && isValid;
    isValid = validateInput($("#country")) && isValid;

    let email = $("#email").val().trim();
    if (email.length === 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $("#email").addClass("is-invalid");
        isValid = false;
    } else {
        $("#email").removeClass("is-invalid");
    }

    isValid = validateInput($("#username")) && isValid;
    if ($("#password").val().trim().length < 8) {
        $("#password").addClass("is-invalid");
        isValid = false;
    } else {
        $("#password").removeClass("is-invalid");
    }
    if ($("#password2").val().trim().length < 8) {
        $("#password2").addClass("is-invalid");
        isValid = false;
    } else {
        $("#password2").removeClass("is-invalid");
    }
    if ($("#password").val() != $("#password2").val()) {
        $("#password").addClass("is-invalid");
        $("#password2").addClass("is-invalid");
        isValid = false;
    } else {
        $("#password").removeClass("is-invalid");
        $("#password2").removeClass("is-invalid");
    }

    return isValid;
}

});

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