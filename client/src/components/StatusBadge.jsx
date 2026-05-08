const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted'
};

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-badge--${status}`}>{STATUS_LABELS[status] || status}</span>
);

export default StatusBadge;
