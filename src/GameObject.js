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
        if (this.parent instanceof GameObject) this.unparent();

        if (parent instanceof GameObject) {
            this.parent = parent;
            if (this.parent.children.indexOf(this) === -1) {
                this.parent.child(this);
            }
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
        }
    }

    /**
     * Update function for this GameObject and its children.
     * @param {Number} dt Delta time
     */
    update(dt) {
        this.children.forEach(child => child.update(dt));
    }

    find(predicate, depth = 0) {

    }

    findParent(predicate, depth = 0) {
        
    }

    static create(props = {}, ...args) {
        return Object.assign(new this(...args), props);
    }
}