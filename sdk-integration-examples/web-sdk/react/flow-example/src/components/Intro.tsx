type IntroProps = {
  onContinue: () => void;
};

export function Intro({ onContinue }: IntroProps) {
  return (
    <div className="container">
      <h1>Intro Page</h1>

      <p>Have your ID ready</p>

      <p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2H14L20 8V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <polyline points="14 2 14 8 20 8" />
          <rect x="7" y="12" width="10" height="4" rx="1" ry="1" />
          <line x1="9" y1="12" x2="9" y2="16" />
        </svg>
      </p>
      <p>
        <button className="my-button" onClick={onContinue}>
          Continue
        </button>
      </p>
    </div>
  );
}
