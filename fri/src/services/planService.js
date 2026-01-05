// Plan Service - Handle plan management dengan workflow approval
// Workflow: Lab submit -> Dosen approve -> KK approve -> Approved

class PlanService {
  constructor() {
    this.storageKey = 'lab_plans_data';
    this.planGroupsKey = 'lab_plan_groups';
    this.initDefaultData();
  }

  initDefaultData() {
    // Initialize plan groups structure
    if (!localStorage.getItem(this.planGroupsKey)) {
      const planGroups = [
        {
          main: 'Invest in people',
          sasaran: [
            {
              sasaranStrategis: 'Meningkatkan jumlah mahasiswa yang terlibat aktif di lab',
              items: [
                { no: 1, indikator: 'Rasio mahasiswa aktif di lab dibandingkan jumlah terdaftar' }
              ]
            },
            {
              sasaranStrategis: 'Meningkatkan kapasitas dan kualitas jumlah asisten praktikum',
              items: [
                { no: 2, indikator: 'Jumlah asisten' },
                { no: 3, indikator: 'Jumlah Pelatihan asisten praktikum' }
              ]
            },
            {
              sasaranStrategis: 'Pengembangan learning factory',
              items: [
                { no: 4, indikator: 'Jumlah Pelatihan untuk anggota dengan sertifikasi' }
              ]
            },
            {
              sasaranStrategis: 'Unity',
              items: [
                { no: 5, indikator: 'Jumlah kegiatan kebersamaan' },
                { no: 6, indikator: 'Jumlah prototipe yang siap diajukan HKI atau menjadi startup' }
              ]
            }
          ]
        },
        {
          main: 'Digital transformation',
          sasaran: [
            {
              sasaranStrategis: 'Menghasilkan inovasi berbasis SDGs untuk mendukung visi Universitas Telkom',
              items: [
                { no: 7, indikator: 'Jumlah bootcamp dan kaderisasi persiapan lomba' },
                { no: 8, indikator: 'Jumlah lomba yang diikuti' },
                { no: 9, indikator: 'Jumlah HKI yang dihasilkan (Hak Cipta, Desain Industri, Paten)' }
              ]
            }
          ]
        },
        {
          main: 'Expansion of geographical footprint',
          sasaran: [
            {
              sasaranStrategis: 'Melihat hasil-hasil dan kerjasama dengan industri',
              items: [
                { no: 10, indikator: 'Jumlah kunjungan industri' },
                { no: 11, indikator: 'Jumlah kerjasama dengan industri' }
              ]
            }
          ]
        },
        {
          main: 'Alignment across domain',
          sasaran: [
            {
              sasaranStrategis: 'Menghasilkan lulusan yang diakui dan dicari oleh masyarakat / industri / pemerintah',
              items: [
                { no: 12, indikator: 'Jumlah pelatihan untuk menambah kemampuan / skill bagi mahasiswa' },
                { no: 13, indikator: 'Jumlah webinar sharing dari alumni / praktisi industri / kuliah umum' }
              ]
            },
            {
              sasaranStrategis: 'Melakukan program kerjasama eksternal',
              items: [
                { no: 14, indikator: 'Jumlah kerjasama eksternal (non-industri) yang telah dilakukan' },
                { no: 15, indikator: 'Jumlah lab/infrastruktur yang terbangun dari kerjasama eksternal' },
                { no: 16, indikator: 'Jumlah start-up yang terinisiasi dari lab riset' }
              ]
            }
          ]
        },
        {
          main: 'Sustainable growth',
          sasaran: [
            {
              sasaranStrategis: 'Membangun kemandirian finansial',
              items: [
                { no: 17, indikator: 'Jumlah proyek yang dikerjakan atau mendapatkan dana dari luar' },
                { no: 18, indikator: 'Jumlah kegiatan fund rising' }
              ]
            },
            {
              sasaranStrategis: 'Meningkatkan dukungan kegiatan jumlah riset dan abdimas',
              items: [
                { no: 19, indikator: 'Jumlah kegiatan riset dan abdimas yang melibatkan mahasiswa lab' },
                { no: 20, indikator: 'Jumlah mahasiswa yang terlibat aktif dalam riset' },
                { no: 21, indikator: 'Jumlah mahasiswa yang terlibat aktif dalam abdimas' },
                { no: 22, indikator: 'Jumlah kerjasama infrastruktur laboratorium' }
              ]
            }
          ]
        },
        {
          main: 'Lain-lain',
          sasaran: [
            {
              sasaranStrategis: 'Kegiatan Lain-lain',
              items: [
                { no: 23, indikator: 'Kegiatan Lain-lain' }
              ]
            }
          ]
        }
      ];
      localStorage.setItem(this.planGroupsKey, JSON.stringify(planGroups));
    }

    // Initialize submitted plans
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Get plan groups structure
  getPlanGroups() {
    return JSON.parse(localStorage.getItem(this.planGroupsKey) || '[]');
  }

  // Get all submitted plans
  getSubmittedPlans() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Get plans by status for specific role
  getPlansByStatus(status, role) {
    const plans = this.getSubmittedPlans();
    if (role === 'dosen') {
      return plans.filter(p => p.status === status);
    } else if (role === 'kk') {
      if (status === 'pending') {
        return plans.filter(p => p.status === 'approved_by_dosen');
      }
      return plans.filter(p => p.status === status);
    }
    return plans.filter(p => p.status === status);
  }

  // Submit plan from Lab
  submitPlan(planData) {
    const plans = this.getSubmittedPlans();
    const newPlan = {
      id: Date.now(),
      planData: { ...planData },
      status: 'pending', // Awaiting dosen approval
      submittedAt: new Date().toISOString(),
      approvedByDosen: null,
      approvedByKK: null,
      rejectedBy: null,
      rejectionReason: null
    };
    plans.push(newPlan);
    localStorage.setItem(this.storageKey, JSON.stringify(plans));
    return newPlan;
  }

  // Approve plan by Dosen
  approveByDosen(planId) {
    const plans = this.getSubmittedPlans();
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.status === 'pending') {
      plan.status = 'approved_by_dosen';
      plan.approvedByDosen = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(plans));
      return plan;
    }
    return null;
  }

  // Approve plan by KK
  approveByKK(planId) {
    const plans = this.getSubmittedPlans();
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.status === 'approved_by_dosen') {
      plan.status = 'approved_by_kk';
      plan.approvedByKK = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(plans));
      return plan;
    }
    return null;
  }

  // Reject plan
  rejectPlan(planId, role, reason = null) {
    const plans = this.getSubmittedPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;

    if (role === 'dosen') {
      // Dosen can delete plan
      const filtered = plans.filter(p => p.id !== planId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } else if (role === 'kk') {
      // KK rejects and sends back to dosen
      plan.status = 'pending';
      plan.approvedByDosen = null;
      plan.rejectedBy = 'kk';
      plan.rejectionReason = reason;
      localStorage.setItem(this.storageKey, JSON.stringify(plans));
      return plan;
    }
    return null;
  }

  // Update plan (only for pending plans from lab)
  updatePlan(planId, planData) {
    const plans = this.getSubmittedPlans();
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.status === 'pending') {
      plan.planData = { ...plan.planData, ...planData };
      localStorage.setItem(this.storageKey, JSON.stringify(plans));
      return plan;
    }
    return null;
  }
}

export default new PlanService();

