import Route from '@ember/routing/route';
import { routeDecorator } from './../decorators/flags';

export default class ApplicationRoute extends Route {
  flags = routeDecorator(['application']);
  model() {
    return {
      flag: this.flags.getEvaluation('application'),
    };
  }
}
