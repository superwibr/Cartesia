import Entity from "./Entity.js";

export default class PodEntity extends Entity {
    type = "pod";

    size = this.engine?.options.world.tileScale / 4;
};