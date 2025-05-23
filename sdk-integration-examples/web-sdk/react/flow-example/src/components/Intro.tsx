import idverselogo from '/logo.svg';
import frontID from '/images/frontID.svg';

type IntroProps = {
  onContinue: () => void;
};

export function Intro({ onContinue }: IntroProps) {
  return (
    <div className="container">
      <a href="https://idverse.com" target="_blank">
        <img src={idverselogo} className="logo" alt="IDVerse logo" />
      </a>

      <h1>IDV Flow Example</h1>

      <p>Have your ID ready</p>

      <p>
        <img src={frontID} className="logo" alt="ID doc" />
      </p>
      <p>
        <button className="my-button" onClick={onContinue}>
          Continue
        </button>
      </p>
    </div>
  );
}
