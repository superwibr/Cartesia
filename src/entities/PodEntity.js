import { WORLDOPTIONS } from "../options.js";
import Entity from "./Entity.js";

export default class PodEntity extends Entity {
    type = "pod";

    size = WORLDOPTIONS.tileScale / 4;
};