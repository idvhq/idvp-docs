import { useEffect, useState } from 'react';
import './Details.css';

export const Details = ({
  sdk,
  details,
  onContinue,
}: {
  sdk: HTMLIdverseSdkUiElement;
  details: any[];
  onContinue: () => void;
}) => {
  const [continueButtonHasBeenClicked, setContinueButtonHasBeenClicked] =
    useState(false);

  const [is_sdk_face_scan_loaded, set_is_sdk_face_scan_loaded] =
    useState(false);

  useEffect(() => {
    // Eager loading face scan wasm, to use it in the next step which is face scan
    // Even if there might be a step between this and face scan this is a good place to eager load it
    sdk.loadFaceScan().then(() => set_is_sdk_face_scan_loaded(true));
  }, []);

  useEffect(() => {
    if (is_sdk_face_scan_loaded && continueButtonHasBeenClicked) {
      // Only transition next step (Face Scan) if wasm was loaded
      onContinue();
    }
  }, [is_sdk_face_scan_loaded, continueButtonHasBeenClicked]);

  const handleContinue = () => {
    // In the case face scan wasm is not loaded yet, the "Continue" button change to "Loading"
    // This is just a UX pattern we advice,but if want you can replace this with a loading screen
    setContinueButtonHasBeenClicked(true);
  };

  const fields = [];

  const order = [
    'full_name',
    'given_name',
    'first_name',
    'middle_name',
    'last_name',
    'document_number',
    'birth_date',
    'expiry_date',
    'document_id',
  ];

  details.sort(function (a: any, b: any) {
    const indexA = order.indexOf(a.fieldName);
    const indexB = order.indexOf(b.fieldName);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  for (let i = 0; i < details.length; i++) {
    const field = details[i];
    fields.push({
      label: field.fieldName.replace(/_/g, ' '),
      name: field.fieldName,
      value: field.fieldValue,
    });
  }

  return (
    <div className={`details ${continueButtonHasBeenClicked ? '' : 'on-top'}`}>
      <div className="details-header">
        <h4 className="details-header-title">Confirm your details</h4>
      </div>

      <div className="details-content">
        <div className="details-section-title">Personal Details</div>
        {fields.map((field) => (
          <div key={field.name} className="details-form-control">
            <label className="details-form-label">{field.label}</label>
            <input
              className="details-form-input"
              disabled
              type="text"
              value={field.value}
            />
          </div>
        ))}

        <div className="details-consent-checkbox">
          <input type="checkbox" id="consent" />
          <p className="details-consent-text">
            This is where we add the main terms and conditions consent checkbox
            text
          </p>
        </div>

        <button
          disabled={continueButtonHasBeenClicked}
          className="details-submit-button"
          onClick={handleContinue}
        >
          {continueButtonHasBeenClicked ? 'Loading' : 'Continue with Face Scan'}
        </button>
      </div>
    </div>
  );
};
