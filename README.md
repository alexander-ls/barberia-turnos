# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Seeding Firestore

1. Create a Firebase service account and download the JSON credential.
2. Save the file as `service-account.json` in the project root or set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable with the path to the file.
3. Run the seeding script:

```bash
node scripts/seedFirestore.js
```

This will populate example records for barbers, services, availability slots and appointments.

## Cloud Functions

The `functions` folder contains a Cloud Function that sends WhatsApp notifications
when a new appointment is created. Configure your Twilio credentials using

```
firebase functions:config:set twilio.sid="ACCOUNT_SID" twilio.token="AUTH_TOKEN" twilio.number="whatsapp:+123456789"
```

Then deploy with:

```
firebase deploy --only functions
```
