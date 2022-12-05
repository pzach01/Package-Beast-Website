import { evaluate } from 'mathjs'

export class DimensionInput {
    value: number;
    error: string;
}

export function evaluateDimension(value): DimensionInput {
    let dimensionInput = new DimensionInput();
    try {
        const evaluatedValue = evaluate(value)
        if (evaluatedValue == 0) {
            dimensionInput.value = value;
            dimensionInput.error = 'required';
        } else if (evaluatedValue < 0) {
            dimensionInput.value = value;
            dimensionInput.error = 'invalid-entry';
        } else {
            dimensionInput.value = evaluatedValue;
            dimensionInput.error = null;
        }
    }
    catch (e) {
        dimensionInput.value = value;
        dimensionInput.error = 'invalid-entry';
    }
    return dimensionInput
}