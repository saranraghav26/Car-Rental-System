/* ==========================================================
   main.js — Simple Main Script for Beginners
   Handles:
   1. Splash screen continue click (index.html)
   2. Home page vehicle loading & search (home.html)
   3. Navigation to Vehicle Details & Logout
   ========================================================== */

$(document).ready(function () {

    // ==========================================
    // 1. SPLASH SCREEN (index.html)
    // ==========================================
    if ($('#splash').length) {
        // When clicking 'Continue', go straight to login
        $('#btnContinue').on('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    // ==========================================
    // 2. HOME PAGE (home.html)
    // ==========================================
    if ($('#featuredRow').length) {
        var allVehicles = [];

        // 1. Load vehicles (works for both local file:// and web server)
        function loadHomeVehicles() {
            if (window.VEHICLES_DATA && window.VEHICLES_DATA.length > 0) {
                allVehicles = window.VEHICLES_DATA;
                displayVehicles(allVehicles);
                $('#heroVehicleCount').text(allVehicles.length);
                return;
            }

            $.ajax({
                url: 'json/vehicles.json',
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                allVehicles = (data && data.vehicles) ? data.vehicles : (Array.isArray(data) ? data : []);
                displayVehicles(allVehicles);
                $('#heroVehicleCount').text(allVehicles.length);
            }).fail(function () {
                if (window.VEHICLES_DATA && window.VEHICLES_DATA.length > 0) {
                    allVehicles = window.VEHICLES_DATA;
                    displayVehicles(allVehicles);
                    $('#heroVehicleCount').text(allVehicles.length);
                } else {
                    $('#featuredRow').html('<p class="text-center text-muted py-4">Could not load vehicles.</p>');
                }
            });
        }
        loadHomeVehicles();

        // 2. Function to display vehicle cards on the page
        function displayVehicles(list) {
            var $row = $('#featuredRow');
            $row.empty(); // Clear old cards

            // Loop through each vehicle and create HTML card
            for (var i = 0; i < list.length; i++) {
                var car = list[i];
                var imgSrc = car.image || 'images/vehicles/camry.jpg';
                var cardHtml = 
                    '<div class="col-12 col-sm-6 col-lg-4 col-xl-3">' +
                        '<article class="vehicle-card h-100" data-id="' + car.vehicleId + '" style="cursor: pointer;">' +
                            '<div class="vehicle-tile-wrap">' +
                                '<img src="' + imgSrc + '" alt="' + car.name + '" class="vehicle-tile-img" onerror="this.src=\'images/vehicles/camry.jpg\'">' +
                            '</div>' +
                            '<div class="p-3">' +
                                '<div class="d-flex justify-content-between align-items-start gap-2 mb-2">' +
                                    '<h5 class="vehicle-name mb-0">' + car.name + '</h5>' +
                                    '<span class="type-badge">' + car.type + '</span>' +
                                '</div>' +
                                '<div class="vehicle-meta">' +
                                    car.seats + ' Seats &middot; ' + car.transmission + ' &middot; ' + car.location +
                                '</div>' +
                                '<div class="d-flex justify-content-between align-items-center mt-3">' +
                                    '<p class="vehicle-price">₹' + car.pricePerDay + '<small>/day</small></p>' +
                                    '<button type="button" class="btn btn-view" data-id="' + car.vehicleId + '">View Details</button>' +
                                '</div>' +
                            '</div>' +
                        '</article>' +
                    '</div>';
                $row.append(cardHtml);
            }

            // Show count
            $('#searchCount').text('Showing ' + list.length + ' vehicles.');
            $('#featuredEmpty').toggleClass('d-none', list.length > 0);
        }

        // 3. Search & Filter form
        $('#searchForm').on('submit', function (e) {
            e.preventDefault();

            var searchType = $('#searchType').val().toLowerCase();
            var searchLocation = $('#searchLocation').val().toLowerCase();

            var filtered = [];
            for (var i = 0; i < allVehicles.length; i++) {
                var car = allVehicles[i];
                var matchesType = (searchType === '' || car.type.toLowerCase() === searchType);
                var text = (car.name + ' ' + car.type + ' ' + car.location).toLowerCase();
                var matchesLoc = (searchLocation === '' || text.indexOf(searchLocation) !== -1);

                if (matchesType && matchesLoc) {
                    filtered.push(car);
                }
            }

            displayVehicles(filtered);
            $('#heroVehicleCount').text(filtered.length);
        });

        // Clear search if user empties input
        $('#searchType, #searchLocation').on('input change', function () {
            if (!$('#searchType').val() && !$('#searchLocation').val()) {
                displayVehicles(allVehicles);
                $('#heroVehicleCount').text(allVehicles.length);
            }
        });

        // 4. Clicking 'View Details' -> save vehicle ID and go to vehicle-details.html
        $('#featuredRow').on('click', '.btn-view, .vehicle-card', function (e) {
            var id = $(this).data('id') || $(this).find('.btn-view').data('id');
            if (id) {
                localStorage.setItem('ww_selected_vehicle', id);
                window.location.href = 'vehicle-details.html?id=' + id;
            }
        });
    }

    // ==========================================
    // 3. LOGOUT BUTTON (Navbar)
    // ==========================================
    $('#btnLogout').on('click', function () {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('ww_user');
            window.location.href = 'login.html';
        }
    });

});