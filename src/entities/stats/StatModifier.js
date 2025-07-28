import Stat from "./Stat.js";

export default class StatModifier extends Stat {
	duration = 0;

	order = 100;

	update(dt) {
		super.update(dt);

		duration -= dt;
		if(duration < 0) duration = 0;
	}
}