import Route from '@ember/routing/route';

export default class ProfileIndexRoute extends Route {
  model(args, swag, foo) {
    console.log('model() profile.index')
    return {};
  }
}
