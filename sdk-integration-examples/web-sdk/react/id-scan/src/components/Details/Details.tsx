import "./Details.css";

export const Details = ({
  details,
  onClose,
  onTryAgain,
}: {
  details: any;
  onClose: () => void;
  onTryAgain: () => void;
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
    var indexA = order.indexOf(a.fieldName);
    var indexB = order.indexOf(b.fieldName);

    // If one of the field names is not present in the order array,
    // it should come after the ones that are present.
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
      <div className="form">
        <h4>Extracted details</h4>
        {fields.map((field, id) => (
          <div key={id} className="form-control">
            <label htmlFor={field.name}>{field.label}</label>
            <input
              disabled
              type="text"
              onChange={() => null}
              name={field.name}
              value={field.value}
              id={field.name}
            />
          </div>
        ))}
      </div>

      <footer>
        <button onClick={() => onClose()}>Go Back</button>
        <button onClick={() => onTryAgain()}>Try again</button>
      </footer>
    </div>
  );
};
