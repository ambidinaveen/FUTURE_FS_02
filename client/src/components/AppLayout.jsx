import { useAuth } from '../context/AuthContext.jsx';

const AppLayout = ({ title, subtitle, actions, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-glow dashboard-glow--one" />
      <div className="dashboard-glow dashboard-glow--two" />
      <header className="topbar glass-card">
        <div>
          <p className="eyebrow">Mini CRM Admin</p>
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </div>
        <div className="topbar__actions">
          {actions}
          <div className="user-pill">
            <span className="user-pill__avatar">A</span>
            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <span>{user?.email || 'admin'}</span>
            </div>
          </div>
          <button className="button button--ghost" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default AppLayout;
