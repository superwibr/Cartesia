import Stat from "./Stat.js";

export default class StatModifier extends Stat {
	duration = 0;

	order = 100;

	update(dt) {
		super.update(dt);

		this.duration -= dt;
		if(this.duration < 0) this.duration = 0;
	}
}