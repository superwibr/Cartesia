import GameObject from "../../GameObject.js";

export default class Attribute extends GameObject {
    /** 
     * The operation this attribute uses when applying to another
     * @type {"base"|"set"|"add"|"multiply"|"multiply-base"|"add-multiplied"|"add-multiplied-base"} 
     */
    operation;

    /**
     * The value of this attribute
     * @type {Number}
     */
    value;

    /**
     * The base value of this attribute when it was created
     * @type {Number}
     */
    base;

    /**
     * Applies the operation of this attribute onto another
     * @param {Attribute} attr The attribute to apply this attribute on
     */
    applyTo(attr) {
        switch (this.operation) {
            case "noop":
                break;
            case "base":
                attr.base = this.value;
                break;
            case "set":
                attr.value = this.value;
                break;
            case "add":
                attr.value += this.value;
                break;
            case "multiply":
                attr.value *= this.value;
                break;
            case "multiply-base":
                attr.base *= this.value;
                break;
            case "add-multiplied":
                attr.value += attr.value * this.value;
                break;
            case "add-multiplied-base":
                attr.value += attr.base * this.value;
                break;
        }
    }

    toString() {
        return ({
            "noop": "x",
            "base": `base =${this.value}`,
            "set": `=${this.value}`,
            "add": `+${this.value}`,
            "multiply": `${this.value * 100}%`,
            "multiply-base": `${this.value}% base`,
            "add-multiplied": `+${this.value * 100}%`,
            "add-multiplied-base": `+${this.value * 100}% base`,
        })[this.operation];
    }

    /** Resets this attribute's value to its base value */
    reset() {
        this.value = this.base;
    }

    clone(){
        return this.constructor.create({
            operation: this.operation,
            value: this.value,
            base: this.base
        });
    }

    /**
     * 
     * @param {"base"|"set"|"add"|"multiply"|"multiply-base"|"add-multiplied"|"add-multiplied-base"} operation The operation this attribute uses when applying to another
     * @param {Number} value The initial value of this attribute. Used as base.
     */
    constructor(operation = "base", value = 0) {
        super();

        this.operation = operation;
        this.value = value;
        this.base = this.value;
    }
}