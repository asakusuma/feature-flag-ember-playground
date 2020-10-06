import Route from '@ember/routing/route';
import { flag } from '../../decorators/flag';

// TODO figure out ES6 syntax
export default Route.extend({
  flags: flag(['a', 'b']),
  async model() {
    console.log('model() profile.connections');
    return {
      flags: await this.flags.snapshot()
    };
  }
});
