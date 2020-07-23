import Route from '@ember/routing/route';
import flagDecorator from './../../decorators/flag';

// TODO figure out ES6 syntax
export default Route.extend({
  flag: flagDecorator(['a', 'b']),
  model() {
    console.log('model connections');
    const b_flag = this.flag.getFlag('b');
    return {
      a_flag: this.flag.getFlag('a'),
      b_flag
    };
  }
});
