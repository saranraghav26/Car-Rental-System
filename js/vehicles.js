/* ==========================================================
   vehicles.js — Simple Vehicles Script for Beginners
   Handles:
   1. Vehicle Catalogue (vehicles.html): search, filter, sort
   2. Vehicle Details (vehicle-details.html): specs, days, Book Now
   ========================================================== */

$(document).ready(function () {

    // ==========================================
    // 1. VEHICLE CATALOGUE PAGE (vehicles.html)
    // ==========================================
    if ($('#vehiclesRow').length) {
        var allVehicles = [];

        // 1. Load vehicles (works for both local file:// and web server)
        function loadCatalogueVehicles() {
            if (window.VEHICLES_DATA && window.VEHICLES_DATA.length > 0) {
                allVehicles = window.VEHICLES_DATA;
                populateLocations(allVehicles);
                renderVehicles(allVehicles);
                return;
            }

            $.ajax({
                url: 'json/vehicles.json',
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                allVehicles = (data && data.vehicles) ? data.vehicles : (Array.isArray(data) ? data : []);
                populateLocations(allVehicles);
                renderVehicles(allVehicles);
            }).fail(function () {
                if (window.VEHICLES_DATA && window.VEHICLES_DATA.length > 0) {
                    allVehicles = window.VEHICLES_DATA;
                    populateLocations(allVehicles);
                    renderVehicles(allVehicles);
                } else {
                    $('#vehiclesRow').html('<p class="text-center text-muted py-4">Could not load vehicle catalogue.</p>');
                }
            });
        }
        loadCatalogueVehicles();

        // 2. Populate location options
        function populateLocations(list) {
            var locations = [];
            for (var i = 0; i < list.length; i++) {
                var loc = list[i].location;
                if (locations.indexOf(loc) === -1) {
                    locations.push(loc);
                }
            }
            locations.sort();

            var $select = $('#filterLocation');
            $select.empty().append('<option value="">All Locations</option>');
            for (var j = 0; j < locations.length; j++) {
                $select.append('<option value="' + locations[j] + '">' + locations[j] + '</option>');
            }
        }

        // 3. Render vehicle cards
        function renderVehicles(list) {
            var $row = $('#vehiclesRow');
            $row.empty();

            for (var i = 0; i < list.length; i++) {
                var car = list[i];
                var availBadge = car.availability
                    ? '<span class="avail-badge available">Available</span>'
                    : '<span class="avail-badge unavailable">Unavailable</span>';
                var imgSrc = car.image || 'images/vehicles/camry.jpg';

                var html = 
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
                                '<div class="d-flex justify-content-between align-items-center mb-1">' +
                                    '<span class="vehicle-meta">' + car.seats + ' Seats &middot; ' + car.transmission + '</span>' +
                                    availBadge +
                                '</div>' +
                                '<div class="vehicle-meta mb-3">' + car.location + '</div>' +
                                '<div class="d-flex justify-content-between align-items-center">' +
                                    '<p class="vehicle-price">₹' + car.pricePerDay + '<small>/day</small></p>' +
                                    '<button type="button" class="btn btn-view" data-id="' + car.vehicleId + '">View Details</button>' +
                                '</div>' +
                            '</div>' +
                        '</article>' +
                    '</div>';
                $row.append(html);
            }

            $('#vehiclesCount').text('Showing ' + list.length + ' vehicles.');
            $('#vehiclesEmpty').toggleClass('d-none', list.length > 0);
        }

        // 4. Filter and Sort
        function applyFilters() {
            var nameFilter = $('#filterName').val().toLowerCase().trim();
            var typeFilter = $('#filterType').val().toLowerCase().trim();
            var locFilter = $('#filterLocation').val().toLowerCase().trim();
            var minPrice = parseFloat($('#filterMinPrice').val());
            var maxPrice = parseFloat($('#filterMaxPrice').val());
            var sortBy = $('#sortSelect').val();

            var filtered = [];
            for (var i = 0; i < allVehicles.length; i++) {
                var car = allVehicles[i];

                if (nameFilter !== '' && car.name.toLowerCase().indexOf(nameFilter) === -1) continue;
                if (typeFilter !== '' && car.type.toLowerCase() !== typeFilter) continue;
                if (locFilter !== '' && car.location.toLowerCase() !== locFilter) continue;
                if (!isNaN(minPrice) && car.pricePerDay < minPrice) continue;
                if (!isNaN(maxPrice) && car.pricePerDay > maxPrice) continue;

                filtered.push(car);
            }

            // Simple sorting
            if (sortBy === 'price-asc') {
                filtered.sort(function (a, b) { return a.pricePerDay - b.pricePerDay; });
            } else if (sortBy === 'price-desc') {
                filtered.sort(function (a, b) { return b.pricePerDay - a.pricePerDay; });
            } else if (sortBy === 'name-asc') {
                filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
            }

            renderVehicles(filtered);
        }

        $('#filterForm').on('submit', function (e) {
            e.preventDefault();
            applyFilters();
        });

        $('#sortSelect').on('change', function () {
            applyFilters();
        });

        $('#btnClearFilters, #btnClearEmpty').on('click', function () {
            $('#filterForm')[0].reset();
            renderVehicles(allVehicles);
        });

        // 5. Click View Details -> save vehicle ID and go to vehicle-details.html
        $('#vehiclesRow').on('click', '.btn-view, .vehicle-card', function (e) {
            var id = $(this).data('id') || $(this).find('.btn-view').data('id');
            if (id) {
                localStorage.setItem('ww_selected_vehicle', id);
                window.location.href = 'vehicle-details.html?id=' + id;
            }
        });
    }


    // ==========================================
    // 2. VEHICLE DETAILS PAGE (vehicle-details.html)
    // ==========================================
    if ($('#detailsContent').length || $('#detailTile').length) {
        var urlParams = new URLSearchParams(window.location.search);
        var paramId = parseInt(urlParams.get('id'), 10);
        var vehicleId = paramId || parseInt(localStorage.getItem('ww_selected_vehicle'), 10) || 1;
        var currentCar = null;

        function loadDetailsVehicle() {
            function findAndDisplay(list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].vehicleId === vehicleId) {
                        currentCar = list[i];
                        break;
                    }
                }
                if (!currentCar && list.length > 0) {
                    currentCar = list[0];
                }
                if (currentCar) {
                    displayDetails(currentCar);
                } else {
                    $('#detailsContent').addClass('d-none');
                    $('#detailsError').removeClass('d-none');
                }
            }

            if (window.VEHICLES_DATA && window.VEHICLES_DATA.length > 0) {
                findAndDisplay(window.VEHICLES_DATA);
                return;
            }

            $.ajax({
                url: 'json/vehicles.json',
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                var list = (data && data.vehicles) ? data.vehicles : (Array.isArray(data) ? data : []);
                findAndDisplay(list.length ? list : (window.VEHICLES_DATA || []));
            }).fail(function () {
                findAndDisplay(window.VEHICLES_DATA || []);
            });
        }
        loadDetailsVehicle();

        function displayDetails(car) {
            $('#detailsContent').removeClass('d-none');
            $('#detailsError').addClass('d-none');

            var imgSrc = car.image || 'images/vehicles/camry.jpg';
            $('#detailTile').html('<img src="' + imgSrc + '" alt="' + car.name + '" class="detail-tile-img" onerror="this.src=\'images/vehicles/camry.jpg\'">');
            $('#detailName').text(car.name);
            $('#detailType').text(car.type);
            $('#detailLocation').text(car.location + ' · ' + car.type);
            $('#detailAvailability').text(car.availability ? 'Available' : 'Unavailable')
                .removeClass('available unavailable')
                .addClass(car.availability ? 'available' : 'unavailable');
            $('#detailDescription').text(car.description || 'No description available.');

            // Features list
            var $features = $('#detailFeatures');
            $features.empty();
            if (car.features && car.features.length > 0) {
                for (var f = 0; f < car.features.length; f++) {
                    $features.append('<li>' + car.features[f] + '</li>');
                }
            } else {
                $features.append('<li>Standard features included</li>');
            }

            // Specs and summary
            $('#summaryPrice').text('₹' + car.pricePerDay + ' / day');
            $('#specSeats').text(car.seats + ' Seats');
            $('#specTransmission').text(car.transmission || 'Automatic');
            $('#specFuel').text(car.fuelType || car.fuel || 'Petrol');
            $('#specYear').text(car.year || '2024');

            updateTotal();
        }

        function updateTotal() {
            var raw = $('#daysInput').val();
            // If user cleared the input while typing, don't force an overwrite yet
            if (raw === '' || isNaN(raw)) {
                return;
            }
            var days = parseInt(raw, 10);
            if (days < 1) days = 1;

            if (currentCar) {
                var total = currentCar.pricePerDay * days;
                $('#summaryTotal').text('₹' + total);
            }
        }

        // Stepper minus button
        $('#btnDaysMinus').on('click', function (e) {
            e.preventDefault();
            var current = parseInt($('#daysInput').val(), 10) || 1;
            if (current > 1) {
                $('#daysInput').val(current - 1);
                updateTotal();
            }
        });

        // Stepper plus button
        $('#btnDaysPlus').on('click', function (e) {
            e.preventDefault();
            var current = parseInt($('#daysInput').val(), 10) || 1;
            $('#daysInput').val(current + 1);
            updateTotal();
        });

        // When user types in the input box
        $('#daysInput').on('input change', updateTotal);

        // When user leaves the input box, ensure valid number >= 1
        $('#daysInput').on('blur', function () {
            var raw = $('#daysInput').val();
            var days = parseInt(raw, 10);
            if (isNaN(days) || days < 1) {
                days = 1;
            }
            $('#daysInput').val(days);
            updateTotal();
        });

        // Click 'Book Now' -> save booking data and go to booking.html
        $('#btnBookNow').on('click', function () {
            if (!currentCar) return;

            var days = parseInt($('#daysInput').val(), 10) || 1;
            var bookingInfo = {
                vehicleId: currentCar.vehicleId,
                name: currentCar.name,
                type: currentCar.type,
                image: currentCar.image,
                location: currentCar.location,
                seats: currentCar.seats,
                pricePerDay: currentCar.pricePerDay,
                days: days
            };

            localStorage.setItem('ww_booking', JSON.stringify(bookingInfo));
            window.location.href = 'booking.html';
        });
    }

    // ==========================================
    // 3. LOGOUT BUTTON
    // ==========================================
    $('#btnLogout').on('click', function () {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('ww_user');
            window.location.href = 'login.html';
        }
    });

});