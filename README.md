# feature-flag-ember-playground

This is POC application for demonstrating techniques for implmenting feature flags in an Ember app.

## Guarding an entire route with a feature flag

When re-writing an entire page, we may want to use a feature flag to guard a separate route class and template combination.

### `setupFlaggedRoute()`

This function returns a "proxy" Route class that will proxy to the right route depending on the given feature flag value.

The function takes two arguments, the default "control" route class, and then an object with two properties: `flagKey` and `enabledRouteName`. If the flag is off, or if the browser is Internet Explorer, the control class is used. Otherwise, if the flag is on, the enabled route is used.

```JavaScript
class ControlClass extends Route {}

export default setupFlaggedRoute(ControlClass, {
  flagKey: 'my.flag.name',
  enabledRouteName: 'myfeature/new-route'
});
```

The given invocation assumes that `app/routes/myfeature/new-route.js` and `app/templates/myfeature/new-route.hbs` both exist.

### TODOO
  * Figure out how controllers will work