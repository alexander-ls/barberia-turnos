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
3. Run the seeding script to crear nuevas disponibilidades:

```bash
node scripts/seedFirestore.js
```

This will populate availability slots for each barber.

To remove all existing availabilities you can run:

```bash
node scripts/clearDisponibilidades.js
```

## Calendar view

The barber and admin dashboards now use **react-calendar** to visualize loaded schedules. Run `npm install` to install the dependency before building the project.
