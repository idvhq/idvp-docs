import "./Details.css";

export const Details = ({
  details,
  onContinue,
  onDone,
}: {
  details: any[];
  onContinue: () => void;
  onDone: () => void;
}) => {
  const fields = [];

  const order = [
    "full_name",
    "given_name",
    "first_name",
    "middle_name",
    "last_name",
    "document_number",
    "birth_date",
    "expiry_date",
    "document_id",
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
      label: field.fieldName.replace(/_/g, " "),
      name: field.fieldName,
      value: field.fieldValue,
    });
  }

  return (
    <div className="details">
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

        <button className="details-submit-button" onClick={onContinue}>
          Continue
        </button>
        <button className="details-submit-button" onClick={onDone}>Done</button>
      </div>
    </div>
  );
};
