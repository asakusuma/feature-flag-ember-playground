import { helper } from '@ember/component/helper';

export default helper(function evaluateFlag([snapshot, key] /*, hash*/) {
  notifyEvaluation({ key, value: snapshot[key] });
  return snapshot[key];
});

function notifyEvaluation({ key, value }) {
  // sendBeacon('/feature-falg-analytics')
  console.log(`${key} evaled as ${value}`);
}
