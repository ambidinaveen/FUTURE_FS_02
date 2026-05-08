const Modal = ({ title, children, onClose, footer }) => (
  <div className="modal-backdrop" onClick={onClose} role="presentation">
    <div className="modal-panel glass-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
      <div className="modal-header">
        <div>
          <p className="eyebrow">Mini CRM</p>
          <h3>{title}</h3>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
          ×
        </button>
      </div>
      <div className="modal-body">{children}</div>
      {footer ? <div className="modal-footer">{footer}</div> : null}
    </div>
  </div>
);

export default Modal;
