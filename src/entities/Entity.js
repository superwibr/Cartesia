import GameObject from "../GameObject.js";
import { WORLDOPTIONS } from "../options.js";
import { lerp } from "../utils.js";
import StatsManager from "./stats/StatsManager.js";

export default class Entity extends GameObject {
    type = "entity";

    /** Diameter of the entity */
    size = WORLDOPTIONS.tileScale;

    /** The entity's X position */
    x = 0;
    /** The entity's Y position */
    y = 0;

    /** The entity's X position when velocity last changed, used in interpolation */
    ox = this.x;
    /** The entity's Y position when velocity last changed, used in interpolation */
    oy = this.y;

    /** X velocity, in units per second */
    vx = 0;
    /** Y velocity, in units per second */
    vy = 0;

    /** Storage of the entity's last X velocity for comparison */
    ovx = this.vx;
    /** Storage of the entity's last Y velocity for comparison */
    ovy = this.vy;

    /** Time this entity will be removed after, in physics-simulated milliseconds */
    life = 1000;

    /** Storage of the entity's last life value for interpolation */
    ol = this.life;

    /** Predicted X position when life = 0 at current velocity, used in interpolation */
    lx = this.x + this.vx * WORLDOPTIONS.velocityScale * this.life;
    /** Predicted Y position when life = 0 at current velocity, used in interpolation */
    ly = this.y + this.vy * WORLDOPTIONS.velocityScale * this.life;

    /** Stats manager for this entity */
    statsManager = new StatsManager();

    /** Cached stats object for this entity */
    stats = this.statsManager.stats;

    /** @type {Set<String>} */
    tags = new Set();

    /** @type {Dimension} The dimension this entity is in. Null when not in a dimension. */
    dim = null;

    /** Runs after this entity is added to a dimension */
    onadd() {
        this.physInit();
        this.tags.add("physics");
        this.step();
    }

    /** Runs before this entity is removed from a dimension */
    onremove() { }

    physInit() {
        this.ox = this.x;
        this.oy = this.y;

        this.ovx = this.vx;
        this.ovy = this.vy;

        this.ol = this.life;

        this.lx = this.x + this.vx * this.life * WORLDOPTIONS.velocityScale;
        this.ly = this.y + this.vy * this.life * WORLDOPTIONS.velocityScale;
    }

    step(dt = 0) {
        if (this.dim === null) return;

        if (this.vx !== this.ovx || this.vy !== this.ovy) this.physInit();

        if (this.vx === 0 && this.vy === 0) {
            this.tags.delete("physics");
            return;
        }

        const dim = this.dim;

        if (this.life <= 0) {
            this.tags.delete("physics");
            dim.events.push(["remove", dim.time, this.id]);
            return;
        }

        if (dt !== 0) {
            this.life -= dt;

            if (this.life <= 0) this.life = 0;

            if (this.life < Infinity) {
                this.x = lerp(this.ox, this.lx, (this.ol - this.life) / this.ol);
                this.y = lerp(this.oy, this.ly, (this.ol - this.life) / this.ol);
            } else {
                this.x += this.vx * dt * WORLDOPTIONS.velocityScale;
                this.y += this.vy * dt * WORLDOPTIONS.velocityScale;
            }
        };
    }

    update(dt){
        if(this.tags.has("physics")) this.step(dt);

        super.update(dt);
    }

    constructor() {
        super();

        this.child(this.statsManager);
    }
}