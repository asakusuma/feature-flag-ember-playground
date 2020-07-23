import Route from '@ember/routing/route';
import flagDecorator from './../decorators/flag';

export default Route.extend({
  flag: flagDecorator(['a']),
  model({ profile_id }) {
    console.log('model profile');
    return {
      profile_id,
      a_flag: this.flag.getFlag('a')
    };
  }
});
