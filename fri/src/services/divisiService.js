// Divisi Service - Handle divisi and anggota management

class DivisiService {
  constructor() {
    this.storageKey = 'lab_divisi_data';
    this.initDefaultData();
  }

  initDefaultData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultDivisi = [
        {
          id: 1,
          nama: 'Divisi Backend Development',
          anggota: [
            { id: 1, nama: 'Ahmad Fauzi', jenis: 'Koordinator divisi' },
            { id: 2, nama: 'Budi Santoso', jenis: 'Anggota' },
            { id: 3, nama: 'Eko Prasetyo', jenis: 'Anggota' }
          ],
          project: 3,
          status: 'active',
          createdAt: '2025-01-01'
        },
        {
          id: 2,
          nama: 'Divisi Frontend Development',
          anggota: [
            { id: 4, nama: 'Siti Nurhaliza', jenis: 'Koordinator divisi' },
            { id: 5, nama: 'Fina Andriani', jenis: 'Anggota' }
          ],
          project: 2,
          status: 'active',
          createdAt: '2025-01-01'
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultDivisi));
    }
  }

  // Get all divisi
  getDivisi() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Get divisi by ID
  getDivisiById(divisiId) {
    const divisi = this.getDivisi();
    return divisi.find(d => d.id === divisiId);
  }

  // Create new divisi
  createDivisi(nama) {
    const divisi = this.getDivisi();
    const newDivisi = {
      id: Date.now(),
      nama: nama,
      anggota: [],
      project: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    divisi.push(newDivisi);
    localStorage.setItem(this.storageKey, JSON.stringify(divisi));
    return newDivisi;
  }

  // Update divisi
  updateDivisi(divisiId, data) {
    const divisi = this.getDivisi();
    const index = divisi.findIndex(d => d.id === divisiId);
    if (index !== -1) {
      divisi[index] = { ...divisi[index], ...data };
      localStorage.setItem(this.storageKey, JSON.stringify(divisi));
      return divisi[index];
    }
    return null;
  }

  // Delete divisi
  deleteDivisi(divisiId) {
    const divisi = this.getDivisi();
    const filtered = divisi.filter(d => d.id !== divisiId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }

  // Add anggota to divisi
  addAnggota(divisiId, anggotaData) {
    const divisi = this.getDivisi();
    const divisiIndex = divisi.findIndex(d => d.id === divisiId);
    if (divisiIndex !== -1) {
      const newAnggota = {
        id: Date.now(),
        nama: anggotaData.nama,
        jenis: anggotaData.jenis || 'Anggota'
      };
      divisi[divisiIndex].anggota.push(newAnggota);
      localStorage.setItem(this.storageKey, JSON.stringify(divisi));
      return newAnggota;
    }
    return null;
  }

  // Update anggota
  updateAnggota(divisiId, anggotaId, anggotaData) {
    const divisi = this.getDivisi();
    const divisiIndex = divisi.findIndex(d => d.id === divisiId);
    if (divisiIndex !== -1) {
      const anggotaIndex = divisi[divisiIndex].anggota.findIndex(a => a.id === anggotaId);
      if (anggotaIndex !== -1) {
        divisi[divisiIndex].anggota[anggotaIndex] = {
          ...divisi[divisiIndex].anggota[anggotaIndex],
          ...anggotaData
        };
        localStorage.setItem(this.storageKey, JSON.stringify(divisi));
        return divisi[divisiIndex].anggota[anggotaIndex];
      }
    }
    return null;
  }

  // Delete anggota from divisi
  deleteAnggota(divisiId, anggotaId) {
    const divisi = this.getDivisi();
    const divisiIndex = divisi.findIndex(d => d.id === divisiId);
    if (divisiIndex !== -1) {
      divisi[divisiIndex].anggota = divisi[divisiIndex].anggota.filter(
        a => a.id !== anggotaId
      );
      localStorage.setItem(this.storageKey, JSON.stringify(divisi));
      return true;
    }
    return false;
  }

  // Update project count for divisi
  updateProjectCount(divisiId, count) {
    const divisi = this.getDivisi();
    const index = divisi.findIndex(d => d.id === divisiId);
    if (index !== -1) {
      divisi[index].project = count;
      localStorage.setItem(this.storageKey, JSON.stringify(divisi));
      return divisi[index];
    }
    return null;
  }

  // Get all anggota across all divisi
  getAllAnggota() {
    const divisi = this.getDivisi();
    return divisi.flatMap(d => d.anggota.map(a => ({ ...a, divisiId: d.id, divisiNama: d.nama })));
  }
}

export default new DivisiService();

