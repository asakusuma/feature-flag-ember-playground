import Route from '@ember/routing/route';
import { routeDecorator } from './../decorators/flags';

export default Route.extend({
  flags: routeDecorator(['a']),
  model({ profile_id }) {
    console.log('model() profile');
    return {
      profile_id,
      a_flag: this.flags.getEvaluation('a'),
    };
  },
});
