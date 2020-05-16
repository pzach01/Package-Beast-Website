export class Container {
  public height: number;
  public width: number;
  public length: number;
  public volume: number;
  public constructor(init?: Partial<Container>) {
    Object.assign(this, init);
  }
}
