import Entity from "./Entity.js";

export default class PodEntity extends Entity {
    type = "pod";

    size = this.engine?.opt.world.tileScale / 4;
};