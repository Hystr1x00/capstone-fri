import React from 'react';
import { CheckCheck, CheckCircle, Clock } from 'lucide-react';

const StatusPill = ({ status }) => {
  const classes = status === 'completed'
    ? 'bg-emerald-100 text-emerald-700'
    : status === 'approved'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-amber-100 text-amber-700';

  const label = status === 'completed' ? 'Selesai' : status === 'approved' ? 'Disetujui' : 'Menunggu';
  const Icon = status === 'completed' ? CheckCheck : status === 'approved' ? CheckCircle : Clock;

  return (
    <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 ${classes}`}>
      <Icon size={14} />
      {label}
    </span>
  );
};

export default StatusPill;


