const Spinner = ({ label = 'Loading' }) => (
  <div className="spinner-wrap" role="status" aria-live="polite">
    <div className="spinner" />
    <span>{label}</span>
  </div>
);

export default Spinner;
