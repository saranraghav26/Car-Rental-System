# Audi Car Rental — Online Vehicle Booking Website

**Course Project: Frontend & Client-Side Form Validation Only (Indian Rupees - ₹)**

A fully client-side vehicle booking web application built as an R1 course project.

- **Frontend:** Clean, responsive HTML pages (Login/Register → Home → Vehicles Catalogue → Vehicle Details → Booking & Checkout → Confirmation Receipt → My Bookings → User Profile).
- **Data:** Vehicle catalogue loaded from a local JSON file (`json/vehicles.json`) priced in **Indian Rupees (₹)**.
- **Auth & Storage:** All user accounts, sessions, and bookings are handled entirely in the browser via `localStorage`.
- **Validation:** Clear, beginner-friendly client-side form validation on every form — login, registration, vehicle booking, profile update, and search/filters.
- **Currency:** All pricing across the application is formatted in **Indian Rupees (₹)**.
- **Serverless:** No backend, database, or Node server is required. Runs directly in any web browser.

---

## 1. Project Purpose

Audi Car Rental allows users to:
1. Register and sign in with client-side form validation.
2. Browse a vehicle catalogue with filters (by name, type, location, min/max price in ₹) and sorting (price low-to-high, high-to-low, name).
3. View full vehicle details, select rental days, and see a live estimated total in ₹.
4. Complete a booking form with validation (dates, location, and payment option - Cash on Delivery or Card).
5. View an instant booking confirmation receipt with a print option.
6. Manage bookings on "My Bookings" with live search, status filter, and cancel functionality.
7. View and update profile information and change passwords.

---

## 2. Technologies Used

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript (ES5/ES6), jQuery |
| Data | Local JSON file (`json/vehicles.json`) |
| Storage | Browser `localStorage` (for accounts, session, and bookings) |
| Dependencies | None — pure client-side, zero npm dependencies |

---

## 3. Technology Restrictions Followed

The project is built strictly within the course R1 syllabus:
- **Used only:** HTML, CSS, Bootstrap 5, JavaScript, jQuery, JSON.
- **Not used:** Node.js server, Express, MongoDB, Mongoose, Firebase, TypeScript, Next.js, Vite, Tailwind CSS, or any backend packages.
- **Purely client-side validation and storage.**

---

## 4. Project Structure

```
vehicle-booking-website/
│
├── index.html              Direct entry login page with form validation
├── login.html              Sign in form with validation (alias to index)
├── register.html           Create an account form with validation
├── home.html               Hero section + featured vehicles + quick search
├── vehicles.html           Filterable and sortable catalogue (Min/Max Price in ₹)
├── vehicle-details.html    Vehicle details + days counter + Book Now button
├── booking.html            Checkout form (customer info, dates, payment method, live ₹ total)
├── confirmation.html       Booking receipt with full summary and print button
├── my-bookings.html        List, filter, search, and cancel bookings
├── profile.html            View/edit user profile + change password
│
├── css/
│   └── style.css           Custom responsive styling and vibrant header gradients
├── js/
│   ├── auth.js             Beginner-friendly authentication, profile & password validation
│   ├── main.js             Splash page & home featured vehicles loader
│   ├── vehicles.js         Vehicles catalogue filtering, sorting, & vehicle details
│   └── booking.js          Checkout validation, confirmation receipt, & my-bookings management
├── json/
│   └── vehicles.json       Vehicle catalogue data with realistic INR rates (₹1600 - ₹6500)
├── images/
│   └── vehicles/           Vehicle showcase images
├── package.json            Project metadata
└── README.md               Project documentation
```

---

## 5. Beginner-Friendly JavaScript Architecture

All JavaScript code has been written at an accessible, beginner-friendly level:
- Plain `if...else` statements and straightforward regular expressions for form input checks.
- Clear error messages mapped directly to Bootstrap's `.is-invalid` and `.invalid-feedback` classes.
- Direct `localStorage.getItem` and `localStorage.setItem` for persistence (no complex backend or crypto).
- Fully commented functions for easy readability and viva explanations.

---

## 6. How to Run the Project

No server installation or backend build step is required:

### Option A — VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option B — Direct Browser Open
Double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## 7. Client-Side Form Validations

Every form includes strict client-side validation to prevent empty or invalid submissions:

- **Registration Form (`register.html`):**
  - Full Name: Required (letters only, minimum 2 characters).
  - Email: Required (valid email format `user@domain.ext`).
  - Phone: Required (10 to 15 digits).
  - Password: Required (minimum 6 characters).
  - Confirm Password: Must match Password exactly.
  - Terms Checkbox: Must be accepted.
  - Duplicate Check: Prevents registering an email that already exists in `localStorage`.

- **Login Form (`login.html`):**
  - Email: Required and validated format.
  - Password: Required (minimum 6 characters).
  - Account Match: Checks credentials against registered accounts in `localStorage`.
  - **Pre-configured Admin Credentials:**
    - **Admin ID / Email:** `admin@audicarrental.com` (or `admin`)
    - **Admin Password:** `admin123`
    - Logging in with these credentials gives Administrator privileges (visible on the Profile page with an Administrator badge).
  - **Quick Auto-Fill:** An "Auto-fill Admin Details" button is available on the login card for one-click testing.

- **Booking Checkout Form (`booking.html`):**
  - Pick-up Date: Required and cannot be in the past.
  - Return Date: Required and must be after the pick-up date.
  - Pick-up & Return Locations: Required.
  - Payment Details (if Card selected):
    - 16-digit Card Number required.
    - Expiry date (`MM/YY`) required.
    - 3-digit CVV required.
  - Terms & Conditions: Checkbox must be ticked.

- **Vehicle Search & Filter (`vehicles.html`):**
  - Min Price (₹) & Max Price (₹): Valid numeric inputs; Min Price cannot exceed Max Price.

- **Profile & Password Change (`profile.html`):**
  - Name and Phone validation on edit.
  - Current password verification and new password matching checks.

---

## 8. Pricing in Indian Rupees (₹)

All prices across the vehicle catalogue, daily rates, calculated totals, booking summaries, confirmation receipts, and filter controls are displayed in Indian Rupees:
- Hatchbacks: ₹1,600 / day
- Compact SUVs: ₹2,200 – ₹2,800 / day
- Sedans: ₹3,500 – ₹4,500 / day
- Luxury & Premium Vehicles: ₹5,500 – ₹6,500 / day

---

## 9. Submission Checklist

- [x] Pure frontend application with 10 responsive pages.
- [x] Complete client-side form validation across all user inputs.
- [x] Pricing standardized to Indian Rupees (₹).
- [x] Beginner-level, readable, clean JavaScript code.
- [x] No backend, Node server, or external database required.
- [x] Clean browser console with zero errors.