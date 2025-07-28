import Attribute from "./Attribute.js";
import GameObject from "../../GameObject.js";

export default class Stat extends GameObject {
    /** 
     * The name used by the stats manager to combine same stats
     * @type {String}
     */
    name = "";

    /**
     * The attribute representing the minimum value this stat can take
     * @type {Attribute}
     */
    min = new Attribute();

    /**
     * The attribute representing the maximum value this stat can take
     * @type {Attribute}
     */
    max = new Attribute("base", Infinity);

    /**
     * The attribute representing this stat's value
     * @type {Attribute}
     */
    value = new Attribute();

    clamp() {
        return this.value.value = Math.max(this.min.value, Math.max(this.value.value, this.max.value));
    }

    /**
     * Applies the attributes of this stat onto another
     * @param {Stat} stat The stat to apply this stat on
     */
    applyTo(stat) {
        this.min.applyTo(stat.min);
        this.max.applyTo(stat.max);
        this.value.applyTo(stat.value);
    }

    /** Resets this stat's attributes to their base values */
    reset() {
        this.min.reset();
        this.max.reset();
        this.value.reset();
    }

    clone(){
        return new this(this.name, {
            min: this.min.clone(),
            max: this.max.clone(),
            value: this.value.clone()
        });
    }

    /**
     * @param {String} name The name used by the stats manager to combine same stats
     * @param {Object.<String, Attribute>} props The attributes describing the minimum, maximum, and value of this stat
     */
    constructor(name = "", props = {}) {
        super();

        this.name = name;

        if (props.min instanceof Attribute) this.min = props.min;
        if (props.max instanceof Attribute) this.max = props.max;
        if (props.value instanceof Attribute) this.value = props.value;
    }
}