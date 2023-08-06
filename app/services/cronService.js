var cron = require("node-cron");
var cronParser = require("cron-parser");

class CronService {
	constructor(opts) {
		this.cronExpression = opts.cronExpression;
		this.func = opts.func;
		this.options = opts?.options;
		this.isRunning = false;
	}
	getNext() {
		const interval = cronParser.parseExpression(this.cronExpression);
		const date = interval.next().toDate();
		return date;
	}
	getPrev() {
		const interval = cronParser.parseExpression(this.cronExpression);
		const date = interval.prev().toDate();
		return date;
	}
	start() {
		this.isRunning = true;
		this.task?.start();
	}
	stop() {
		this.isRunning = false;
		this.task?.stop();
	}
	reloadCron() {
		this.task?.stop();
		this.task = cron.schedule(
			this.cronExpression,
			() => {
				this.func();
			},
			this.options
		);
	}
}
const cronService = new CronService({
	cronExpression: "* * * * *",
	func: () => {
		console.log("hello");
	},
});
module.exports = {
	cronService,
};
