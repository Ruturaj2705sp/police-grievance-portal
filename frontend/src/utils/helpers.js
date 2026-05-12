/**
 * Utility helper functions
 */

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format datetime
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Time ago format
export const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

// Category display names
export const categoryLabels = {
  murder: 'Murder',
  kidnapping: 'Kidnapping',
  assault: 'Assault',
  terrorism: 'Terrorism',
  robbery: 'Robbery',
  harassment: 'Harassment',
  fraud: 'Fraud',
  cybercrime: 'Cybercrime',
  theft: 'Theft',
  vandalism: 'Vandalism',
  noise_complaint: 'Noise Complaint',
  traffic_issue: 'Traffic Issue',
  minor_dispute: 'Minor Dispute',
  domestic_violence: 'Domestic Violence',
  missing_person: 'Missing Person',
  other: 'Other',
};

// Truncate text
export const truncate = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get priority class
export const getPriorityClass = (priority) => {
  const classes = {
    High: 'badge-high',
    Medium: 'badge-medium',
    Low: 'badge-low',
  };
  return classes[priority] || 'badge-low';
};

// Get status class
export const getStatusClass = (status) => {
  const classes = {
    Pending: 'status-pending',
    'In Progress': 'status-progress',
    Resolved: 'status-resolved',
    Rejected: 'status-rejected',
  };
  return classes[status] || 'status-pending';
};
