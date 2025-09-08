# Ecom Auth Step1

This is a minimal NestJS scaffold implementing **Auth + OTP + Users & RBAC**.

## Quickstart

1. Copy `.env.example` to `.env` and fill values (GMAIL_USER, GMAIL_PASS, MONGO_URI).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run:
   ```bash
   npm run start:dev
   ```
4. Open Swagger UI at http://localhost:3000/api

## Notes
- Uses Gmail SMTP for sending OTPs. Create an App Password for your Google account and set `GMAIL_PASS`.
- MongoDB must be running and reachable via `MONGO_URI`.
- This scaffold is focused only on authentication flows (register, OTP verify, login, refresh, logout, password reset).
