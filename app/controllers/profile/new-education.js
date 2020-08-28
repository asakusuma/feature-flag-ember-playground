import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class NewEducationController extends Controller {
  newToggle = false

  @action
  newEducationToggle() {
    this.toggleProperty('newToggle');
  }
}