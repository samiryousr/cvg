import type { Template } from "@/features/resume-builder/model"

export function MiniResume({ template }: { template: Template }) {
  return (
    <div className={`mini-page mini-${template.id}`}>
      <div
        className={`mini-head ${template.dark ? "mini-head-dark" : ""}`}
        style={{ background: template.dark ? template.accent : "#fff" }}
      >
        {template.id !== "ats" && (
          <span
            className="mini-avatar"
            style={{
              background: template.dark ? "#d7e7df" : template.accent,
            }}
          />
        )}
        <div>
          <b style={{ background: template.dark ? "#fff" : "#172b28" }} />
          <i
            style={{ background: template.dark ? "#9cbdb5" : template.accent }}
          />
        </div>
      </div>
      <div className="mini-body">
        {template.id !== "ats" && template.id !== "minimalist" && (
          <aside style={{ background: `${template.accent}14` }}>
            {[1, 2, 3, 4].map((i) => (
              <span key={i} />
            ))}
          </aside>
        )}
        <main>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <b style={{ background: template.accent }} />
              <span />
              <span />
              <span className="short" />
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
