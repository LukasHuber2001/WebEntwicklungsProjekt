$(document).ready(function() {
    // Load header
    $("#header-container").load("../sites/inc/header.html", function () {
        // Get the current page pathname
        const path = window.location.pathname.split("/").pop();
        if (path !== "home.html") {
            $("#search-container").remove(); // Remove the search container for all pages except home.html
        }
        if (path == "checkout.html") {
            $("#cart-icon").remove(); // Remove the search container for all pages except home.html
        }
    });
    

    $("footer").load("../sites/inc/footer.html");
});
