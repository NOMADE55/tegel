import { Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from '../stencil-generated/value-accessor';
/**
 * A custom value accessor for the tds-radio-button and tds-chip of type radio. It extends the default ValueAccessor that is auto-generated by Stencil
 * Stencil offers an autogenerated radio value accessor but does not currently work as expected.
 * An issue was submitted to their repository: https://github.com/ionic-team/stencil-ds-output-targets/issues/434
 * If the issue is ever fixed this value accessor can be replaced with the one auto-generated by Stencil.
 */
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'tds-radio-button, tds-chip[type="radio"]',
  host: {
    '(tdsChange)': 'handleChangeEvent($event.target.value)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TdsRadioValueAccessor,
      multi: true,
    },
  ],
})
export class TdsRadioValueAccessor extends ValueAccessor {
  writeValue(value: any) {
    this.el.nativeElement.checked = value === this.el.nativeElement.value;
  }
}