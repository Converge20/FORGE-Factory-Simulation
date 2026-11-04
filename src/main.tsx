import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import Scene from "./Scene";
import { chapters, navigate } from "./story";
import type { StoryState } from "./story";
import { explorerStations } from "./facility";
import { Education, EvidenceNotes } from "./Education";
import "./style.css";
function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      style={back ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}
function App() {
  const pressStart = useRef<[number, number] | null>(null);
  const [mode, setMode] = useState<"welcome" | "guided" | "explorer">(
    "welcome",
  );
  const [selected, setSelected] = useState<number | null>(null),
    [reset, setReset] = useState(0);
  const [story, setStory] = useState<StoryState>({
    index: 0,
    lockedUntil: 0,
    revision: 0,
  });
  const [, setClock] = useState(0),
    [ready, setReady] = useState(false),
    [info, setInfo] = useState(false),
    [paused, setPaused] = useState(false),
    [manualReduced, setManualReduced] = useState(false),
    [osReduced, setOsReduced] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  const [finished, setFinished] = useState(false),
    [closing, setClosing] = useState(false);
  const onFinale = useCallback(() => setFinished(true), []),
    onClosing = useCallback(() => setClosing(true), []),
    onReady = useCallback(() => setReady(true), []);
  const reduced = manualReduced || osReduced;
  const current = mode === "explorer" ? (selected ?? 0) : story.index;
  const chapter = chapters[current];
  const locked = story.lockedUntil > performance.now();
  const dialog = useRef<HTMLDialogElement>(null),
    sourceButton = useRef<HTMLButtonElement>(null);
  const advance = useCallback(
    (action: "next" | "previous" | "restart") =>
      setStory((s) => navigate(s, action, performance.now(), reduced)),
    [reduced],
  );
  const inspect = useCallback((index: number) => setSelected(index), []);
  function overview() {
    setSelected(null);
    setReset((v) => v + 1);
  }
  function switchMode(next: "welcome" | "guided" | "explorer") {
    setInfo(false);
    setMode(next);
  }
  useLayoutEffect(() => {
    setFinished(false);
    setClosing(false);
  }, [story.index, story.revision, mode]);
  useEffect(() => {
    const timer = setTimeout(
      () => setClock((v) => v + 1),
      Math.max(0, story.lockedUntil - performance.now()) + 10,
    );
    return () => clearTimeout(timer);
  }, [story]);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setOsReduced(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  useEffect(() => {
    if (info) dialog.current?.showModal();
    else dialog.current?.close();
  }, [info]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        info ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;
      if (
        e.key === " " &&
        (e.target as HTMLElement).closest("button,a,summary")
      )
        return;
      if (mode === "guided") {
        if (["ArrowRight", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          if (story.index !== 13) advance("next");
        }
        if (["ArrowLeft", "PageUp"].includes(e.key)) {
          e.preventDefault();
          advance("previous");
        }
        if (e.key === "Home") {
          e.preventDefault();
          advance("restart");
        }
      } else if (mode === "explorer" && e.key === "Home") {
        e.preventDefault();
        setSelected(null);
        setReset((v) => v + 1);
      }
      if (e.key.toLowerCase() === "p") setPaused((v) => !v);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [mode, info, advance, story.index]);
  function closeSources() {
    setInfo(false);
    sourceButton.current?.focus();
  }
  return (
    <main
      className={`cinema mode-${mode} ${locked && mode === "guided" ? "transitioning" : ""} ${reduced ? "reduced" : ""}`}
      data-mode={mode}
      data-chapter={story.index + 1}
      data-selected={selected ?? "overview"}
    >
      <div className="scene">
        <Scene
          index={story.index}
          revision={story.revision}
          mode={mode}
          selected={selected}
          reset={reset}
          onSelect={inspect}
          reduced={reduced}
          paused={paused || info}
          onReady={onReady}
          onFinale={onFinale}
          onClosing={onClosing}
        />
      </div>
      <div className="vignette" />
      {mode === "guided" && (
        <button
          className="advance-surface"
          aria-label="Advance to next chapter"
          tabIndex={-1}
          disabled={locked || story.index === 13}
          onPointerDown={(e) => {
            pressStart.current = [e.clientX, e.clientY];
          }}
          onClick={(e) => {
            const start = pressStart.current;
            pressStart.current = null;
            if (
              e.detail === 0 ||
              !start ||
              Math.hypot(e.clientX - start[0], e.clientY - start[1]) < 8
            )
              advance("next");
          }}
        />
      )}
      {mode === "guided" && (
        <div className="film-shutter" key={`${story.revision}-${mode}`} />
      )}
      <header className="film-header">
        <button
          className="brand"
          aria-label="FORGE welcome"
          onClick={() => switchMode("welcome")}
        >
          <span className="forge-mark">
            <i />
            <i />
            <i />
          </span>
          FORGE
        </button>
        {mode !== "welcome" && (
          <nav className="mode-switch" aria-label="Experience mode">
            <button
              aria-pressed={mode === "guided"}
              onClick={() => switchMode("guided")}
            >
              Guided Experience
            </button>
            <button
              aria-pressed={mode === "explorer"}
              onClick={() => switchMode("explorer")}
            >
              Factory Explorer
            </button>
          </nav>
        )}
        <div className="header-actions">
          {mode !== "welcome" && (
            <button
              aria-label={paused ? "Resume animation" : "Pause animation"}
              onClick={() => setPaused((v) => !v)}
              title="Pause / resume (P)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                {paused ? (
                  <path d="m5 3 11 7-11 7z" />
                ) : (
                  <path d="M6 4v12M13 4v12" />
                )}
              </svg>
            </button>
          )}
          <button
            ref={sourceButton}
            className="sources-button"
            onClick={() => setInfo(true)}
          >
            Sources & notes <span>↗</span>
          </button>
        </div>
      </header>
      {mode === "welcome" && (
        <section className="welcome">
          <div className="chapter-kicker">
            <span /> A STUDY IN MAKING
          </div>
          <h1>
            One factory.
            <br />
            <span>Two ways to explore.</span>
          </h1>
          <p>Follow the story, or find your own path through the machinery.</p>
          <div className="welcome-choices">
            <button
              className="welcome-choice"
              onClick={() => switchMode("guided")}
            >
              <span>
                <strong>Guided Experience</strong>
                <small>
                  Fourteen cinematic chapters. Advance at your own pace.
                </small>
              </span>
              <Arrow />
            </button>
            <button
              className="welcome-choice"
              onClick={() => switchMode("explorer")}
            >
              <span>
                <strong>Factory Explorer</strong>
                <small>
                  Orbit the connected factory. Select a machine to look closer.
                </small>
              </span>
              <Arrow />
            </button>
          </div>
          <span className="welcome-note">
            Independent educational reconstruction · Illustrative facility
            layout
          </span>
        </section>
      )}
      {mode === "guided" && (
        <>
          <div className="chapter-rail" aria-hidden="true">
            <span>{String(story.index + 1).padStart(2, "0")}</span>
            <i />
            <span>14</span>
          </div>
          <article
            className="chapter-content"
            key={chapter.id}
            aria-live="polite"
          >
            <div className="chapter-kicker">
              <span />
              {chapter.part}
            </div>
            <p className="chapter-subtitle">{chapter.subtitle}</p>
            <h1>
              {(story.index === 13 && closing
                ? "Thanks for exploring the journey."
                : chapter.title
              )
                .split("\n")
                .map((line, i) => (
                  <span key={line} className={i ? "soft-line" : ""}>
                    {line}
                  </span>
                ))}
            </h1>
            <Education key={chapter.id} index={story.index} />
          </article>
          <nav className="film-navigation" aria-label="Chapter navigation">
            <div className="previous-actions">
              <button
                aria-label="Previous chapter"
                disabled={locked || story.index === 0}
                onClick={() => advance("previous")}
              >
                <Arrow back />
              </button>
              <button
                className="restart"
                aria-label="Restart presentation"
                disabled={locked}
                onClick={() => advance("restart")}
              >
                ↺ <span>Restart</span>
              </button>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label={`Chapter ${story.index + 1} of 14`}
              aria-valuenow={story.index + 1}
              aria-valuemin={1}
              aria-valuemax={14}
            >
              {chapters.map((c, i) => (
                <i key={c.id} className={i <= story.index ? "complete" : ""} />
              ))}
            </div>
            {story.index === 13 && !finished ? (
              <span className="departure-pending">Shipment departing…</span>
            ) : (
              <button
                className="next-chapter"
                disabled={locked}
                onClick={() => advance(story.index === 13 ? "restart" : "next")}
              >
                {story.index === 13
                  ? "Experience it again"
                  : story.index === 0
                    ? "Begin the journey"
                    : "Continue"}
                <Arrow />
              </button>
            )}
          </nav>
        </>
      )}
      {mode === "explorer" && (
        <>
          <div className="explorer-toolbar">
            <label>
              Find a process
              <select
                aria-label="Find a process"
                value={selected ?? ""}
                onChange={(e) =>
                  e.target.value ? inspect(Number(e.target.value)) : overview()
                }
              >
                <option value="">Complete factory overview</option>
                {explorerStations.map((s) => (
                  <option key={s.id} value={s.chapter}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="reset-view" onClick={overview}>
              ↺ Reset view
            </button>
          </div>
          <div className="station-markers">
            {explorerStations.map((s) => (
              <button
                key={s.id}
                data-station={s.chapter}
                className={`marker ${s.chapter === selected ? "selected" : ""}`}
                onClick={() => inspect(s.chapter)}
                aria-label={`Inspect ${s.title}`}
                title={s.title}
              >
                <span>{String(s.chapter + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          {selected === null ? (
            <section className="explorer-intro">
              <span className="chapter-kicker">ONE CONNECTED FACILITY</span>
              <h1>Follow the flow.</h1>
              <p>
                Can bodies on conveyors. Ingredients through pipes.
                <br />
                Select any numbered machine to see how it works.
              </p>
              <span className="layout-note">
                An illustrative layout, not a documented Red Bull floor plan.
              </span>
            </section>
          ) : (
            <section className="inspector" key={chapter.id} aria-live="polite">
              <button className="return-factory" onClick={overview}>
                <Arrow back /> Return to Factory
              </button>
              <span className="chapter-subtitle">
                {explorerStations.find((s) => s.chapter === selected)?.zone}
              </span>
              <h1>{chapter.subtitle.replace(/^\d+ \/ /, "").toLowerCase()}</h1>
              <Education key={chapter.id} compact index={selected} />
            </section>
          )}
          <div className="explorer-hint">
            <span>Drag to orbit</span>
            <i />
            <span>Scroll / pinch to zoom</span>
            <i />
            <span>Right-drag / two fingers to pan</span>
          </div>
        </>
      )}
      <footer>
        <span>
          Independent educational visualization. Not affiliated with or endorsed
          by Red Bull.
        </span>
        <div>
          <button
            aria-pressed={reduced}
            disabled={osReduced}
            onClick={() => setManualReduced((v) => !v)}
          >
            {reduced ? "Reduced motion on" : "Reduce motion"}
          </button>
          {mode === "guided" && (
            <span className="keyboard-hint">← → TO EXPLORE</span>
          )}
          <span className="phase-label">PHASE 03</span>
        </div>
      </footer>
      {!ready && (
        <div className="loading">
          <span className="forge-mark">
            <i />
            <i />
            <i />
          </span>
          <p>Preparing the factory</p>
        </div>
      )}
      <dialog
        ref={dialog}
        onCancel={closeSources}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeSources();
        }}
      >
        <div className="dialog-top">
          <span>THE EVIDENCE BEHIND THE EXPERIENCE</span>
          <button aria-label="Close sources" onClick={closeSources}>
            ×
          </button>
        </div>
        <EvidenceNotes index={current} />
      </dialog>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
