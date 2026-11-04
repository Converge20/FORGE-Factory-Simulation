import { useState } from "react";
import { chapters, sources } from "./story";
export function Education({
  index,
  compact = false,
}: {
  index: number;
  compact?: boolean;
}) {
  const c = chapters[index];
  const [expanded, setExpanded] = useState(
    () => innerWidth >= 1000 && !compact && index !== 13,
  );
  return (
    <div className="education">
      <details
        className="explanation"
        open={expanded}
        onToggle={(e) => setExpanded(e.currentTarget.open)}
      >
        <summary>
          {expanded ? "Hide detailed explanation" : "How this stage works"}
          <span>{expanded ? "−" : "+"}</span>
        </summary>
        <p>{c.explanation}</p>
      </details>
      {!expanded && <p className="short-explanation">{c.summary}</p>}
      <div className="inline-evidence">
        <span>
          {index === 7 ? "SOURCE BOUNDARY" : "VERIFIED RED BULL INFORMATION"}
        </span>
        <p>{c.fact}</p>
        <a
          href={sources[c.factSource].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {sources[c.factSource].title.replace(" · ", " — ")}{" "}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <a
        className="industry-link"
        href={sources[c.practiceSource].url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Industry reference:{" "}
        {sources[c.practiceSource].title.replace(" · ", " — ")} ↗
      </a>
      <p className="art-note">
        Illustrative machinery and layout. <span>{c.assumption}</span>
      </p>
    </div>
  );
}
export function EvidenceNotes({ index }: { index: number }) {
  const c = chapters[index];
  return (
    <>
      <h2>Real facts. An imagined factory.</h2>
      <p className="dialog-intro">
        FORGE is independent of Red Bull. Ingredient facts use the international
        English original 250 ml reference; Namibia English pages supply
        manufacturing and distribution context. Regional labels may differ.
      </p>
      <div className="evidence-block">
        <span>01 / VERIFIED RED BULL INFORMATION</span>
        <p>{c.fact}</p>
        <a
          href={sources[c.factSource].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {sources[c.factSource].title} ↗
        </a>
      </div>
      <div className="evidence-block">
        <span>02 / STANDARD INDUSTRY PRACTICE</span>
        <p>{c.practice}</p>
        <a
          href={sources[c.practiceSource].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {sources[c.practiceSource].title} ↗
        </a>
      </div>
      <div className="evidence-block">
        <span>03 / ILLUSTRATIVE RECONSTRUCTION</span>
        <p>{c.assumption}</p>
      </div>
      <details>
        <summary>All sources and asset notes</summary>
        {Object.entries(sources).map(([key, s]) => (
          <a
            className="all-source"
            key={key}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.title} ↗
          </a>
        ))}
        <p>
          The vehicle is an original, generic white tractor-trailer with no
          logos, branding, product graphics or lettering. No paid service,
          downloaded vehicle model or product image is used. Existing
          manufacturing models are shared between modes. The former
          product-reveal scene is removed.
        </p>
        <p>
          Layout, process timing, recipe ratios, sensors, driving path and
          vehicle dimensions are illustrative. Manufacturer references do not
          imply a supplier relationship with Red Bull. Ball's source is
          available as indexed technical text; direct PDF fetching was blocked.
        </p>
      </details>
      <div className="dialog-bottom">
        FORGE / PHASE 03<span>Independent educational reconstruction</span>
      </div>
    </>
  );
}
