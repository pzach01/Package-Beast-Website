export class Item {
  public id: number;
  public sku: string;
  public description: string;
  public xCenter: number;
  public yCenter: number;
  public zCenter: number;
  public width: number;
  public height: number;
  public length: number;
  public volume: number;
  public units: string;
  public qty: number;
  public constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}
