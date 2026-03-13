"use client";
// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — AmbientBackground
// Fixed full-viewport layer with three radial gradient orbs animated via CSS. Single instance only.

import type { ReactElement } from "react";
import styles from "./AmbientBackground.module.css";

/**
 * Renders a fixed ambient background with three animated gradient orbs.
 * Mount a single instance at the app root (e.g. in the dashboard layout).
 */
export default function AmbientBackground(): ReactElement {
  return (
    <div className={styles.ambientBackground} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
    </div>
  );
}
