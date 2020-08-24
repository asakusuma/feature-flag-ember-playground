import { setupFlaggedRoute } from './../../lib/flag-route';

export default setupFlaggedRoute({
  flagKey: 'education',
  controlRouteName: 'profile/old-education',
  treatmentRouteName: 'profile/new-education'
});
