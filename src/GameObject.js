import Cartesia from "../Cartesia.js";

export default class GameObject {
    /** @type {GameObject?} */
    parent = null;

    /** @type {GameObject[]} */
    children = [];

    /**
     * Adds a GameObject to this GameObject's child list
     * @param {GameObject} child 
     */
    child(child) {
        if (this.children.indexOf(child) === -1) {
            this.children.push(child);
            child.setparent(this);
        }
    }

    /**
     * Removes a GameObject to this GameObject's child list
     * @param {GameObject} child 
     */
    unchild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.unparent();
        }
    }

    /**
     * Sets this GameObject's parent, and childs itself to it.
     * If there is already a parent, this GameObject is properly unchilded from it.
     * @param {GameObject} parent 
     */
    setparent(parent) {
        if (parent instanceof GameObject) {
            if (this.parent instanceof GameObject) this.unparent();

            this.parent = parent;
            if (this.parent.children.indexOf(this) === -1) {
                this.parent.child(this);
            }

            // root should be updated
            this.#cleanRoot = false;
        }
    }

    /**
     * Unsets this GameObject's parent, and unchilds itself from it.
     * @param {GameObject} parent 
     */
    unparent() {
        if (this.parent instanceof GameObject) {
            if (this.parent.children.indexOf(this) !== -1) {
                this.parent.unchild(this);
            }
            this.parent = null;

            // root should be updated
            this.#cleanRoot = false;
        }
    }

    /**
     * Update function for this GameObject and its children.
     * @param {Number} dt Delta time
     */
    update(dt) {
        this.children.forEach(child => child.update(dt));
    }

    allChildren(depth = 0) {
        const all = [];
        const mem = [this];

        while ((depth === 0 || depth--) && mem.length) {
            const curr =  [...mem];
            mem.length = 0;

            for(const gobj of curr) mem.push(...gobj.children);

            all.push(...mem);
        }

        return all;
    }

    find(predicate, depth = 0) {
        return this.allChildren(depth).find(predicate);
    }

    findParent(predicate, depth = 0) {
        if (this.parent === null) return null;

        return predicate(this.parent)
            ? this.parent
            : this.parent.findParent(
                predicate,
                depth === 0
                    ? 0
                    : depth - 1
            );
    }

    #cleanRoot = true;
    #savedRoot = this;
    get root() {
        if (this.#cleanRoot) return this.#savedRoot;

        const found = this.findParent(p => p.parent === null);

        if (found === null) {
            console.warn(`${this.constructor.name} tried to access root but has no parent`);
            return null;
        }

        if (!(found instanceof Cartesia)) console.warn(`${this.name} cannot trace root to instance of Cartesia. This is probably not intended behaviour.`);

        this.#savedRoot = found;
        this.#cleanRoot = true;

        return found;
    }

    static create(props = {}, ...args) {
        return Object.assign(new this(...args), props);
    }
}