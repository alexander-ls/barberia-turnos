const admin = require('firebase-admin');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const barbers = [
  { nombre: 'Juan', email: 'juan@example.com', telefono: '111-111' },
  { nombre: 'Maria', email: 'maria@example.com', telefono: '222-222' },
];

const services = [
  { nombre: 'Corte de pelo', precio: 10 },
  { nombre: 'Afeitado', precio: 5 },
];

const slots = [
  { barbero: 'Juan', servicio: 'Corte de pelo', fecha: '2024-01-01', hora: '10:00' },
  { barbero: 'Maria', servicio: 'Afeitado', fecha: '2024-01-01', hora: '11:00' },
];

const appointments = [
  {
    nombre: 'Pedro',
    servicio: 'Corte de pelo',
    fecha: '2024-01-01',
    hora: '10:00',
    barbero: 'Juan',
    email: 'pedro@example.com',
    telefono: '333-333',
  },
];

async function seedCollection(name, data) {
  await Promise.all(
    data.map((item) =>
      db.collection(name).add({ ...item, timestamp: new Date(), userId: item.userId || null })
    )
  );
}

async function main() {
  try {
    await seedCollection('barberos', barbers);
    await seedCollection('servicios', services);
    await seedCollection('disponibilidades', slots);
    await seedCollection('turnos', appointments);
    console.log('Seeding completed');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
