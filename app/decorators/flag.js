import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

//const EvaluatorToFeatureFlagService = new WeakMap<Evaluator, FeatureFlagService>();

function createEvaluator(service, keys, context) {
  return {
    flagKeys: keys,
    getFlag(key) {
      // console.log(context);
      return service.getFlag(key);
    }
  };
}

export default function routeDecorator(keys) {
  assert('You must provide a list of required flag keys', Array.isArray(keys));
  return computed({
    get() {
      const superRouteEvaluator = this._super();
      const owner = getOwner(this);

      // If the route has a super class, we have to merge the keys
      const routeFlagKeys = !superRouteEvaluator ? keys :
        keys.concat(
          superRouteEvaluator.keys
            .filter((k) => !keys.includes(k))
        );
      const flagsService = owner.lookup('service:flags');
      const router = owner.lookup('service:router');
      console.log(router.currentRoute);
      return createEvaluator(flagsService, routeFlagKeys, this);
    }
  })
}