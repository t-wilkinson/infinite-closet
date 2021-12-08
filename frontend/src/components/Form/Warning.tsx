export const Warning = ({ warnings = [], children = null }) =>
  (children || warnings.length > 0) && (
    <span className="font-bold text-sm text-warning" role="warning">
      {warnings.slice(0, 1)}
      {children}
    </span>
  )

export default Warning
