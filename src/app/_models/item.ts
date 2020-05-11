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
  constructor(width, length, height, volume) {
    this.width = width;
    this.length = length;
    this.height = height;
    this.volume = volume;
  }
}
