# feature-flag-ember-playground

This is POC application for demonstrating techniques for implmenting feature flags in an Ember app.

## Guarding an entire route with a feature flag

When re-writing an entire page, we may want to use a feature flag to guard a separate route class and template combination.

### `setupFlaggedRoute()`

This function returns a "proxy" Route class that will proxy to the right route depending on the given feature flag value.

The function takes a single argument with three properties:

```JavaScript
export default setupFlaggedRoute({
  flagKey: 'my.flag.name',
  controlRouteName: 'myfeature/control-route',
  treatmentRouteName: 'myfeature/treatment-route'
});
```

The given invocation assumes that `app/routes/myfeature/control-route.js`, `app/routes/myfeature/treatment-route.js`, `app/templates/myfeature/control-route.hbs`, and `app/templates/myfeature/treatment-route.hbs` all exist.

### TODOO
  * Figure out how controllers will work