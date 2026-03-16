import React from 'react';
import styles from './Background.module.css';

export default function Background() {
  return (
    <div className={styles.bg} aria-hidden="true">
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
      <div className={styles.noise} />
    </div>
  );
}