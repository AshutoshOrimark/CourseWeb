import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstkey'
})
export class FirstkeyPipe implements PipeTransform {

  transform(value: { [key: string]: any } | null): string | null {
    if (value === null) {
      return null;
    }
    const keys = Object.keys(value);
    return keys.length > 0 ? keys[0] : null;
  }

}
