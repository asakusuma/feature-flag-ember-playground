import Route from '@ember/routing/route';

function generateRouteHandler(owner, key, controlRouteName, treatmentRouteName) {
  const controlRoute = owner.lookup(`route:${controlRouteName}`);
  const treatmentRoute = owner.lookup(`route:${treatmentRouteName}`);
  const flagService = owner.lookup('service:flags');
  return {
    get(target, prop, _receiver) {
      const rawFlag = flagService.getFlag(key);
      const flagIsControl = !rawFlag || rawFlag === 'control';
      if (prop === 'templateName') {
        return flagIsControl ? controlRouteName : treatmentRouteName;
      } else if (prop === 'controller') {
        return Reflect.get(target, prop);
      }
      return Reflect.get(flagIsControl ? controlRoute : treatmentRoute, prop);
    },
  };
}

export function setupFlaggedRoute({flagKey, controlRouteName, treatmentRouteName}) {
  return class FlagRoute extends Route {
    constructor(owner) {
      return new Proxy(
        super(...arguments),
        generateRouteHandler(owner, flagKey, controlRouteName, treatmentRouteName)
      );
    }
  }
}