const admin = require('firebase-admin');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const barbers = ['Juan', 'Maria'];

// Modifica estas fechas y horas según sea necesario
const fechas = [
  '2024-01-01',
  '2024-01-02',
  '2024-01-03',
  '2024-01-04',
  '2024-01-05',
];

const horas = ['10:00', '11:00', '12:00', '13:00', '14:00'];

// Se generarán 5 disponibilidades por cada barbero
const slots = [];
barbers.forEach((barbero) => {
  fechas.forEach((fecha, index) => {
    slots.push({
      barbero,
      servicio: 'Corte de pelo',
      fecha,
      hora: horas[index % horas.length],
    });
  });
});

async function seedCollection(name, data) {
  await Promise.all(
    data.map((item) =>
      db.collection(name).add({ ...item, timestamp: new Date(), userId: item.userId || null })
    )
  );
}

async function main() {
  try {
    await seedCollection('disponibilidades', slots);
    console.log('Seeding completed');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
