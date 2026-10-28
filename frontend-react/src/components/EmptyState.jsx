import Icon from './Icon'

function EmptyState({ icon = 'alert', title, children, action }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state-icon"><Icon name={icon} size={28} /></span>
      <p className="empty-state-title">{title}</p>
      {children && <div className="empty-state-body">{children}</div>}
      {action}
    </div>
  )
}

export default EmptyState
