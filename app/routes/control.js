import Route from '@ember/routing/route';

export default class ControlRoute extends Route {
  model() {
    return {
      name: 'control'
    };
  }
}
