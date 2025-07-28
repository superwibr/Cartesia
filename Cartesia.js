import GameObject from "./src/GameObject.js";
import { GCOPTIONS, WORLDOPTIONS } from "./src/options.js";
import DimensionManager from "./src/world/DimensionManager.js";

export default class Cartesia extends GameObject {
    /** @type {DimensionManager} */
    dimensions = new DimensionManager(this.opt);

    constructor(opt) {
        super();

        this.opt = opt || {
            world: WORLDOPTIONS,
            gc: GCOPTIONS
        };

        this.child(this.dimensions);
    }
}