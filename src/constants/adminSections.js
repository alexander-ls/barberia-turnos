import {
  CalendarIcon,
  ListIcon,
  UsersIcon,
  ClockIcon,
  ClipboardIcon,
} from '../icons';

export const adminSections = [
  {
    label: 'Turnos',
    items: [
      { id: 'nuevo', label: 'Nuevo turno', icon: CalendarIcon },
      { id: 'recientes', label: 'Turnos recientes', icon: ListIcon },
      { id: 'porBarbero', label: 'Turnos por barbero', icon: UsersIcon },
      { id: 'horarios', label: 'Horarios cargados', icon: ClockIcon },
    ],
  },
  {
    label: 'Gestionar',
    items: [
      { id: 'servicios', label: 'Servicios', href: '#/admin/servicios', icon: ClipboardIcon },
      { id: 'barberos', label: 'Barberos', href: '#/admin/barberos', icon: UsersIcon },
    ],
  },
];
