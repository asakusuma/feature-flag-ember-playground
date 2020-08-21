export function initialize(application) {
  application.inject(
    'route:application',
    '__feature-flags-event',
    'service:flags'
  );
}

export default {
  initialize
};
