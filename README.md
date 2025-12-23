# Car Detailing Booking Platform

## Project Overview
This project is a car detailing booking platform built with **Next.js** for the frontend and **Django** for the backend. The system is designed to streamline the booking process for customers, optimize job assignments for admins, and provide an efficient workflow for detailers.

## Features

### For Customers:
1. **Service Selection:**
   - Choose from different detailing packages (e.g., Basic, Premium, Interior-Only).
   - Add optional services like ceramic coating or odor removal.
2. **Real-Time Booking System:**
   - Select date, time, and location for service.
   - View available slots based on admin and detailer availability.
3. **Payment Gateway:**
   - Secure online payments via credit card, PayPal, etc.
   - Apply promo codes or discounts.
4. **Order Tracking:**
   - Receive confirmation emails and status updates.

### For Admins:
1. **Job Assignment Dashboard:**
   - View incoming bookings with customer details.
   - Manually or automatically assign jobs to available detailers.
2. **Detailer Profiles:**
   - Manage detailer availability, location, and ratings.
   - Direct communication with detailers.
3. **Performance Analytics:**
   - View completed jobs, customer feedback, and payment history.
4. **Customer Support Tools:**
   - Live chat or email integration for support.

### For Detailers:
1. **Job Alerts:**
   - Receive notifications for new job assignments.
   - Accept or decline jobs.
2. **Earnings Dashboard:**
   - Track completed jobs and payment history.
3. **Availability Calendar:**
   - Set working hours and blackout dates.

## Tech Stack
- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** Django (Django REST Framework)
- **Database:** PostgreSQL
- **Authentication:** JWT-based authentication
- **Deployment:** Vercel (Frontend) & AWS/DigitalOcean (Backend)

## Project Structure
```
project-root/
│── client/  (Next.js frontend)
│── server/  (Django backend)
│── README.md
│── .gitignore
│── docker-compose.yml  (if applicable)
│── package.json (Frontend dependencies)
│── requirements.txt (Backend dependencies)
```

## Setup Instructions

### 1. Clone the Repository:
```sh
git clone https://github.com/MdSamsuzzohaShayon/extradetailers.git
cd extradetailers
```

### 2. Setup Backend (Django):
```sh
cd server
python -m venv .venv
source .venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
python manage.py makemigrations
python manage.py makemigrations accounts
python manage.py migrate
python manage.py migrate accounts
python manage.py runserver
```

### 3. Setup Frontend (Next.js):
```sh
cd ../client
npm install
npm run dev
```

### 4. Environment Variables:
Create `.env` files in in `root` folder, `client/` and `server/` folders with necessary API keys and configurations.


## Contributing
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes
4. Push to the branch and create a PR

## License
This project is licensed under the MIT License.

## Contact
For any issues, feel free to reach out at [mdsamsuzzoha5222@gmail.com](mailto:mdsamsuzzoha5222@gmail.com).

