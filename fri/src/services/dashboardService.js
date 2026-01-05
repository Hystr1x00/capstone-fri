// Dashboard Service - Handle dashboard stats and activities
class DashboardService {
  constructor() {
    this.storageKey = 'lab_dashboard_data';
    this.initDefaultData();
  }

  initDefaultData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = {
        stats: {
          totalUKM: 1,
          totalKegiatan: 13,
          belumTerlaksana: 11,
          terlaksana: 2,
          lpj: 2
        },
        labData: {
          main: 'Invest in people',
          activities: [
            {
              id: 1,
              no: 1,
              strategi: 'Meningkatkan jumlah mahasiswa yang terlibat aktif di lab',
              indicator: 'Rasio mahasiswa aktif di lab dibandingkan jumlah terdaftar',
              jumlah: '20:39',
              tw: '',
              ket: '',
              status: 'pending'
            },
            {
              id: 2,
              no: 2,
              strategi: 'Meningkatkan kapasitas dan kualitas jumlah asisten praktikum',
              indicator: 'Jumlah asisten',
              jumlah: '21/matkul',
              tw: '',
              ket: '',
              status: 'pending'
            },
            {
              id: 3,
              no: 3,
              strategi: 'Meningkatkan kapasitas dan kualitas jumlah asisten praktikum',
              indicator: 'Jumlah Pelatihan asisten praktikum',
              jumlah: '4',
              tw: 'TW 1, TW 2',
              ket: 'Maret, April, Mei',
              status: 'approved'
            },
            {
              id: 4,
              no: 4,
              strategi: 'Unity',
              indicator: 'Jumlah kegiatan kebersamaan',
              jumlah: '2',
              tw: 'TW2, TW4',
              ket: '',
              status: 'completed'
            },
            {
              id: 5,
              no: 5,
              strategi: 'Unity',
              indicator: 'Jumlah prototipe yang siap diujikan HKI atau diujukan menjadi startup',
              jumlah: '2',
              tw: 'T3, TW4',
              ket: '',
              status: 'pending'
            }
          ]
        },
        performance: {
          labId: 'EISD',
          labName: 'Enterprise Intelligence Systems and Development',
          score: 85.5,
          rating: 'Excellent'
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
  }

  // Get dashboard stats
  getStats() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return data.stats || {};
  }

  // Get lab activities
  getLabData() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return data.labData || { activities: [] };
  }

  // Get performance score
  getPerformance() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return data.performance || {};
  }

  // Update activity status
  updateActivityStatus(activityId, newStatus) {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    if (data.labData && data.labData.activities) {
      const activity = data.labData.activities.find(a => a.id === activityId);
      if (activity) {
        activity.status = newStatus;
        // Update stats accordingly
        this.recalculateStats(data);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        return activity;
      }
    }
    return null;
  }

  // Recalculate stats based on activities
  recalculateStats(data) {
    const activities = data.labData?.activities || [];
    data.stats = {
      totalUKM: 1,
      totalKegiatan: activities.length,
      belumTerlaksana: activities.filter(a => a.status === 'pending').length,
      terlaksana: activities.filter(a => a.status === 'approved' || a.status === 'completed').length,
      lpj: activities.filter(a => a.status === 'completed').length
    };
  }
}

export default new DashboardService();

