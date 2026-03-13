// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GrainOverlay
// Fixed full-viewport SVG noise texture overlay. Single instance only.

import type { ReactElement } from "react";
import styles from "./GrainOverlay.module.css";

const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const NOISE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}`;

/**
 * Renders a fixed grain/noise overlay across the viewport.
 * Mount a single instance at the app root (e.g. in the dashboard layout).
 */
export default function GrainOverlay(): ReactElement {
  return (
    <div className={styles.grainOverlay} aria-hidden="true">
      <img
        src={NOISE_DATA_URI}
        alt=""
        className={styles.grainOverlayImage}
        width={256}
        height={256}
      />
    </div>
  );
}
