/* ==========================================================
   SIMPLE JAVASCRIPT FOR BEGINNERS
   1. Validates form inputs when clicking submit.
   2. If valid, moves to the next page using window.location.
   ========================================================== */

$(document).ready(function () {


    // ==========================================
    // 1. LOGIN FORM VALIDATION (login.html)
    // ==========================================
    $('#loginForm').on('submit', function (e) {
        e.preventDefault(); // Stop page from refreshing

        // 1. Get values from input boxes
        var email = $('#loginEmail').val().trim();
        var password = $('#loginPassword').val().trim();

        // 2. Check if email is empty
        if (email == "") {
            $('#emailError').text("Please enter your email.").show();
            $('#loginEmail').addClass('is-invalid');
            return;
        } else {
            $('#emailError').hide();
            $('#loginEmail').removeClass('is-invalid');
        }

        // 3. Check if password is empty or too short
        if (password == "") {
            $('#passwordError').text("Please enter your password.").show();
            $('#loginPassword').addClass('is-invalid');
            return;
        } else if (password.length < 6) {
            $('#passwordError').text("Password must be at least 6 characters.").show();
            $('#loginPassword').addClass('is-invalid');
            return;
        } else {
            $('#passwordError').hide();
            $('#loginPassword').removeClass('is-invalid');
        }

        // 4. Check for Admin Login
        // Admin ID: admin@svdtravels.com (or 'admin')
        // Admin Password: admin123
        var isAdmin = (email.toLowerCase() === 'admin@svdtravels.com' || email.toLowerCase() === 'admin');
        if (isAdmin) {
            if (password !== 'admin123') {
                $('#passwordError').text("Incorrect admin password. Use: admin123").show();
                $('#loginPassword').addClass('is-invalid');
                return;
            }
        }

        // 5. If validation passed: Save user & Go to Home Page!
        var userName = isAdmin ? 'Admin' : email.split('@')[0];
        var role = isAdmin ? 'Administrator' : 'Member';

        localStorage.setItem('ww_user', JSON.stringify({
            name: userName,
            email: isAdmin ? 'admin@svdtravels.com' : email,
            phone: '9876543210',
            role: role
        }));

        window.location.href = "home.html";
    });


    // ==========================================
    // 2. REGISTER FORM VALIDATION (register.html)
    // ==========================================
    $('#regForm').on('submit', function (e) {
        e.preventDefault(); // Stop page from refreshing

        // Get values from input boxes
        var name = $('#regName').val();
        var email = $('#regEmail').val();
        var phone = $('#regPhone').val();
        var password = $('#regPassword').val();
        var confirmPassword = $('#regConfirm').val();
        var agreeTerms = $('#termsCheck').is(':checked');

        // Check Name
        if (name == "") {
            $('#nameError').text("Please enter your name.").show();
            $('#regName').addClass('is-invalid');
            return;
        } else {
            $('#nameError').hide();
            $('#regName').removeClass('is-invalid');
        }

        // Check Email
        if (email == "") {
            $('#emailError').text("Please enter your email.").show();
            $('#regEmail').addClass('is-invalid');
            return;
        } else {
            $('#emailError').hide();
            $('#regEmail').removeClass('is-invalid');
        }

        // Check Phone
        if (phone == "") {
            $('#phoneError').text("Please enter your phone number.").show();
            $('#regPhone').addClass('is-invalid');
            return;
        } else {
            $('#phoneError').hide();
            $('#regPhone').removeClass('is-invalid');
        }

        // Check Password
        if (password == "") {
            $('#passwordError').text("Please enter a password.").show();
            $('#regPassword').addClass('is-invalid');
            return;
        } else if (password.length < 6) {
            $('#passwordError').text("Password must be at least 6 characters.").show();
            $('#regPassword').addClass('is-invalid');
            return;
        } else {
            $('#passwordError').hide();
            $('#regPassword').removeClass('is-invalid');
        }

        // Check Confirm Password
        if (confirmPassword != password) {
            $('#confirmError').text("Passwords do not match.").show();
            $('#regConfirm').addClass('is-invalid');
            return;
        } else {
            $('#confirmError').hide();
            $('#regConfirm').removeClass('is-invalid');
        }

        // Check Terms Checkbox
        if (!agreeTerms) {
            $('#termsError').text("Please accept the terms.").show();
            return;
        } else {
            $('#termsError').hide();
        }

        // If validation passed: Show alert & Go to Login Page!
        alert("Registration successful! Click OK to go to Login.");
        window.location.href = "login.html";
    });


    // ==========================================
    // 3. SHOW / HIDE PASSWORD (EYE BUTTON)
    // ==========================================
    $('#togglePassword').on('click', function () {
        var input = $('#loginPassword');
        if (input.attr('type') == 'password') {
            input.attr('type', 'text');
        } else {
            input.attr('type', 'password');
        }
    });

    $('#toggleRegPassword').on('click', function () {
        var input = $('#regPassword');
        if (input.attr('type') == 'password') {
            input.attr('type', 'text');
        } else {
            input.attr('type', 'password');
        }
    });

    $('#toggleRegConfirm').on('click', function () {
        var input = $('#regConfirm');
        if (input.attr('type') == 'password') {
            input.attr('type', 'text');
        } else {
            input.attr('type', 'password');
        }
    });


    // ==========================================
    // 4. PROFILE PAGE & LOGOUT (profile.html)
    // ==========================================
    if ($('#profileContent').length || $('#profileView').length) {
        var loggedInUser = JSON.parse(localStorage.getItem('ww_user') || 'null');

        // Fallback user if not logged in so profile works immediately
        if (!loggedInUser || !loggedInUser.email) {
            loggedInUser = {
                name: 'Harish Raghav',
                email: 'user@example.com',
                phone: '9876543210'
            };
            localStorage.setItem('ww_user', JSON.stringify(loggedInUser));
        }

        // Display user data
        function updateProfileDisplay() {
            $('#profileContent').removeClass('d-none');
            $('#profileError').addClass('d-none');

            $('#pvName').text(loggedInUser.name);
            $('#pvEmail').text(loggedInUser.email);
            $('#pvPhone').text(loggedInUser.phone);

            $('#avatarName').text(loggedInUser.name);
            $('#avatarEmail').text(loggedInUser.email);

            // Display role badge (Administrator or Member)
            if (loggedInUser.role === 'Administrator') {
                $('.profile-role').text('SVD Travels Administrator');
            } else {
                $('.profile-role').text('SVD Travels Member');
            }

            // Initials (e.g. "Harish Raghav" -> "HR", "Admin" -> "AD")
            var initials = "U";
            if (loggedInUser.name) {
                var words = loggedInUser.name.trim().split(' ');
                if (words.length > 1) {
                    initials = (words[0][0] + words[1][0]).toUpperCase();
                } else {
                    initials = words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
                }
            }
            $('#avatarInitials').text(initials);
        }
        updateProfileDisplay();

        // Edit Profile Button -> show edit form
        $('#btnEditProfile').on('click', function () {
            $('#pfName').val(loggedInUser.name);
            $('#pfEmail').val(loggedInUser.email);
            $('#pfPhone').val(loggedInUser.phone);

            $('#profileView').addClass('d-none');
            $('#profileEditForm').removeClass('d-none');
        });

        // Cancel Edit Button -> show view mode
        $('#btnCancelProfile').on('click', function () {
            $('#profileEditForm').addClass('d-none');
            $('#profileView').removeClass('d-none');
        });

        // Save Profile Changes
        $('#profileEditForm').on('submit', function (e) {
            e.preventDefault();

            var newName = $('#pfName').val().trim();
            var newEmail = $('#pfEmail').val().trim();
            var newPhone = $('#pfPhone').val().trim();

            if (newName === '') {
                alert('Please enter your full name.');
                $('#pfName').focus();
                return;
            }
            if (newEmail === '') {
                alert('Please enter your email.');
                $('#pfEmail').focus();
                return;
            }
            if (newPhone === '') {
                alert('Please enter your phone number.');
                $('#pfPhone').focus();
                return;
            }

            loggedInUser.name = newName;
            loggedInUser.email = newEmail;
            loggedInUser.phone = newPhone;
            localStorage.setItem('ww_user', JSON.stringify(loggedInUser));

            updateProfileDisplay();

            $('#profileEditForm').addClass('d-none');
            $('#profileView').removeClass('d-none');

            alert('Profile updated successfully!');
        });

        // Change Password Form
        $('#passwordForm').on('submit', function (e) {
            e.preventDefault();

            var currentPw = $('#pwCurrent').val();
            var newPw = $('#pwNew').val();
            var confirmPw = $('#pwConfirm').val();

            if (currentPw === '') {
                alert('Please enter your current password.');
                $('#pwCurrent').focus();
                return;
            }
            if (newPw === '') {
                alert('Please enter your new password.');
                $('#pwNew').focus();
                return;
            }
            if (newPw.length < 6) {
                alert('New password must be at least 6 characters.');
                $('#pwNew').focus();
                return;
            }
            if (newPw !== confirmPw) {
                alert('New passwords do not match.');
                $('#pwConfirm').focus();
                return;
            }

            $('#pwCurrent').val('');
            $('#pwNew').val('');
            $('#pwConfirm').val('');

            alert('Password changed successfully!');
        });

        // Password Show/Hide buttons on Profile page
        $('#btnToggleCurrent').on('click', function () {
            var input = $('#pwCurrent');
            var isPw = input.attr('type') === 'password';
            input.attr('type', isPw ? 'text' : 'password');
            $(this).text(isPw ? 'Hide' : 'Show');
        });

        $('#btnToggleNew').on('click', function () {
            var input = $('#pwNew');
            var isPw = input.attr('type') === 'password';
            input.attr('type', isPw ? 'text' : 'password');
            $(this).text(isPw ? 'Hide' : 'Show');
        });

        $('#btnToggleConfirm').on('click', function () {
            var input = $('#pwConfirm');
            var isPw = input.attr('type') === 'password';
            input.attr('type', isPw ? 'text' : 'password');
            $(this).text(isPw ? 'Hide' : 'Show');
        });
    }

    // Logout Button (Navbar & Profile)
    $('#btnLogout, #btnAccountLogout').on('click', function () {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('ww_user');
            window.location.href = "login.html";
        }
    });

});