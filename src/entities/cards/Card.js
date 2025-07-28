import GameObject from "../../GameObject.js";
import Stat from "../stats/Stat.js";
import StatsManager from "../stats/StatsManager.js";

export default class Card extends GameObject {
    /** Stats manager for this card */
    statsManager = new StatsManager();

    /** Cached stats object for this card */
    stats = this.statsManager.stats;

    /** Stats manager for stats this card applies to the entire deck */
    publicStatsManager = new StatsManager();

    constructor() {
        super();
        this.statsManager.add(new Stat("debug"));
    }
}