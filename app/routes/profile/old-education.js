import Route from '@ember/routing/route';

export default class OldEducationRoute extends Route {
  model() {
    return {
      message: 'This is the old education page'
    };
  }
}