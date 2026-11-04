import styles from './publication-design.module.css'

export function PublicationLoading() {
  return <main aria-busy="true" aria-label="Loading" className={`${styles.page} ${styles.listing}`}>
    <div className={styles.container} aria-hidden="true">
      <div className={styles.loadingHeading}>
        <span className={`${styles.loadingBlock} ${styles.loadingEyebrow}`} />
        <span className={`${styles.loadingBlock} ${styles.loadingTitle}`} />
        <span className={`${styles.loadingBlock} ${styles.loadingIntro}`} />
      </div>
      <div className={styles.loadingToolbar} />
      <div className={styles.loadingFeature}>
        <span className={`${styles.loadingBlock} ${styles.loadingArt}`} />
        <div className={styles.loadingCopy}>
          <span className={`${styles.loadingBlock} ${styles.loadingEyebrow}`} />
          <span className={styles.loadingBlock} />
          <span className={styles.loadingBlock} />
          <span className={`${styles.loadingBlock} ${styles.loadingIntro}`} />
        </div>
      </div>
    </div>
  </main>
}
