// Report Service - Handle report management
// Workflow: Lab create report -> Dosen/KK approve/reject

class ReportService {
  constructor() {
    this.storageKey = 'lab_reports_data';
    this.initDefaultData();
  }

  initDefaultData() {
    // Jangan buat default data, biarkan kosong atau hanya ada yang baru dibuat user
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    } else {
      // Hapus 2 laporan default yang lama jika masih ada (id 1 dan 2)
      const reports = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filteredReports = reports.filter(r => r.id !== 1 && r.id !== 2);
      if (reports.length !== filteredReports.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredReports));
      }
    }
  }

  // Get all reports
  getReports() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Get reports by status
  getReportsByStatus(status) {
    const reports = this.getReports();
    return reports.filter(r => r.status === status);
  }

  // Get reports for specific activity
  getReportsByActivity(activityId) {
    const reports = this.getReports();
    return reports.filter(r => r.activityId === activityId);
  }

  // Create new report
  createReport(reportData) {
    const reports = this.getReports();
    const newReport = {
      id: Date.now(),
      activityId: reportData.activityId,
      title: reportData.title,
      date: reportData.date || new Date().toISOString().split('T')[0],
      description: reportData.description || '',
      status: 'pending',
      files: reportData.files || [],
      submittedBy: 'lab',
      submittedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      rejectionReason: null
    };
    reports.push(newReport);
    localStorage.setItem(this.storageKey, JSON.stringify(reports));
    return newReport;
  }

  // Approve report
  approveReport(reportId, approverRole) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (report && report.status === 'pending') {
      report.status = 'approved';
      report.approvedBy = approverRole;
      report.approvedAt = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
      return report;
    }
    return null;
  }

  // Reject report
  rejectReport(reportId, rejectorRole, reason = null) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (report && report.status === 'pending') {
      report.status = 'rejected';
      report.rejectedBy = rejectorRole;
      report.rejectedAt = new Date().toISOString();
      report.rejectionReason = reason;
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
      return report;
    }
    return null;
  }

  // Update report (only for pending reports)
  updateReport(reportId, reportData) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (report && report.status === 'pending') {
      Object.assign(report, {
        ...reportData,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
      return report;
    }
    return null;
  }

  // Delete report
  deleteReport(reportId) {
    const reports = this.getReports();
    const filtered = reports.filter(r => r.id !== reportId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }
}

export default new ReportService();

