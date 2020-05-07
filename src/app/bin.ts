import { Box } from "./box";
export class Bin {
    public height: String;
    public width: String;
    public depth: String;
    public boxList: Box[]
    constructor(width, depth, height) {
        this.width = width;
        this.depth = depth;
        this.height = height;
      }
}
