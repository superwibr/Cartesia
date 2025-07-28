import GameObject from "../GameObject.js";
import Dimension from "./Dimension.js";

export default class DimensionManager extends GameObject {
    dims = {};

    create(opt = {}) {
        const dim = Dimension.create(opt);

        this.dims[opt.name] = dim;

        this.child(dim);

        return dim;
    }

    remove(name) {
        const dim = this.dims[name];

        if (!dim) return false;

        this.unchild(dim);

        return dim;
    }
};