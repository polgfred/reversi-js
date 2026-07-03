import styles from './thinking.module.css';

// pure-CSS spinner: 8 fading bars, all animation driven from styles.module.css
export function ThinkingSpinner() {
  return (
    <span className={styles.spinner} aria-label="thinking" role="status">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}
