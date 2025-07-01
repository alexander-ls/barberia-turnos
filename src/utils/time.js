export function getTodayBogota() {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Bogota',
  });
}

export function formatHoraBogota(hora) {
  if (!hora) return '';
  const date = new Date(`1970-01-01T${hora}:00`);
  return date.toLocaleTimeString('es-CO', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
