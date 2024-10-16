import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  @Input() details: any = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onTryAgain = new EventEmitter<void>();

  onGetFields() {
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

    this.details.sort(function (a: any, b: any) {
      var indexA = order.indexOf(a.fieldName);
      var indexB = order.indexOf(b.fieldName);

      // If one of the field names is not present in the order array,
      // it should come after the ones that are present.
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    for (let i = 0; i < this.details.length; i++) {
      const field = this.details[i];
      fields.push({
        label: field.fieldName.replace(/_/g, ' '),
        name: field.fieldName,
        value: field.fieldValue,
      });
    }
    return fields;
  }
}
