import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class GetFlagEvaluatorHelper extends Helper {
  @service flag;
  compute([routeName]) {
    return this.flag.snapshotFromRouteName(routeName);
  }
}
