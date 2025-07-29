import GameObject from "../GameObject.js";
import Entity from "../entities/Entity.js";

export default class Dimension extends GameObject {
    entities = [];
    tiles = {};
    events = [];
    time = 0;

    worldToTile(x) {
        return Math.floor((x + this.engine?.opt.world.tileScale / 2) / this.engine?.opt.world.tileScale);
    }
    worldToTile2d(x, y) {
        return [this.worldToTile(x), this.worldToTile(y)];
    }

    /**
     * Adds an entity to the dimension
     * @param {Entity} entity The entity to add to the dimension
     * @returns {Boolean} Success
     */
    addEntity(entity) {
        if (!(entity instanceof Entity)) return false;
        this.events.push(["add", this.time, entity]);
        return true;
    }

    /**
     * Removes an entity from the dimension
     * @param {Entity} entity The entity to remove from the dimension
     * @returns {Boolean} Success
     */
    removeEntity(entity) {
        if (!this.entities.includes(entity)) return false;
        this.events.push(["remove", this.time, entity.id]);
        return true;
    }

    /**
     * Handles an event from the dimension's event queue
     * @param {Number} i The index of the event in the queue
     * @param {Number} dt The time delta of the update step
     */
    handleEvent(i, dt) {
        const e = this.events[i];

        const [type, time, ...args] = e;

        switch (type) {
            case "callback": {
                const cb = args[0];
                cb();

                break;
            }

            case "gc": {
                this.garbageCollect();
                this.events.push(["gc", this.time + this.engine?.opt.world.interval]);

                break;
            }

            case "mark": {
                const mark = args.slice(-1)[0];
                args.slice(0, -1).forEach(key => this.tiles[key] = mark);

                break;
            }

            case "move": {
                const [e, x, y] = args;
                e.x = x;
                e.y = y;

                break;
            }

            case "add": {
                const entity = args[0];

                this.child(entity);

                entity.id = this.entities.push(entity) - 1;
                entity.dim = this;

                entity.onadd();

                break;
            }

            case "remove": {
                const index = args[0];
                const entity = this.entities[index];

                entity.onremove();

                this.entities[index] = null;
                entity.dim = null;
                entity.id = null;

                this.unchild(entity);

                break;
            }

        }

        console.log("[DIM EVENTS] ", ...e);

        this.events[i] = null;
    }

    /**
     * Cancels an event from the dimension's event queue by its index
     * @param {Number} i Index of the event
     * @returns {Array|null} The removed event
     */
    cancelEvent(i) {
        const ev = this.events[i];
        this.events[i] = null;
        return ev;
    }

    /** Garbage collects null values from entity and event registers. Currently breaking. */
    garbageCollect() {
        const f = el => el !== null;
        filterM(this.entities, f);
        filterM(this.events, f);
    }

    /**
     * Updates the dimension's state using a time delta
     * @param {Number} dt The time delta to update by
     */
    update(dt) {
        const newTime = this.time + dt * this.engine?.opt.world.timeRate;
        const currEv = [];

        this.events.forEach((ev, i) => {
            if (ev === null) return;

            const evtime = ev[1];

            // event scheduled into the past, this shouldn't happen
            // if (evtime < dim.time) return dim.events[i] = null;

            // events scheduled for within the last tick are "current events"
            if (evtime <= newTime) return currEv.push([ev, i]);
        });

        // sort events by time
        currEv.sort((a, b) => a[0][1] - b[0][1]);

        currEv.forEach(en => this.handleEvent(en[1], dt));

        this.time = newTime;

        super.update(dt);
    }
}