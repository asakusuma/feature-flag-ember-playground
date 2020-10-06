import Route from '@ember/routing/route';
import { flag } from '../decorators/flag';

export default class ApplicationRoute extends Route {
  flags = flag(['application']);
  async model() {
    console.log('model() application');
    return {
      flags: await this.flags.snapshot(),
    };
  }
}
