export class Container {
  public id: number;
  public sku: string;
  public description: string;
  public yDim: number;
  public zDim: number;
  public xDim: number;
  public volume: number;
  public units: string;
  public constructor(init?: Partial<Container>) {
    Object.assign(this, init);
  }
}
