import Card from "./src/entities/cards/Card.js";
import Deck from "./src/entities/cards/Deck.js";
import Entity from "./src/entities/Entity.js";
import PodEntity from "./src/entities/PodEntity.js";
import Attribute from "./src/entities/stats/Attribute.js";
import ModifierFilter from "./src/entities/stats/ModifierFilter.js";
import Stat from "./src/entities/stats/Stat.js";
import StaticModifier from "./src/entities/stats/StaticModifier.js";
import StatModifier from "./src/entities/stats/StatModifier.js";
import StatsManager from "./src/entities/stats/StatsManager.js";
import TileEntity from "./src/entities/TileEntity.js";
import GameObject from "./src/GameObject.js";
import { GCOPTIONS, WORLDOPTIONS } from "./src/options.js";
import Dimension from "./src/world/Dimension.js";
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

        [
            GameObject,
            Attribute,
            Stat,
            StatModifier,
            StaticModifier,
            ModifierFilter,
            StatsManager,
            Entity,
            PodEntity,
            TileEntity,
            Card,
            Deck,
            Dimension,
            DimensionManager
        ].forEach(d => attachContext(this, d));

        this.child(this.dimensions);
    }
}

// sanity over heresy
const attachContext = (parentClass, dependantClass) => {
    dependantClass.prototype.engine = parentClass;
    parentClass[dependantClass.name] = dependantClass;
};

export {
    Cartesia,
    GameObject,
    Attribute,
    Stat,
    StatModifier,
    StaticModifier,
    ModifierFilter,
    StatsManager,
    Entity,
    PodEntity,
    TileEntity,
    Card,
    Deck,
    Dimension,
    DimensionManager
};