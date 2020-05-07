export class Box {
  public id: number;
  public xCenter: number;
  public yCenter: number;
  public zCenter: number;
  public width: number;
  public height: number;
  public length: number;
  public qty: number;
  constructor(width, height, length, qty) {
    this.width = width;
    this.length = length;
    this.height = height;
    this.qty = qty;
  }
}
