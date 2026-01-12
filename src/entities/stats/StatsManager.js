import GameObject from "../../GameObject.js";
import ModifierFilter from "./ModifierFilter.js";
import Stat from "./Stat.js";
import StatModifier from "./StatModifier.js";

export default class StatsManager extends GameObject {
    /** @type {StatModifier[]} */
    entries = [];

    /** @type {StatModifier[]} */
    filteredEntries = [];

    /** @type {ModifierFilter[]} */
    filters = [];

    /** @type {Object.<String, Stat>} */
    rawStats = {};

    /** @type {Object.<String, Stat>} */
    stats = {};

    /** @type {Object.<String, Number>} */
    simpleStats = {};

    /** Resolves all stat entries into a flat form in the stats object */
    compute() {
        Object.keys(this.rawStats).forEach(name => this.stats[name] = this.rawStats[name].clone());

        this.filteredEntries.sort((a, b) => a.order - b.order);

        this.filteredEntries.forEach(mod => {
            if (!(mod.name in this.rawStats)) this.rawReserve(mod.name);

            mod.applyTo(this.stats[mod.name]);
        });

        Object.values(this.stats).forEach(stat => {
            console.log(stat.toString())
            stat.clamp()
            console.log(stat.toString())
        });

        for(const name in this.simpleStats) delete this.simpleStats[name];
        for(const name in this.stats) this.simpleStats[name] = this.stats[name].value.value;
    }
    rawReserve(name) {
        this.rawStats[name] = new Stat(name);
        this.stats[name] = new Stat(name);
    }
    computeFilters() {
        this.filters.sort((a, b) => a.order - b.order);

        this.filteredEntries.length = 0;
        this.filteredEntries.push(
            ...this.entries
                .map(entry => entry.clone())
                .map(clone => this.applyFilters(clone))
        );
    }

    /**
     * Adds a modifier to the manager
     * @param {...StatModifier} stat The modifiers to manage
     * @returns {Number} The index of the last added modifier in the manager's entries
     */
    add(...mods) {
        const id = this.entries.push(...mods) - 1;
        this.computeFilters();
        this.compute();
        return id;
    }

    /**
     * Removes a modifier from the manager
     * @param {StatModifier|Number} id The modifier or index to remove from the manager
     * @returns The modifier instance that was removed, or null if it couldn't be found
     */
    remove(id) {
        if (typeof id !== "number") id = this.entries.indexOf(id);

        if (id === -1 || !this.entries[id]) return null;

        const rt = this.entries.splice(id, 1)[0];
        this.computeFilters();
        this.compute();
        return rt;
    }

    /**
     * Applies a Stat as an instantaneous, permanent change to rawStats
     * @param  {...Stat} stats 
     */
    instant(...stats) {
        stats
            .map(stat => stat.clone())
            .map(clone => this.applyFilters(clone, true))
            .forEach(mod => {
                if (!(mod.name in this.rawStats)) this.rawReserve(mod.name);

                mod.applyTo(this.rawStats[mod.name]);
            });
    }

    /**
     * Adds a filter to the manager
     * @param {...ModifierFilter} stat The filters to manage
     * @returns {Number} The index of the last added filter in the manager's filter entries
     */
    addFilter(...filters) {
        const id = this.filters.push(...filters) - 1;
        this.computeFilters();
        this.compute();
        return id;
    }

    /**
     * Removes a filter from the manager
     * @param {ModifierFilter|Number} id The modifier or index to remove from the manager
     * @returns The filter instance that was removed, or null if it couldn't be found
     */
    removeFilter(id) {
        if (typeof id !== "number") id = this.filters.indexOf(id);

        if (id === -1 || !this.filters[id]) return null;

        const rt = this.filters.splice(id, 1)[0];
        this.computeFilters();
        this.compute();
        return rt;
    }

    applyFilters(stat, isInstant = false) {
        this.filters
            .filter(filter => filter.name === stat.name)
            .forEach(filter => filter.applyTo(stat, isInstant));

        return stat;
    }


    update(dt) {
        super.update(dt);

        this.entries.forEach(mod => mod.update(dt));

        this.entries.forEach((mod, i) => {
            if (mod.duration <= 0) this.remove(i);
        });
    }
}