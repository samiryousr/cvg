export function LoadingScreen({
  message,
  overlay = false,
}: {
  message: string
  overlay?: boolean
}) {
  return (
    <div
      className={`loading-screen${overlay ? " loading-screen-overlay" : ""}`}
      dir="rtl"
      role="status"
      aria-live="polite"
    >
      <div className="loading-glow" />
      <div className="loading-brand">
        <span>س</span>
        <strong>سيرتي</strong>
      </div>
      <div className="loading-line">
        <span />
      </div>
      <p>{message}</p>
    </div>
  )
}
