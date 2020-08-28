import Route from '@ember/routing/route';
import { routeDecorator } from './../../decorators/flags';

// TODO figure out ES6 syntax
export default Route.extend({
  flags: routeDecorator(['a', 'b']),
  model() {
    return {
      a_flag: this.flags.getEvaluation('a'),
      b_flag: this.flags.getEvaluation('b')
    };
  }
});
