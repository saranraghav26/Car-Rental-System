/* ==========================================================
   js/auth.js — Authentication & Form Validation
   Features:
   1. Default accounts initialization (Admin & Demo Member)
   2. Strict & Beginner-Friendly Login Validation
   3. Complete Registration Form Validation & Storage
   4. Show / Hide Password with animated eye icons
   5. Profile management and Password changes with verification
   ========================================================== */

$(document).ready(function () {

    // ==========================================================
    // 0. HELPER FUNCTIONS & DEFAULT ACCOUNTS (localStorage)
    // ==========================================================

    // List of pre-configured accounts
    var DEFAULT_ACCOUNTS = [
        {
            name: "Administrator",
            email: "admin@audicarrental.com",
            phone: "9876543210",
            password: "admin123",
            role: "Administrator"
        },
        {
            name: "Harish Raghav",
            email: "user@audicarrental.com",
            phone: "9876543210",
            password: "user123",
            role: "Member"
        }
    ];

    // Get all registered users from localStorage, initializing if empty
    function getRegisteredUsers() {
        var stored = localStorage.getItem('ww_users');
        var users = [];

        if (stored) {
            try {
                users = JSON.parse(stored);
            } catch (e) {
                users = [];
            }
        }

        // Ensure default admin & demo user always exist in the list
        var hasAdmin = false;
        var hasUser = false;
        for (var i = 0; i < users.length; i++) {
            var em = (users[i].email || "").toLowerCase();
            if (em === "admin@audicarrental.com" || em === "admin@svdtravels.com") hasAdmin = true;
            if (em === "user@audicarrental.com" || em === "user@svdtravels.com") hasUser = true;
        }

        if (!hasAdmin) users.unshift(DEFAULT_ACCOUNTS[0]);
        if (!hasUser) users.push(DEFAULT_ACCOUNTS[1]);

        localStorage.setItem('ww_users', JSON.stringify(users));
        return users;
    }

    // Initialize accounts on load
    getRegisteredUsers();

    // Check if an email string has valid format: user@domain.extension
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check if a phone string has 10 digits
    function isValidPhone(phone) {
        var digitsOnly = phone.replace(/[^0-9]/g, '');
        return digitsOnly.length === 10;
    }


    // ==========================================================
    // 1. LOGIN FORM VALIDATION (login.html)
    // ==========================================================
    if ($('#loginForm').length) {

        // Auto-fill from registration redirect (if user just signed up)
        var regEmail = localStorage.getItem('ww_registered_email');
        if (regEmail) {
            $('#loginEmail').val(regEmail);
            $('#loginSuccessAlert').removeClass('d-none').text('Account created successfully! Please enter your password to sign in.');
            localStorage.removeItem('ww_registered_email');
        }

        // Quick auto-fill buttons for testing
        $('#btnFillAdmin').on('click', function () {
            $('#loginEmail').val('admin@audicarrental.com').trigger('input');
            $('#loginPassword').val('admin123').trigger('input');
            $('#loginAlert').addClass('d-none');
        });

        $('#btnFillUser').on('click', function () {
            $('#loginEmail').val('user@audicarrental.com').trigger('input');
            $('#loginPassword').val('user123').trigger('input');
            $('#loginAlert').addClass('d-none');
        });

        // Clear error states in real-time when user types
        $('#loginEmail').on('input', function () {
            $('#emailGroup').removeClass('has-error');
            $('#loginEmail').removeClass('is-invalid');
            $('#emailError').hide().text('');
            $('#loginAlert').addClass('d-none');
        });

        $('#loginPassword').on('input', function () {
            $('#passwordGroup').removeClass('has-error');
            $('#loginPassword').removeClass('is-invalid');
            $('#passwordError').hide().text('');
            $('#loginAlert').addClass('d-none');
        });

        // Form Submit Handler
        $('#loginForm').on('submit', function (e) {
            e.preventDefault(); // Stop normal form submission

            // Step 1: Read values
            var email = $('#loginEmail').val().trim();
            var password = $('#loginPassword').val().trim();
            var isValid = true;

            // Reset any previous alert banners
            $('#loginAlert').addClass('d-none').text('');
            $('#loginSuccessAlert').addClass('d-none');

            // Step 2: Validate Email
            if (email === "") {
                $('#emailGroup').addClass('has-error');
                $('#loginEmail').addClass('is-invalid');
                $('#emailError').text("Please enter your email address.").show();
                isValid = false;
            } else if (!isValidEmail(email) && email.toLowerCase() !== "admin" && email.toLowerCase() !== "user") {
                $('#emailGroup').addClass('has-error');
                $('#loginEmail').addClass('is-invalid');
                $('#emailError').text("Please enter a valid email address (e.g. name@example.com).").show();
                isValid = false;
            } else {
                $('#emailGroup').removeClass('has-error');
                $('#loginEmail').removeClass('is-invalid');
                $('#emailError').hide();
            }

            // Step 3: Validate Password
            if (password === "") {
                $('#passwordGroup').addClass('has-error');
                $('#loginPassword').addClass('is-invalid');
                $('#passwordError').text("Please enter your password.").show();
                isValid = false;
            } else if (password.length < 6) {
                $('#passwordGroup').addClass('has-error');
                $('#loginPassword').addClass('is-invalid');
                $('#passwordError').text("Password must be at least 6 characters.").show();
                isValid = false;
            } else {
                $('#passwordGroup').removeClass('has-error');
                $('#loginPassword').removeClass('is-invalid');
                $('#passwordError').hide();
            }

            // Stop here if basic field validation failed
            if (!isValid) {
                return;
            }

            // Step 4: Verify credentials against registered accounts
            var users = getRegisteredUsers();
            var emailLower = email.toLowerCase();
            var matchedUser = null;

            for (var i = 0; i < users.length; i++) {
                var u = users[i];
                var uEmail = (u.email || "").toLowerCase();

                // Match by exact email or shortcut ("admin" or "user")
                if (uEmail === emailLower || 
                    (emailLower === "admin" && (uEmail === "admin@audicarrental.com" || uEmail === "admin@svdtravels.com")) ||
                    (emailLower === "user" && (uEmail === "user@audicarrental.com" || uEmail === "user@svdtravels.com")) ||
                    (emailLower === "admin@svdtravels.com" && uEmail === "admin@audicarrental.com") ||
                    (emailLower === "user@svdtravels.com" && uEmail === "user@audicarrental.com")) {
                    matchedUser = u;
                    break;
                }
            }

            // If account does NOT exist
            if (!matchedUser) {
                $('#emailGroup').addClass('has-error');
                $('#loginEmail').addClass('is-invalid');
                $('#emailError').text("No account found with this email. Please register first.").show();
                $('#loginAlert').removeClass('d-none').text("Account not found! Please check your email or click Register below.");
                return;
            }

            // If password does NOT match
            if (matchedUser.password !== password) {
                $('#passwordGroup').addClass('has-error');
                $('#loginPassword').addClass('is-invalid');
                $('#passwordError').text("Incorrect password. Please try again.").show();
                $('#loginAlert').removeClass('d-none').text("Incorrect password for this account. Please try again.");
                return;
            }

            // Step 5: All checks passed! Save user session and go to Home Page
            var sessionUser = {
                name: matchedUser.name || (matchedUser.role === 'Administrator' ? 'Admin' : 'Member'),
                email: matchedUser.email,
                phone: matchedUser.phone || '9876543210',
                role: matchedUser.role || 'Member'
            };

            localStorage.setItem('ww_user', JSON.stringify(sessionUser));
            window.location.href = "home.html";
        });
    }


    // ==========================================================
    // 2. REGISTER FORM VALIDATION (register.html)
    // ==========================================================
    if ($('#regForm').length) {

        // Real-time error clearing on inputs
        $('#regName').on('input', function () {
            $('#nameGroup').removeClass('has-error');
            $('#regName').removeClass('is-invalid');
            $('#nameError').hide();
            $('#regAlert').addClass('d-none');
        });

        $('#regPhone').on('input', function () {
            $('#phoneGroup').removeClass('has-error');
            $('#regPhone').removeClass('is-invalid');
            $('#phoneError').hide();
            $('#regAlert').addClass('d-none');
        });

        $('#regEmail').on('input', function () {
            $('#regEmailGroup').removeClass('has-error');
            $('#regEmail').removeClass('is-invalid');
            $('#emailError').hide();
            $('#regAlert').addClass('d-none');
        });

        $('#regPassword').on('input', function () {
            $('#regPasswordGroup').removeClass('has-error');
            $('#regPassword').removeClass('is-invalid');
            $('#passwordError').hide();
            $('#regAlert').addClass('d-none');
        });

        $('#regConfirm').on('input', function () {
            $('#regConfirmGroup').removeClass('has-error');
            $('#regConfirm').removeClass('is-invalid');
            $('#confirmError').hide();
            $('#regAlert').addClass('d-none');
        });

        $('#termsCheck').on('change', function () {
            if ($(this).is(':checked')) {
                $('#termsGroup').removeClass('has-error');
                $('#termsCheck').removeClass('is-invalid');
                $('#termsError').hide();
            }
        });

        // Form Submit Handler
        $('#regForm').on('submit', function (e) {
            e.preventDefault(); // Stop normal form submission

            // 1. Read input values
            var name = $('#regName').val().trim();
            var phone = $('#regPhone').val().trim();
            var email = $('#regEmail').val().trim();
            var password = $('#regPassword').val();
            var confirmPassword = $('#regConfirm').val();
            var agreeTerms = $('#termsCheck').is(':checked');
            var isValid = true;

            // Clear general alert
            $('#regAlert').addClass('d-none').text('');

            // 2. Validate Full Name
            var nameRegex = /^[a-zA-Z\s]+$/;
            if (name === "") {
                $('#nameGroup').addClass('has-error');
                $('#regName').addClass('is-invalid');
                $('#nameError').text("Please enter your full name.").show();
                isValid = false;
            } else if (name.length < 2) {
                $('#nameGroup').addClass('has-error');
                $('#regName').addClass('is-invalid');
                $('#nameError').text("Name must be at least 2 characters.").show();
                isValid = false;
            } else if (!nameRegex.test(name)) {
                $('#nameGroup').addClass('has-error');
                $('#regName').addClass('is-invalid');
                $('#nameError').text("Name can only contain letters and spaces.").show();
                isValid = false;
            } else {
                $('#nameGroup').removeClass('has-error');
                $('#regName').removeClass('is-invalid');
                $('#nameError').hide();
            }

            // 3. Validate Phone Number (10 digits)
            if (phone === "") {
                $('#phoneGroup').addClass('has-error');
                $('#regPhone').addClass('is-invalid');
                $('#phoneError').text("Please enter your phone number.").show();
                isValid = false;
            } else if (!isValidPhone(phone)) {
                $('#phoneGroup').addClass('has-error');
                $('#regPhone').addClass('is-invalid');
                $('#phoneError').text("Please enter a valid 10-digit phone number.").show();
                isValid = false;
            } else {
                $('#phoneGroup').removeClass('has-error');
                $('#regPhone').removeClass('is-invalid');
                $('#phoneError').hide();
            }

            // 4. Validate Email & Duplicate Check
            var users = getRegisteredUsers();
            if (email === "") {
                $('#regEmailGroup').addClass('has-error');
                $('#regEmail').addClass('is-invalid');
                $('#emailError').text("Please enter your email address.").show();
                isValid = false;
            } else if (!isValidEmail(email)) {
                $('#regEmailGroup').addClass('has-error');
                $('#regEmail').addClass('is-invalid');
                $('#emailError').text("Please enter a valid email address (e.g. name@example.com).").show();
                isValid = false;
            } else {
                // Check if account with this email already exists
                var isDuplicate = false;
                for (var i = 0; i < users.length; i++) {
                    if ((users[i].email || "").toLowerCase() === email.toLowerCase()) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (isDuplicate) {
                    $('#regEmailGroup').addClass('has-error');
                    $('#regEmail').addClass('is-invalid');
                    $('#emailError').text("An account with this email already exists. Please log in.").show();
                    isValid = false;
                } else {
                    $('#regEmailGroup').removeClass('has-error');
                    $('#regEmail').removeClass('is-invalid');
                    $('#emailError').hide();
                }
            }

            // 5. Validate Password
            if (password === "") {
                $('#regPasswordGroup').addClass('has-error');
                $('#regPassword').addClass('is-invalid');
                $('#passwordError').text("Please enter a password.").show();
                isValid = false;
            } else if (password.length < 6) {
                $('#regPasswordGroup').addClass('has-error');
                $('#regPassword').addClass('is-invalid');
                $('#passwordError').text("Password must be at least 6 characters.").show();
                isValid = false;
            } else {
                $('#regPasswordGroup').removeClass('has-error');
                $('#regPassword').removeClass('is-invalid');
                $('#passwordError').hide();
            }

            // 6. Validate Confirm Password
            if (confirmPassword === "") {
                $('#regConfirmGroup').addClass('has-error');
                $('#regConfirm').addClass('is-invalid');
                $('#confirmError').text("Please confirm your password.").show();
                isValid = false;
            } else if (confirmPassword !== password) {
                $('#regConfirmGroup').addClass('has-error');
                $('#regConfirm').addClass('is-invalid');
                $('#confirmError').text("Passwords do not match.").show();
                isValid = false;
            } else {
                $('#regConfirmGroup').removeClass('has-error');
                $('#regConfirm').removeClass('is-invalid');
                $('#confirmError').hide();
            }

            // 7. Validate Terms Checkbox
            if (!agreeTerms) {
                $('#termsGroup').addClass('has-error');
                $('#termsCheck').addClass('is-invalid');
                $('#termsError').text("You must agree to the Terms & Conditions to register.").show();
                isValid = false;
            } else {
                $('#termsGroup').removeClass('has-error');
                $('#termsCheck').removeClass('is-invalid');
                $('#termsError').hide();
            }

            // If any validation failed, show alert banner and stop
            if (!isValid) {
                $('#regAlert').removeClass('d-none').text("Please correct the errors in the highlighted fields.");
                return;
            }

            // 8. Save new account in localStorage
            var cleanPhone = phone.replace(/[^0-9]/g, '');
            var newUser = {
                name: name,
                email: email,
                phone: cleanPhone,
                password: password,
                role: 'Member'
            };

            users.push(newUser);
            localStorage.setItem('ww_users', JSON.stringify(users));

            // Store email so login.html can pre-fill it
            localStorage.setItem('ww_registered_email', email);

            // Notify user and navigate to login
            alert("Registration successful! You can now log in with your credentials.");
            window.location.href = "login.html";
        });
    }


    // ==========================================================
    // 3. SHOW / HIDE PASSWORD (EYE BUTTON)
    // ==========================================================
    function setupPasswordToggle(btnId, inputId, eyeShowId, eyeHideId) {
        $(btnId).on('click', function () {
            var input = $(inputId);
            var isPw = input.attr('type') === 'password';
            input.attr('type', isPw ? 'text' : 'password');

            if (eyeShowId && eyeHideId) {
                if (isPw) {
                    $(eyeShowId).hide();
                    $(eyeHideId).show();
                } else {
                    $(eyeShowId).show();
                    $(eyeHideId).hide();
                }
            }
        });
    }

    // Login password toggle
    setupPasswordToggle('#togglePassword', '#loginPassword', '#iconEyeShow', '#iconEyeHide');

    // Register password toggles
    setupPasswordToggle('#toggleRegPassword', '#regPassword', '#regIconEyeShow', '#regIconEyeHide');
    setupPasswordToggle('#toggleRegConfirm', '#regConfirm', '#regConfirmIconEyeShow', '#regConfirmIconEyeHide');


    // ==========================================================
    // 4. PROFILE PAGE & LOGOUT (profile.html)
    // ==========================================================
    if ($('#profileContent').length || $('#profileView').length) {
        var loggedInUser = JSON.parse(localStorage.getItem('ww_user') || 'null');

        // Fallback demo user if not logged in
        if (!loggedInUser || !loggedInUser.email) {
            loggedInUser = {
                name: 'Harish Raghav',
                email: 'user@audicarrental.com',
                phone: '9876543210',
                role: 'Member'
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

            // Display role badge
            if (loggedInUser.role === 'Administrator') {
                $('.profile-role').text('Audi Car Rental Administrator');
            } else {
                $('.profile-role').text('Audi Car Rental Member');
            }

            // Initials (e.g. "Harish Raghav" -> "HR")
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
            $('.has-error').removeClass('has-error');
            $('.is-invalid').removeClass('is-invalid');
            $('.invalid-feedback').hide();
        });

        // Save Profile Changes with Validation
        $('#profileEditForm').on('submit', function (e) {
            e.preventDefault();

            var newName = $('#pfName').val().trim();
            var newEmail = $('#pfEmail').val().trim();
            var newPhone = $('#pfPhone').val().trim();
            var valid = true;

            // Reset errors
            $('#editNameGroup, #editEmailGroup, #editPhoneGroup').removeClass('has-error');
            $('#pfName, #pfEmail, #pfPhone').removeClass('is-invalid');
            $('#pfNameError, #pfEmailError, #pfPhoneError').hide().text('');

            // Name
            if (newName.length < 2) {
                $('#editNameGroup').addClass('has-error');
                $('#pfName').addClass('is-invalid');
                $('#pfNameError').text('Full name must be at least 2 characters.').show();
                valid = false;
            }

            // Email
            if (!isValidEmail(newEmail)) {
                $('#editEmailGroup').addClass('has-error');
                $('#pfEmail').addClass('is-invalid');
                $('#pfEmailError').text('Please enter a valid email address.').show();
                valid = false;
            }

            // Phone
            if (!isValidPhone(newPhone)) {
                $('#editPhoneGroup').addClass('has-error');
                $('#pfPhone').addClass('is-invalid');
                $('#pfPhoneError').text('Please enter a valid 10-digit phone number.').show();
                valid = false;
            }

            if (!valid) return;

            // Update in logged in user
            var oldEmail = loggedInUser.email;
            loggedInUser.name = newName;
            loggedInUser.email = newEmail;
            loggedInUser.phone = newPhone.replace(/[^0-9]/g, '');
            localStorage.setItem('ww_user', JSON.stringify(loggedInUser));

            // Sync with registered users list
            var users = getRegisteredUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].email.toLowerCase() === oldEmail.toLowerCase()) {
                    users[i].name = newName;
                    users[i].email = newEmail;
                    users[i].phone = loggedInUser.phone;
                    break;
                }
            }
            localStorage.setItem('ww_users', JSON.stringify(users));

            updateProfileDisplay();

            $('#profileEditForm').addClass('d-none');
            $('#profileView').removeClass('d-none');

            $('#profileSuccessAlert').removeClass('d-none fade');
            setTimeout(function () {
                $('#profileSuccessAlert').addClass('d-none');
            }, 3500);
        });

        // Change Password Form with Validation & Verification
        $('#passwordForm').on('submit', function (e) {
            e.preventDefault();

            var currentPw = $('#pwCurrent').val().trim();
            var newPw = $('#pwNew').val().trim();
            var confirmPw = $('#pwConfirm').val().trim();
            var valid = true;

            // Reset errors
            $('#pwCurrentGroup, #pwNewGroup, #pwConfirmGroup').removeClass('has-error');
            $('#pwCurrent, #pwNew, #pwConfirm').removeClass('is-invalid');
            $('#pwCurrentError, #pwNewError, #pwConfirmError').hide().text('');
            $('#passwordSuccessAlert').addClass('d-none');

            // Find stored user record to verify current password
            var users = getRegisteredUsers();
            var userRecord = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i].email.toLowerCase() === loggedInUser.email.toLowerCase()) {
                    userRecord = users[i];
                    break;
                }
            }

            // Current Password Check
            if (currentPw === '') {
                $('#pwCurrentGroup').addClass('has-error');
                $('#pwCurrent').addClass('is-invalid');
                $('#pwCurrentError').text('Please enter your current password.').show();
                valid = false;
            } else if (userRecord && userRecord.password && userRecord.password !== currentPw) {
                $('#pwCurrentGroup').addClass('has-error');
                $('#pwCurrent').addClass('is-invalid');
                $('#pwCurrentError').text('Current password is incorrect.').show();
                valid = false;
            }

            // New Password Check
            if (newPw === '') {
                $('#pwNewGroup').addClass('has-error');
                $('#pwNew').addClass('is-invalid');
                $('#pwNewError').text('Please enter your new password.').show();
                valid = false;
            } else if (newPw.length < 6) {
                $('#pwNewGroup').addClass('has-error');
                $('#pwNew').addClass('is-invalid');
                $('#pwNewError').text('New password must be at least 6 characters.').show();
                valid = false;
            } else if (currentPw && newPw === currentPw) {
                $('#pwNewGroup').addClass('has-error');
                $('#pwNew').addClass('is-invalid');
                $('#pwNewError').text('New password cannot be the same as your current password.').show();
                valid = false;
            }

            // Confirm Password Check
            if (confirmPw === '') {
                $('#pwConfirmGroup').addClass('has-error');
                $('#pwConfirm').addClass('is-invalid');
                $('#pwConfirmError').text('Please confirm your new password.').show();
                valid = false;
            } else if (newPw !== confirmPw) {
                $('#pwConfirmGroup').addClass('has-error');
                $('#pwConfirm').addClass('is-invalid');
                $('#pwConfirmError').text('New passwords do not match.').show();
                valid = false;
            }

            if (!valid) return;

            // Update user password in storage
            if (userRecord) {
                userRecord.password = newPw;
                localStorage.setItem('ww_users', JSON.stringify(users));
            }

            $('#pwCurrent').val('');
            $('#pwNew').val('');
            $('#pwConfirm').val('');

            $('#passwordSuccessAlert').removeClass('d-none fade');
            setTimeout(function () {
                $('#passwordSuccessAlert').addClass('d-none');
            }, 3500);
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