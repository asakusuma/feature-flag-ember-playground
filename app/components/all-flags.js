import Component from '@glimmer/component';
import { STORE, updateFlag } from '../services/flags';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AllFlagsComponent extends Component {
  @tracked applicationFlag = STORE.get('application');
  @tracked aFlag = STORE.get('a');
  @tracked bFlag = STORE.get('b');
  @action update(key) {
    updateFlag(key);
    this[key + 'Flag'] = STORE.get(key);
    console.log(`STORE[${key}] updated to ${STORE.get(key)}`);
  }
}
