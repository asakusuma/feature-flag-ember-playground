import { assert } from '@ember/debug';
import { FlagEvaluator } from '../services/flag';

export function flag(keys) {
  assert('You must provide a list of required flag keys', Array.isArray(keys));
  return Object.freeze(new FlagEvaluator(keys));
}
