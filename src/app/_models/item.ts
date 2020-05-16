export class Item {
  public id: number;
  public xCenter: number;
  public yCenter: number;
  public zCenter: number;
  public width: number;
  public height: number;
  public length: number;
  public volume: number;
  public qty: number;
  public constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}
