var cron = require('node-cron');
const cronParser = require('cron-parser');

class CronService{
    constructor(opts){
        this.cronExpression = opts.cronExpression;
        this.func = opts.func
        this.options = opts?.options
    }
    getNext(){
      const interval = cronParser.parseExpression(this.cronExpression);
      const date = interval.next().toDate();
      return date;
    }
    getPrev(){
      const interval = cronParser.parseExpression(this.cronExpression);
      const date = interval.prev().toDate();
      return date;
    }
    start(){
      task.start()
    }
    stop(){
      task.stop()
    }
}
const cronService = new CronService({
  cronExpression: '0 1 * * *',
})
var task = cron.schedule(cronService.cronExpression, () => {
  cronService.func()
});
task.start()

module.exports = {
  cronService
}
