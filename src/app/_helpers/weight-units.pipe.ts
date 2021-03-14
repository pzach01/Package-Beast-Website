import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weightUnits'
})
export class WeightUnitsPipe implements PipeTransform {

  transform(value: number, itemWeightUnits: string, userWeightUnits: string): number {

    if (itemWeightUnits != userWeightUnits) {
      switch (itemWeightUnits) {
        case "kg":
          value = value / 0.453592
          break;
        default:
          break;
      }

      switch (userWeightUnits) {
        case "kg":
          value = value * 0.453592
          break;
        default:
          break;
      }
    }
    return value
  }
}

