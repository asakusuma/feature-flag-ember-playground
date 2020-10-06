import { helper } from '@ember/component/helper';

export default helper(function evaluateFlag([snapshot, key] /*, hash*/) {
  return snapshot[key];
});

