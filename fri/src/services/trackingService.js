// Tracking Service - Handle tracking and monitoring reports
// This service extends report service with tracking capabilities

import reportService from './reportService';

class TrackingService {
  // Get all tracking data (all reports with tracking info)
  getAllTrackingData() {
    return reportService.getReports();
  }

  // Get tracking statistics
  getTrackingStats() {
    const reports = reportService.getReports();
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      approved: reports.filter(r => r.status === 'approved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      approvalRate: reports.length > 0 
        ? ((reports.filter(r => r.status === 'approved').length / reports.length) * 100).toFixed(1)
        : 0
    };
  }

  // Get tracking timeline (reports grouped by date)
  getTrackingTimeline(startDate, endDate) {
    const reports = reportService.getReports();
    let filtered = reports;

    if (startDate && endDate) {
      filtered = reports.filter(r => {
        const reportDate = new Date(r.date);
        return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
      });
    }

    // Group by date
    const grouped = {};
    filtered.forEach(report => {
      const dateKey = report.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(report);
    });

    return grouped;
  }

  // Get reports by date range
  getReportsByDateRange(startDate, endDate) {
    const reports = reportService.getReports();
    return reports.filter(r => {
      const reportDate = new Date(r.date);
      return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
    });
  }

  // Get recent reports (last N reports)
  getRecentReports(limit = 10) {
    const reports = reportService.getReports();
    return reports
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, limit);
  }

  // Get reports awaiting action (for approvers)
  getReportsAwaitingAction(role) {
    const reports = reportService.getReports();
    return reports.filter(r => r.status === 'pending');
  }
}

export default new TrackingService();

