const ROUTE_LIX_ENABLED_KEY = '__route_lix_is_enabled';

function generateRouteHandler(owner, key, treatmentRouteName) {
  const treatmentRoute = owner.lookup(`route:${treatmentRouteName}`);
  const flagService = owner.lookup('service:flags');
  return {
    set(target, prop, value) {
      const flagIsControl = !Reflect.get(target, ROUTE_LIX_ENABLED_KEY);
      if (prop === 'controller') {
        // Set the other controller too, because _internalReset assumes controller is set once route is setup
        if (flagIsControl) {
          Reflect.set(treatmentRoute, prop, owner.lookup(`controller:${treatmentRouteName}`));
        } else {
          Reflect.set(target, prop, owner.lookup(`controller:${Reflect.get(target, 'routeName')}`));
        }
      }
      return Reflect.set(flagIsControl ? target : treatmentRoute, prop, value);
    },
    get(target, prop, _receiver) {
      if (prop === 'beforeModel') {
        const isEnabled = flagService.getFlagIsEnabled(key);
        Reflect.set(target, ROUTE_LIX_ENABLED_KEY, isEnabled);
      }
      const flagIsControl = !Reflect.get(target, ROUTE_LIX_ENABLED_KEY);
      if (prop === 'routeName') {
        return flagIsControl ? Reflect.get(target, prop) : treatmentRouteName;
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