/* ==========================================================
   booking.js — Simple Booking & Checkout Script for Beginners
   Handles:
   1. Booking Checkout (booking.html)
   2. Booking Confirmation (confirmation.html)
   3. My Bookings list & Cancel (my-bookings.html)
   ========================================================== */

$(document).ready(function () {

    // ==========================================
    // 1. BOOKING CHECKOUT PAGE (booking.html)
    // ==========================================
    if ($('#bookingContent').length) {
        var selectedCar = JSON.parse(localStorage.getItem('ww_booking') || 'null');
        var currentUser = JSON.parse(localStorage.getItem('ww_user') || 'null');

        // Check if car is selected
        if (!selectedCar) {
            var fallbackCars = (typeof VEHICLES_DATA !== 'undefined' && VEHICLES_DATA.length) ? VEHICLES_DATA : null;
            if (fallbackCars && fallbackCars.length > 0) {
                var firstCar = fallbackCars[0];
                selectedCar = {
                    vehicleId: firstCar.vehicleId,
                    name: firstCar.name,
                    type: firstCar.type,
                    image: firstCar.image,
                    location: firstCar.location,
                    seats: firstCar.seats,
                    pricePerDay: firstCar.pricePerDay,
                    days: 2
                };
                localStorage.setItem('ww_booking', JSON.stringify(selectedCar));
            } else {
                $('#bookingContent').addClass('d-none');
                $('#bookingError').removeClass('d-none');
                return;
            }
        }

        // Check if user is logged in (use active user or guest session for easy testing)
        if (!currentUser || !currentUser.email) {
            currentUser = {
                name: 'Guest User',
                email: 'user@example.com',
                phone: '9876543210'
            };
            localStorage.setItem('ww_user', JSON.stringify(currentUser));
        }

        // Make booking content visible
        $('#bookingContent').removeClass('d-none');
        $('#bookingError').addClass('d-none');

        // Pre-fill user data
        $('#cusName').val(currentUser.name || '');
        $('#cusEmail').val(currentUser.email || '');
        $('#cusPhone').val(currentUser.phone || '');

        // Pre-fill car summary
        var pricePerDay = selectedCar.pricePerDay || 50;
        var carImg = selectedCar.image || 'images/vehicles/camry.jpg';
        $('#summaryImg').attr('src', carImg);
        $('#summaryName').text(selectedCar.name);
        $('#summaryType').text(selectedCar.type);
        $('#summaryLocation').text(selectedCar.location);
        $('#summarySeats').text(selectedCar.seats + ' Seats');
        $('#summaryPrice').text('₹' + pricePerDay + ' / day');

        // Default pickup today, return in chosen days
        var today = new Date().toISOString().split('T')[0];
        $('#pickupDate').val(today);
        var returnObj = new Date();
        returnObj.setDate(returnObj.getDate() + (selectedCar.days || 2));
        $('#returnDate').val(returnObj.toISOString().split('T')[0]);

        // Calculate rental days and total
        function calculateTotal() {
            var pickStr = $('#pickupDate').val();
            var retStr = $('#returnDate').val();

            if (!pickStr || !retStr) return 1;

            var d1 = new Date(pickStr);
            var d2 = new Date(retStr);
            var diffMs = d2 - d1;
            var days = Math.round(diffMs / (1000 * 60 * 60 * 24));

            if (days < 1) days = 1;

            $('#summaryDays').text(days + (days === 1 ? ' day' : ' days'));
            $('#summaryTotal').text('₹' + (pricePerDay * days));
            return days;
        }
        calculateTotal();

        // Update when user changes date inputs
        $('#pickupDate, #returnDate').on('change input', function () {
            calculateTotal();
        });

        // Increase days button in booking summary
        $('#btnSummaryDaysPlus').on('click', function (e) {
            e.preventDefault();
            var currentDays = calculateTotal();
            var pickStr = $('#pickupDate').val();
            if (!pickStr) {
                pickStr = new Date().toISOString().split('T')[0];
                $('#pickupDate').val(pickStr);
            }
            var d = new Date(pickStr);
            d.setDate(d.getDate() + currentDays + 1);
            $('#returnDate').val(d.toISOString().split('T')[0]);
            calculateTotal();
        });

        // Decrease days button in booking summary
        $('#btnSummaryDaysMinus').on('click', function (e) {
            e.preventDefault();
            var currentDays = calculateTotal();
            if (currentDays <= 1) return;
            var pickStr = $('#pickupDate').val();
            if (!pickStr) {
                pickStr = new Date().toISOString().split('T')[0];
                $('#pickupDate').val(pickStr);
            }
            var d = new Date(pickStr);
            d.setDate(d.getDate() + currentDays - 1);
            $('#returnDate').val(d.toISOString().split('T')[0]);
            calculateTotal();
        });

        // Payment method toggle (Cash vs Card)
        $('input[name="payment"]').on('change', function () {
            var isCard = $(this).val() === 'card';
            $('#cardFields').toggleClass('d-none', !isCard);
            $('.payment-option').removeClass('selected');
            $(this).closest('.payment-option').addClass('selected');
        });

        // Submit Booking Form
        function submitBooking() {
            var name = $('#cusName').val().trim();
            var email = $('#cusEmail').val().trim();
            var phone = $('#cusPhone').val().trim();
            var pickupDate = $('#pickupDate').val();
            var returnDate = $('#returnDate').val();
            var pickupLocation = $('#pickupLocation').val().trim() || selectedCar.location || 'Downtown';
            var returnLocation = $('#returnLocation').val().trim() || selectedCar.location || 'Downtown';
            var payment = $('input[name="payment"]:checked').val() || 'cash';
            var termsAgreed = $('#termsCheck').is(':checked');

            // Basic validation
            if (name === '') {
                alert('Please enter your full name.');
                $('#cusName').focus();
                return;
            }
            if (email === '') {
                alert('Please enter your email.');
                $('#cusEmail').focus();
                return;
            }
            if (phone === '') {
                alert('Please enter your phone number.');
                $('#cusPhone').focus();
                return;
            }
            if (!pickupDate) {
                alert('Please select a pick-up date.');
                $('#pickupDate').focus();
                return;
            }
            if (!returnDate) {
                alert('Please select a return date.');
                $('#returnDate').focus();
                return;
            }
            if (new Date(returnDate) < new Date(pickupDate)) {
                alert('Return date cannot be earlier than pick-up date.');
                $('#returnDate').focus();
                return;
            }

            // Card payment check
            if (payment === 'card') {
                var cardNum = $('#cardNumber').val().trim();
                var cardExp = $('#cardExpiry').val().trim();
                var cardCvv = $('#cardCvv').val().trim();
                if (cardNum === '' || cardExp === '' || cardCvv === '') {
                    alert('Please enter your card number, expiry date, and CVV.');
                    return;
                }
            }

            if (!termsAgreed) {
                alert('Please accept the Terms & Conditions.');
                $('#termsCheck').focus();
                return;
            }

            var days = calculateTotal();
            var total = pricePerDay * days;

            // Create new booking record
            var randomNum = Math.floor(Math.random() * 900000 + 100000);
            var newBooking = {
                bookingId: 'SVD-' + randomNum,
                vehicleId: selectedCar.vehicleId,
                vehicleName: selectedCar.name,
                vehicleType: selectedCar.type,
                vehicleImage: selectedCar.image || 'images/vehicles/camry.jpg',
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                pickupDate: pickupDate,
                returnDate: returnDate,
                pickupLocation: pickupLocation,
                returnLocation: returnLocation,
                paymentMethod: payment,
                days: days,
                totalPrice: total,
                status: 'Confirmed'
            };

            // Save for Confirmation page
            localStorage.setItem('ww_latest_booking', JSON.stringify(newBooking));

            // Save to My Bookings list
            var allBookings = JSON.parse(localStorage.getItem('ww_bookings') || '[]');
            allBookings.push(newBooking);
            localStorage.setItem('ww_bookings', JSON.stringify(allBookings));

            // Go to confirmation page
            window.location.href = 'confirmation.html';
        }

        // Handle both Confirm button click and form submit
        $('#btnConfirm').on('click', function (e) {
            e.preventDefault();
            submitBooking();
        });

        $('#bookingForm').on('submit', function (e) {
            e.preventDefault();
            submitBooking();
        });
    }


    // ==========================================
    // 2. CONFIRMATION PAGE (confirmation.html)
    // ==========================================
    if ($('#confirmationContent').length) {
        var latest = JSON.parse(localStorage.getItem('ww_latest_booking') || 'null');

        if (!latest) {
            var fallbackCars = (typeof VEHICLES_DATA !== 'undefined' && VEHICLES_DATA.length) ? VEHICLES_DATA : null;
            var car = (fallbackCars && fallbackCars.length) ? fallbackCars[0] : null;
            if (car) {
                latest = {
                    bookingId: 'SVD-548192',
                    vehicleId: car.vehicleId,
                    vehicleName: car.name,
                    vehicleType: car.type,
                    vehicleImage: car.image,
                    customerName: 'Guest User',
                    customerEmail: 'user@example.com',
                    customerPhone: '9876543210',
                    pickupDate: new Date().toISOString().split('T')[0],
                    returnDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
                    pickupLocation: car.location,
                    returnLocation: car.location,
                    paymentMethod: 'cash',
                    days: 2,
                    totalPrice: car.pricePerDay * 2,
                    status: 'Confirmed'
                };
            } else {
                $('#confirmationContent').addClass('d-none');
                $('#confirmationError').removeClass('d-none');
                return;
            }
        }

        $('#confirmationContent').removeClass('d-none');
        $('#confirmationError').addClass('d-none');

        // Fill confirmation details
        $('#confirmationId').text(latest.bookingId);
        $('#bookingStatus').text(latest.status);
        $('#vehicleName').text(latest.vehicleName);
        $('#vehicleType').text(latest.vehicleType);
        $('#vehicleLocation').text(latest.pickupLocation);
        $('#confirmationImg').attr('src', latest.vehicleImage || 'images/vehicles/camry.jpg');

        $('#summaryCusName').text(latest.customerName);
        $('#summaryCusEmail').text(latest.customerEmail);
        $('#summaryCusPhone').text(latest.customerPhone);

        $('#summaryPickupDate').text(latest.pickupDate);
        $('#summaryReturnDate').text(latest.returnDate);
        $('#summaryPickupLoc').text(latest.pickupLocation);
        $('#summaryReturnLoc').text(latest.returnLocation);
        $('#summaryDays').text(latest.days);
        $('#summaryDays2').text(latest.days);

        var payName = (latest.paymentMethod === 'card') ? 'Card Payment' : 'Cash on Delivery';
        $('#summaryPayment').text(payName);
        $('#summaryTotal').text('₹' + latest.totalPrice);
        $('#summaryPricePerDay').text('₹' + Math.round(latest.totalPrice / latest.days));

        // Print receipt
        $('#btnPrint').on('click', function () {
            window.print();
        });
    }


    // ==========================================
    // 3. MY BOOKINGS PAGE (my-bookings.html)
    // ==========================================
    if ($('#bookingsRow').length) {
        var user = JSON.parse(localStorage.getItem('ww_user') || 'null');

        if (!user || !user.email) {
            $('#bookingControls').addClass('d-none');
            $('#bookingsRow').addClass('d-none');
            $('#bookingsEmpty').removeClass('d-none');
            return;
        }

        var bookings = JSON.parse(localStorage.getItem('ww_bookings') || '[]');

        function renderBookings(list) {
            var $row = $('#bookingsRow');
            $row.empty();

            if (list.length === 0) {
                $('#bookingsEmpty').removeClass('d-none');
                $('#bookingsRow').addClass('d-none');
                $('#bookingCount').text('0 bookings');
                return;
            }

            $('#bookingsEmpty').addClass('d-none');
            $('#bookingsRow').removeClass('d-none');
            $('#bookingCount').text('Showing ' + list.length + ' bookings');

            for (var i = 0; i < list.length; i++) {
                var b = list[i];
                var badgeClass = (b.status === 'Cancelled') ? 'status-cancelled' : 'status-confirmed';
                var cancelBtn = (b.status === 'Confirmed')
                    ? '<button class="btn btn-sm btn-outline-danger btn-cancel-booking" data-id="' + b.bookingId + '">Cancel</button>'
                    : '<span class="text-muted small">Cancelled</span>';

                var card = 
                    '<div class="col-12 col-lg-6 mb-4">' +
                        '<div class="booking-card p-3 border rounded">' +
                            '<div class="d-flex justify-content-between align-items-start mb-2">' +
                                '<div>' +
                                    '<h5 class="fw-bold mb-1">' + b.vehicleName + '</h5>' +
                                    '<span class="text-muted small">Booking ID: ' + b.bookingId + '</span>' +
                                '</div>' +
                                '<span class="booking-status-badge ' + badgeClass + '">' + b.status + '</span>' +
                            '</div>' +
                            '<p class="mb-1"><strong>Dates:</strong> ' + b.pickupDate + ' to ' + b.returnDate + ' (' + b.days + ' days)</p>' +
                            '<p class="mb-2"><strong>Total Price:</strong> ₹' + b.totalPrice + '</p>' +
                            '<div class="text-end">' + cancelBtn + '</div>' +
                        '</div>' +
                    '</div>';
                $row.append(card);
            }
        }

        renderBookings(bookings);

        // Cancel Booking action
        $('#bookingsRow').on('click', '.btn-cancel-booking', function () {
            var id = $(this).data('id');
            if (confirm('Are you sure you want to cancel this booking?')) {
                for (var i = 0; i < bookings.length; i++) {
                    if (bookings[i].bookingId === id) {
                        bookings[i].status = 'Cancelled';
                        break;
                    }
                }
                localStorage.setItem('ww_bookings', JSON.stringify(bookings));
                renderBookings(bookings);
                alert('Booking cancelled successfully.');
            }
        });

        // Search & Filter
        $('#bookingSearch, #statusFilter').on('input change', function () {
            var searchTxt = $('#bookingSearch').val().toLowerCase().trim();
            var statusVal = $('#statusFilter').val();

            var filtered = [];
            for (var i = 0; i < bookings.length; i++) {
                var b = bookings[i];
                var matchStatus = (statusVal === 'all' || b.status === statusVal);
                var matchText = (searchTxt === '' || b.bookingId.toLowerCase().includes(searchTxt) || b.vehicleName.toLowerCase().includes(searchTxt));

                if (matchStatus && matchText) {
                    filtered.push(b);
                }
            }
            renderBookings(filtered);
        });
    }

    // ==========================================
    // 4. LOGOUT BUTTON
    // ==========================================
    $('#btnLogout').on('click', function () {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('ww_user');
            window.location.href = 'login.html';
        }
    });

});