$(document).ready(function() {
    // Load header
    $("#header-container").load("../sites/inc/header.html", function () {
        // Get the current page pathname
        const path = window.location.pathname.split("/").pop();
        if (path !== "index.html") {
            $("#search-container").remove(); // Remove the search container for all pages except index.html
        }
    });

    $("footer").load("../sites/inc/footer.html");
});
