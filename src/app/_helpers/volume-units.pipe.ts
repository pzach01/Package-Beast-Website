import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'volumeUnits'
})
export class VolumeUnitsPipe implements PipeTransform {

  transform(value: number, itemUnits: string, userUnits: string): number {
    if (itemUnits != userUnits) {
      switch (itemUnits) {
        case "mm":
          value = value / 16387.064
          break;
        case "cm":
          value = value / 16.387064
          break;
        default:
          break;
      }

      switch (userUnits) {
        case "mm":
          value = value * 16387.064
          break;
        case "cm":
          value = value * 16.387064
          break;
        default:
          break;
      }
    }
    return value
  }

}
