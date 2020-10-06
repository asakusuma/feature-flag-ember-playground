import Route from '@ember/routing/route';
import { flag } from '../decorators/flag';

export default Route.extend({
  flags: flag(['a']),
  async model({ profile_id }) {
    console.log('model() profile');
    return {
      profile_id,
      flags: await this.flags.snapshot(),
    };
  },
});
