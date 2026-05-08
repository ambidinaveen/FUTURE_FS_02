const StatCard = ({ label, value, tone, description }) => (
  <article className="stat-card glass-card fade-in-up">
    <div className="stat-card__label">{label}</div>
    <div className="stat-card__value">{value}</div>
    <div className={`stat-card__bar stat-card__bar--${tone}`} />
    {description ? <div className="stat-card__description">{description}</div> : null}
  </article>
);

export default StatCard;
