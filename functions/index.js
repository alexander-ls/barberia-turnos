const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const fromNumber = functions.config().twilio.number;
const client = twilio(accountSid, authToken);

exports.onTurnoCreate = functions.firestore
  .document('turnos/{turnoId}')
  .onCreate(async (snap) => {
    const turno = snap.data();
    const barberSnap = await admin
      .firestore()
      .collection('barberos')
      .where('nombre', '==', turno.barbero)
      .limit(1)
      .get();

    if (barberSnap.empty) {
      return null;
    }
    const barber = barberSnap.docs[0].data();

    const messages = [];
    if (turno.telefono) {
      messages.push(
        client.messages.create({
          from: `whatsapp:${fromNumber}`,
          to: `whatsapp:${turno.telefono}`,
          body: `Hola ${turno.nombre}, tu turno para ${turno.servicio} el ${turno.fecha} a las ${turno.hora} con ${turno.barbero} ha sido registrado.`,
        })
      );
    }

    if (barber.telefono) {
      messages.push(
        client.messages.create({
          from: `whatsapp:${fromNumber}`,
          to: `whatsapp:${barber.telefono}`,
          body: `Nuevo turno para ${turno.nombre} el ${turno.fecha} a las ${turno.hora} para ${turno.servicio}.`,
        })
      );
    }

    return Promise.all(messages);
  });
