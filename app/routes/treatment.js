import Route from '@ember/routing/route';

export default class TreatmentRoute extends Route {
  model() {
    return {
      name: 'treatment'
    };
  }
}
