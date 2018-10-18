import CommandBase from 'bot/cmds/commandBase';
import { schedules } from 'bot/schedules/rules';
import { scheduledJobs } from 'node-schedule';
import Bot from 'shared/types/bot';

class DebugCommand extends CommandBase {
  constructor(bot: Bot) {
    super(bot);

    this.name = 'debug';
    this.helpText = 'Helps debugging';
    this.helpArgs = '[schedule [run <name>]]';
    this.visible = false;
  }

  listen(): void {
    this.onText(/^\/debug/i, async (msg, args, argCount) => {
      if (/^schedules?$/.test(args[0])) {
        if (argCount === 1 || (argCount === 2 && args[1].toLowerCase() === 'list')) {
          const names = schedules.map(s => s.name);
          return this.reply(msg, [
            `*List of schedules:*`,
            ...names,
          ]);
        }

        if (args[1] === 'run' && argCount === 3) {
          const schedule = scheduledJobs[args[2]];
          console.log(scheduledJobs, args[2]);
          if (!schedule) {
            this.reply(msg, 'Schedule not found.');
            return;
          }

          this.reply(msg, `\`Running "${schedule.name}" schedule.\``);
          return schedule.invoke();
        }
      }

      this.reply(msg, 'U dun goofed');
    });
  }
}

export default DebugCommand;
