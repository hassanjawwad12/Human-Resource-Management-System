import {
  IconCalendar,
  IconTicket,
  IconUserCircle,
  IconLayoutDashboard,
  IconSettings2,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboards/modern',
    alwaysShow: true,
  },
  {
    id: uniqueId(),
    title: 'Admin Module',
    icon: IconSettings2,
    href: '/admin',
    alwaysShow: true,
  },
  {
    id: uniqueId(),
    title: 'Rota Module',
    icon: IconCalendar,
    href: '/rota',
    alwaysShow: false,
  },
  {
    id: uniqueId(),
    title: 'Attendance Module',
    icon: IconTicket,
    href: '/attendance',
    alwaysShow: false,
  },
  {
    id: uniqueId(),
    title: 'HR Module',
    icon: IconUserCircle,
    href: '/hr',
    alwaysShow: false,
  },

];

export default Menuitems;
