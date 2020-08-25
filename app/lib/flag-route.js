import Route from '@ember/routing/route';

function generateRouteHandler(owner, key, treatmentRouteName) {
  const treatmentRoute = owner.lookup(`route:${treatmentRouteName}`);
  const flagService = owner.lookup('service:flags');
  return {
    get(target, prop, _receiver) {
      const rawFlag = flagService.getFlag(key);
      const flagIsControl = !rawFlag || rawFlag === 'control';
      if (prop === 'templateName') {
        return flagIsControl ? Reflect.get(target, prop) : treatmentRouteName;
      } else if (prop === 'controller') {
        return Reflect.get(target, prop);
      }
      return Reflect.get(flagIsControl ? target : treatmentRoute, prop);
    },
  };
}

export function setupFlaggedRoute(ControlRouteClass, { flagKey, enabledRouteName }) {
  if (navigator.userAgent.indexOf('MSIE') > -1) {
    return ControlRouteClass;
  }
  return class FlagRoute extends ControlRouteClass {
    constructor(owner) {
      return new Proxy(
        super(...arguments),
        generateRouteHandler(owner, flagKey, enabledRouteName)
      );
    }
  }
}