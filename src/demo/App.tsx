import { useEffect, useState } from "react"

import { Editor, useCDRT } from "../editor"
import { EditorDebugPanel } from "./DebugPanel"
import { initialContent } from "./initial-content"
import { Preview } from "./Preview"
import { syncCDRTs } from "./sync-cdrts"

export default function App() {
  const cdrt1 = useCDRT({ name: "Editor 1", color: "#2563eb" })
  const cdrt2 = useCDRT({ name: "Editor 2", color: "#b45309" })
  const [previewVersion, resetPreview] = useState(0)

  useEffect(() => syncCDRTs(cdrt1, cdrt2), [cdrt1, cdrt2])

  return (
    <main className="app">
      <h1 className="visually-hidden">Editor für Lerninhalte</h1>
      <div className="app__workspace">
        <section className="app__authoring" aria-label="Inhalt bearbeiten">
          <Editor cdrt={cdrt1} initialContent={initialContent} />
        </section>

        <section className="app__preview" aria-labelledby="preview-heading">
          <header className="app__preview-header">
            <h2 id="preview-heading">Vorschau</h2>
            <button
              type="button"
              className="app__reset"
              aria-label="Vorschau zurücksetzen"
              title="Vorschau zurücksetzen"
              onClick={() => resetPreview((version) => version + 1)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 4v6h6M4.5 9a8 8 0 1 1-.2 6" />
              </svg>
            </button>
          </header>
          <div className="app__device">
            <Preview key={previewVersion} cdrt={cdrt1} />
          </div>
        </section>
      </div>

      <aside className="app__tools" aria-label="Entwicklerwerkzeuge">
        <details className="app__collaboration">
          <summary>Zusammenarbeit testen</summary>
          <Editor cdrt={cdrt2} />
        </details>
        <details className="app__debug">
          <summary>Debug-Informationen</summary>
          <EditorDebugPanel cdrt={cdrt1} />
        </details>
      </aside>
    </main>
  )
}
