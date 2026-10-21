type LoadingProps = {
  /** Caption shown beneath the animation. */
  label?: string;
  /** Fill the viewport area below the fixed header (page-level loaders). */
  fullPage?: boolean;
  /** Smaller variant for cards, charts and inline panels. */
  compact?: boolean;
  className?: string;
};

const Loading = ({
  label = 'Loading…',
  fullPage = false,
  compact = false,
  className,
}: LoadingProps) => {
  return (
    <div
      aria-live="polite"
      className={[
        'load-screen',
        fullPage ? 'load-screen--full' : '',
        compact ? 'load-screen--compact' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      <div aria-hidden="true" className="container-loading">
        <div className="cloud front">
          <span className="left-front"></span>
          <span className="right-front"></span>
        </div>
        <span className="sun sunshine"></span>
        <span className="sun"></span>
        <div className="cloud back">
          <span className="left-back"></span>
          <span className="right-back"></span>
        </div>
      </div>
      {label ? (
        <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      ) : null}
    </div>
  );
};

export default Loading;
