const admin = require('firebase-admin');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function clearCollection(name) {
  const snapshot = await db.collection(name).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function main() {
  try {
    await clearCollection('disponibilidades');
    console.log('Disponibilidades eliminadas');
  } catch (err) {
    console.error('Error al eliminar disponibilidades', err);
  } finally {
    process.exit();
  }
}

main();
