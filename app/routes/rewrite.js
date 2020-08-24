import Route from '@ember/routing/route';

function generateRouteHandler(controlRoute, treatmentRoute) {
  return {
    get(_target, prop, _receiver) {
      console.log('prop', prop);
      return controlRoute[prop];
    },
  };
}

function setupFlaggedRoute(key, controlRouteName, treatmentRouteName) {
  return class RewriteRoute extends Route {
    constructor(owner) {
      const control = owner.lookup(`route:${controlRouteName}`);
      const treatment = owner.lookup(`route:${treatmentRouteName}`);
      return new Proxy(super(...arguments), generateRouteHandler(control, treatment));
    }
  }
}

export default setupFlaggedRoute('myFlag', 'control', 'treatment');
