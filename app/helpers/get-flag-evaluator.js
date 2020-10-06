import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class GetFlagEvaluatorHelper extends Helper {
  @service flag;
  compute([routeName]) {
    const snapshot = this.flag.snapshotFromRouteName(routeName);
    return snapshot;
  }
}
