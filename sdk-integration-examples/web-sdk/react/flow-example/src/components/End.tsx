import { useEffect } from 'react';

type EndProps = {
  sdk: HTMLIdverseSdkUiElement;
};

export function End({ sdk }: EndProps) {
  useEffect(() => {
    // This will finalise the session at the of the flow
    sdk.close();
  }, []);

  return (
    <div>
      <h1>End</h1>
    </div>
  );
}
