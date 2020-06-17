export class Item {
  public id: number;
  public container: number;
  public sku: string;
  public description: string;
  public xCenter: number;
  public yCenter: number;
  public zCenter: number;
  public xDim: number;
  public yDim: number;
  public zDim: number;
  public volume: number;
  public units: string;
  public qty: number;
  public constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}
