import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'units'
})
export class UnitsPipe implements PipeTransform {
  transform(value: number, itemUnits: string, userUnits: string): number {

    if (itemUnits != userUnits) {
      switch (itemUnits) {
        case "mm":
          value = value / 25.4
          break;
        case "cm":
          value = value / 2.54
          break;
        default:
          break;
      }

      switch (userUnits) {
        case "mm":
          value = value * 25.4
          break;
        case "cm":
          value = value * 2.54
          break;
        default:
          break;
      }
    }
    return value
  }
}
