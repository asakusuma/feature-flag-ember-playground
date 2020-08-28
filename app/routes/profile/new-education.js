import Route from '@ember/routing/route';

export default class NewEducationRoute extends Route {
  model() {
    return {
      name: 'This is the new education page'
    };
  }
}