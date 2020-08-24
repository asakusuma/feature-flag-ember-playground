import Component from '@glimmer/component';
import { getFlag, updateFlag, setFlag } from '../services/flags';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AllFlagsComponent extends Component {
  @tracked applicationFlag = getFlag('application');
  @tracked educationFlag = getFlag('education');
  @tracked aFlag = getFlag('a');
  @tracked bFlag = getFlag('b');
  @action update(key) {
    updateFlag(key);
    this[key + 'Flag'] = getFlag(key);
    console.log(`STORE[${key}] updated to ${getFlag(key)}`);
  }
  @action setFlag(key, value) {
    setFlag(key, value);
    this[key + 'Flag'] = getFlag(key);
    console.log(`STORE[${key}] updated to ${getFlag(key)}`);
  }
}
