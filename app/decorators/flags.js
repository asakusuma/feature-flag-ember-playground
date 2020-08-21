import { assert } from '@ember/debug';
import { FeatureFlags } from '../services/flags';

export function routeDecorator(keys) {
  assert('You must provide a list of required flag keys', Array.isArray(keys));
  return Object.freeze(new FeatureFlags(keys));
}
