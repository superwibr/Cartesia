import GameObject from "../../GameObject.js";

export default class Deck extends GameObject {
    /** Stats manager for this deck */
    statsManager = new StatsManager();

    /** Cached stats object for this deck */
    stats = this.statsManager.stats;
}