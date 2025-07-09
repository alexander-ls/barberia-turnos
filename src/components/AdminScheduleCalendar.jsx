import { useEffect, useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../auth/FirebaseConfig';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { formatHoraBogota } from '../utils/time';

export default function AdminScheduleCalendar() {
  const [barberos, setBarberos] = useState([]);
  const [barbero, setBarbero] = useState('');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'barberos'), snap => {
      const names = snap.docs.map(d => d.data().nombre);
      setBarberos(names);
      if (names.length > 0 && !names.includes(barbero)) {
        setBarbero(names[0]);
      }
    });
    return unsub;
  }, [barbero]);

  useEffect(() => {
    if (!barbero) return;
    const qSlots = query(collection(db, 'disponibilidades'), where('barbero', '==', barbero));
    const qTurnos = query(collection(db, 'turnos'), where('barbero', '==', barbero));
    const unsubSlots = onSnapshot(qSlots, s => {
      setSlots(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubTurnos = onSnapshot(qTurnos, t => {
      setBookings(t.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => {
      unsubSlots();
      unsubTurnos();
    };
  }, [barbero]);

  const handleDateChange = date => {
    setSelectedDate(date.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }));
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    const daySlots = slots.filter(s => s.fecha === dateStr);
    if (daySlots.length === 0) return null;
    const bookedCount = daySlots.filter(s => bookings.some(b => b.fecha === s.fecha && b.hora === s.hora)).length;
    const freeCount = daySlots.length - bookedCount;
    return (
      <div className="mt-1 text-[10px]">
        {freeCount > 0 && <span className="text-green-600">●</span>}
        {bookedCount > 0 && <span className="text-red-600 ml-1">●</span>}
      </div>
    );
  };

  const selectedSlots = useMemo(
    () => slots.filter(s => s.fecha === selectedDate),
    [slots, selectedDate]
  );

  const eliminar = async id => {
    await deleteDoc(doc(db, 'disponibilidades', id));
  };

  return (
    <div className="space-y-4">
      <select className="select select-bordered" value={barbero} onChange={e => setBarbero(e.target.value)}>
        {barberos.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <Calendar onClickDay={handleDateChange} tileContent={tileContent} />
      {selectedDate && (
        <div className="space-y-2">
          <h4 className="font-semibold">Horarios para {selectedDate}</h4>
          {selectedSlots.length === 0 && <p>No hay horarios cargados.</p>}
          {selectedSlots.map(s => {
            const booked = bookings.some(b => b.fecha === s.fecha && b.hora === s.hora);
            return (
              <div key={s.id} className="card bg-base-100 shadow-md p-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold">{formatHoraBogota(s.hora)} - {s.servicio}</p>
                  {booked && <span className="badge badge-success mt-2">Agendado</span>}
                </div>
                <button onClick={() => eliminar(s.id)} className="btn btn-xs btn-error">Eliminar</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

