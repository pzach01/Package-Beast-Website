export class Container {
  public sku: string;
  public description: string;
  public height: number;
  public width: number;
  public length: number;
  public volume: number;
  public units: string;
  public constructor(init?: Partial<Container>) {
    Object.assign(this, init);
  }
}
