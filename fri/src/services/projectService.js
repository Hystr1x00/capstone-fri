// Project Service - Handle project management
// Workflow: Dosen create project -> Lab accept -> Lab assign members

class ProjectService {
  constructor() {
    this.storageKey = 'lab_projects_data';
    this.initDefaultData();
  }

  initDefaultData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultProjects = [
        {
          id: 1,
          title: 'Pengembangan Sistem Monitoring IoT',
          description: 'Membangun sistem monitoring berbasis IoT untuk tracking real-time',
          deadline: '2025-12-31',
          status: 'pending', // pending, accepted, in_progress, completed, cancelled
          assignedTo: null, // Array of member names
          createdAt: '2025-01-15',
          createdBy: 'dosen',
          acceptedAt: null,
          completedAt: null
        },
        {
          id: 2,
          title: 'Aplikasi Mobile Lab Management',
          description: 'Pengembangan aplikasi mobile untuk manajemen laboratorium',
          deadline: '2025-11-30',
          status: 'accepted',
          assignedTo: ['Ahmad Fauzi', 'Siti Nurhaliza'],
          createdAt: '2025-01-10',
          createdBy: 'dosen',
          acceptedAt: '2025-01-12T10:00:00Z',
          completedAt: null
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultProjects));
    }
  }

  // Get all projects
  getProjects() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Get projects by status
  getProjectsByStatus(status) {
    const projects = this.getProjects();
    return projects.filter(p => p.status === status);
  }

  // Get projects for specific role
  getProjectsForRole(role) {
    const projects = this.getProjects();
    if (role === 'dosen') {
      return projects.filter(p => p.createdBy === 'dosen');
    }
    // For KK and Lab, return all projects
    return projects;
  }

  // Create project (by Dosen)
  createProject(projectData) {
    const projects = this.getProjects();
    const newProject = {
      id: Date.now(),
      title: projectData.title,
      description: projectData.description,
      deadline: projectData.deadline,
      status: 'pending',
      assignedTo: null,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'dosen',
      acceptedAt: null,
      completedAt: null
    };
    projects.push(newProject);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return newProject;
  }

  // Accept project (by Lab)
  acceptProject(projectId) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project && project.status === 'pending') {
      project.status = 'accepted';
      project.acceptedAt = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return project;
    }
    return null;
  }

  // Assign members to project
  assignMembers(projectId, members) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    // Allow assignment for both 'accepted' and 'in_progress' status
    if (project && (project.status === 'accepted' || project.status === 'in_progress')) {
      // Handle empty array (removing all assignments)
      if (Array.isArray(members) && members.length === 0) {
        project.assignedTo = null;
        project.status = 'accepted'; // Reset to accepted when no members assigned
      } else {
        project.assignedTo = Array.isArray(members) ? members : [members];
        if (project.assignedTo.length > 0) {
          project.status = 'in_progress';
        } else {
          project.status = 'accepted'; // Reset to accepted if somehow empty
        }
      }
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return project;
    }
    return null;
  }

  // Update project status
  updateProjectStatus(projectId, newStatus) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.status = newStatus;
      if (newStatus === 'completed') {
        project.completedAt = new Date().toISOString();
      }
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return project;
    }
    return null;
  }

  // Update project details
  updateProject(projectId, projectData) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      Object.assign(project, {
        ...projectData,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return project;
    }
    return null;
  }

  // Delete project
  deleteProject(projectId) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }
}

export default new ProjectService();

