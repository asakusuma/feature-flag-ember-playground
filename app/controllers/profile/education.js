import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class EducationController extends Controller {
  oldToggle = false

  @action
  oldEducationToggle() {
    this.toggleProperty('oldToggle');
  }
}