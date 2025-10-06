import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const TWCalendar = ({ monthToActivities, monthNames }) => {
  const [openTW, setOpenTW] = useState(null);
  const twInfo = [
    { tw: 1, months: [0,1,2], label: 'TW1 (Jan–Mar)' },
    { tw: 2, months: [3,4,5], label: 'TW2 (Apr–Jun)' },
    { tw: 3, months: [6,7,8], label: 'TW3 (Jul–Sep)' },
    { tw: 4, months: [9,10,11], label: 'TW4 (Okt–Des)' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {twInfo.map(({tw, months, label})=>{
        const totalItems = months.reduce((acc,m)=> acc + monthToActivities[m].items.length, 0);
        return (
          <div key={tw} className="rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition hover:-translate-y-0.5">
            <button onClick={()=> setOpenTW(openTW===tw ? null : tw)} className={`w-full text-left p-5 flex items-center justify-between bg-gradient-to-br from-emerald-500 to-green-600 text-white`}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Calendar size={18} /></div>
                <div>
                  <div className="text-lg font-bold">{`TW${tw}`}</div>
                  <div className="text-xs text-emerald-50">{label.replace(/^TW\d+\s/, '')}</div>
                </div>
              </div>
              <span className="px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs font-semibold">{totalItems}</span>
            </button>
            <div className={`${openTW===tw ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 gap-4 p-5">
                {months.map((m)=>{
                  const items = monthToActivities[m].items;
                  return (
                    <div key={m} className="rounded-xl border border-gray-200 p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-gray-800">{monthNames[m]}</div>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">{items.length}</span>
                      </div>
                      <div className="space-y-2">
                        {items.length===0 ? (
                          <div className="text-sm text-gray-500">Tidak ada rencana</div>
                        ) : (
                          items.slice(0,4).map((it,idx)=> (
                            <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="line-clamp-2">{it.indicator}</span>
                            </div>
                          ))
                        )}
                        {items.length>4 && (
                          <div className="text-xs text-gray-500">+{items.length-4} lainnya</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TWCalendar;


