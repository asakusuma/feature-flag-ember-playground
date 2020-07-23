import Service from '@ember/service';

export default Service.extend({
  state: {
    a: true,
    b: false,
    c: false
  },
  getFlag(key) {
    return this.state[key];
  }
});