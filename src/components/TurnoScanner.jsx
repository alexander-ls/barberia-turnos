import { useState } from 'react';
import { db } from '../auth/FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { QrReader } from 'react-qr-reader';

export default function TurnoScanner() {
  const [message, setMessage] = useState('');

  const handleResult = async (result, error) => {
    if (!!result) {
      const scannedId = result?.text || result;
      try {
        await updateDoc(doc(db, 'turnos', scannedId), { estado: 'atendido' });
        setMessage('Turno confirmado');
      } catch (err) {
        setMessage('Error al actualizar');
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Escanear turno</h2>
      <QrReader onResult={handleResult} constraints={{ facingMode: 'environment' }} />
      {message && (
        <div role="alert" className="alert alert-success">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
