import Entity from "./Entity.js";

export default class TileEntity extends Entity {
    type = "tile";
    life = Infinity;

    onadd(){
        super.onadd();

        this.dim.events.push([
            "mark",
            this.dim.time,
            this.dim.worldToTile2d(this.x, this.y).join(","),
            this
        ]);
    }

    onremove(){
        super.onadd();

        this.dim.events.push([
            "mark",
            this.dim.time,
            this.dim.worldToTile2d(this.x, this.y).join(","),
            null
        ]);
    }

    /**
     * 
     * @param {{x: Number, y: Number}} position The position to slide to, in world coordinates.
     *                                          Must be a valid adjacent tile center. 
     * @param {Number} delay The time the slide should take
     * @returns 
     */
    slide({ x, y }, delay = 1000) {
        if (!this.dim) return;

        const dim = this.dim;
        const deltaX = x - this.x;
        const deltaY = y - this.y;
        const startTime = dim.time;
        const endTime = dim.time + delay;
        const startX = this.x;
        const startY = this.y;

        // Check if destination is an adjacent tile
        const isAdjX = Math.abs(deltaX) === this.engine?.opt.world.tileScale && deltaY === 0;
        const isAdjY = Math.abs(deltaY) === this.engine?.opt.world.tileScale && deltaX === 0;
        const isDiag = Math.abs(deltaX) === this.engine?.opt.world.tileScale && Math.abs(deltaY) === this.engine?.opt.world.tileScale;
        if (!(isAdjX || isAdjY || isDiag)) {
            console.log("Invalid slide destination");
            return;
        }

        // Determine tiles to mark at start
        const tilesToMark = [];
        if (isDiag) {
            // Mark current tile's neighbors and destination
            tilesToMark.push(
                `${this.x + deltaX},${this.y}`,
                `${this.x},${this.y + deltaY}`,
                `${x},${y}`
            );
        } else {
            // Mark destination tile
            tilesToMark.push(`${x},${y}`);
        }

        // Check if any target tiles are occupied
        for (const key of tilesToMark) {
            if (dim.tiles[key] && dim.tiles[key] !== this) {
                console.log("Cannot slide: tile occupied");
                return;
            }
        }

        // Mark the necessary tiles
        if (tilesToMark.length > 0) dim.events.push(["mark", startTime, ...tilesToMark, this]);

        // slide movement
        this.vx = deltaX / delay * 1000;
        this.vy = deltaY / delay * 1000;
        this.tags.add("physics");
        dim.events.push(["move", endTime, this, x, y]);

        // Determine tiles to unmark at end
        const unmarkTiles = [];
        if (isDiag) {
            unmarkTiles.push(
                `${startX},${startY}`,
                `${startX + deltaX},${startY}`,
                `${startX},${startY + deltaY}`
            );
        } else {
            unmarkTiles.push(`${startX},${startY}`);
        }
        dim.events.push(
            ["mark", endTime, ...unmarkTiles, null],
            ["callback", endTime, () => {
                this.vx = 0;
                this.vy = 0;
            }]
        );
    }
}