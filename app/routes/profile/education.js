import { setupFlaggedRoute } from './../../lib/flag-route';
import OriginalRoute from './old-education';

export default setupFlaggedRoute(OriginalRoute, {
  flagKey: 'education',
  enabledRouteName: 'profile/new-education'
});
