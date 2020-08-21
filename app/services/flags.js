import Service, { inject as service } from '@ember/service';
import { assert } from '@ember/debug';

export default Service.extend({
  router: service('router'),
  init() {
    this._super(...arguments);
    // TODO: need to wait promise to work with lazy engines
    this.router.on('routeWillChange', ({ from, to }) => {
      this._processFlagsStuffForRouteInfos({ from, to });
    });
  },
  _processFlagsStuffForRouteInfos({ from, to }) {
    // application -> profile -> connections
    const toList = createList(to);
    const privateRouter = this.router._router._routerMicrolib;
    // init flags map for each route hierarchy
    let ptr = ROUTE_FLAGS_MAP;
    for (const { name, localName } of toList) {
      if (!ptr.has(localName)) {
        ptr.set(localName, new Map([[SPECIAL_PARENT_KEY, ptr]]));
      }
      ptr = ptr.get(localName);
      const { flags } = privateRouter.getRoute(name);
      if (!flags) continue;
      // flags.keys: ['a', 'b']
      if (!ptr.has(SPECIAL_FLAGS_KEY)) {
        const parentFlagsMap = ptr
          .get(SPECIAL_PARENT_KEY)
          .get(SPECIAL_FLAGS_KEY);
        const topLevelFlagsEntries = flags.keys
          .filter(
            (f) =>
              !parentFlagsMap.get(TOP_LEVEL_FLAGS).has(f) &&
              !parentFlagsMap.get(INHERIT_FLAGS).has(f)
          )
          .map((f) => [f, new FlagRef(f)]);
        const inheritFlagsEntries = Array.from(
          parentFlagsMap.get(INHERIT_FLAGS).entries()
        ).concat(Array.from(parentFlagsMap.get(TOP_LEVEL_FLAGS).entries()));
        const flagsMapForThisLevel = new Map([
          [TOP_LEVEL_FLAGS, new Map(topLevelFlagsEntries)],
          [INHERIT_FLAGS, new Map(inheritFlagsEntries)],
        ]);
        ptr.set(SPECIAL_FLAGS_KEY, flagsMapForThisLevel);
        FLAGS_TO_MAP.set(flags, ptr);
      }
    }
    // update flags for routes that are below pivot
    const fromList = createList(from);
    const { pivot } = diffRoutes({ fromList, toList });
    for (let i = pivot; i < toList.length; i++) {
      const { flags } = privateRouter.getRoute(toList[i].name);
      if (!flags) continue;
      const ptr = FLAGS_TO_MAP.get(flags);
      for (const v of ptr
        .get(SPECIAL_FLAGS_KEY)
        .get(TOP_LEVEL_FLAGS)
        .values()) {
        v.update();
      }
    }
  },
});

function diffRoutes({ fromList, toList }) {
  for (let i = 0; i < toList.length; i++) {
    const toSegment = toList[i];
    const fromSegment = fromList[i];
    if (!toSegment || !fromSegment) {
      return { pivot: i };
    }
    const { name: toName, params: toParams } = toList[i];
    const { name: fromName, params: fromParams } = fromList[i];
    if (toName !== fromName || !objectsMatch(toParams, fromParams)) return { pivot: i };
  }
  return { pivot: toList.length };
}

function objectsMatch(obj1, obj2) {
  if (obj1 === undefined && obj2 === undefined) {
    return true;
  }

  if (
    (obj1 !== undefined && obj2 === undefined) ||
    (obj1 === undefined && obj2 !== undefined)
  ) {
    return false;
  }

  let fromKeys = Object.keys(obj1);
  let toKeys = Object.keys(obj2);

  if (fromKeys.length === toKeys.length) {
    for (let i = 0; i < fromKeys.length; i++) {
      let fromKey = fromKeys[i];
      if (toKeys.indexOf(fromKey) === -1) {
        return false;
      }

      if (obj1[fromKey] !== obj2[fromKey]) {
        return false;
      }
    }

    return true;
  }

  return false;
}

class FlagRef {
  constructor(key) {
    this._key = key;
    this._cache = STORE.get(key);
  }
  get value() {
    return this._cache;
  }
  update() {
    this._cache = STORE.get(this._key);
  }
}

export const STORE = new Map(
  Object.entries(
    JSON.parse(
      decodeURI(document.querySelector('meta[name=feature-flags]').content)
    )
  )
);

export function updateFlag(key) {
  const newValue = STORE.get(key) + 1;
  STORE.set(key, newValue);
}

const SPECIAL_PARENT_KEY = '.parent';
const SPECIAL_FLAGS_KEY = '.flags';
const TOP_LEVEL_FLAGS = '.TOP_LEVEL_FLAGS';
const INHERIT_FLAGS = '.INHERIT_FLAGS';

// TODO: maybe a better abstraction
// mem leak?
const ROUTE_FLAGS_MAP = new Map([
  [
    SPECIAL_FLAGS_KEY,
    new Map([
      [TOP_LEVEL_FLAGS, new Map()],
      [INHERIT_FLAGS, new Map()],
    ]),
  ],
]);
const FLAGS_TO_MAP = new Map();

// TODO: make evaluation tracked?
export class FeatureFlags {
  constructor(keys) {
    this.keys = keys;
  }
  getEvaluation(key) {
    assert(
      `Accessing a ${key} that is not declared. (declared: ${this.keys})`,
      this.keys.includes(key)
    );
    notifyEvaluation(key);
    const flagsMap = FLAGS_TO_MAP.get(this).get(SPECIAL_FLAGS_KEY);
    return flagsMap.get(TOP_LEVEL_FLAGS).has(key)
      ? flagsMap.get(TOP_LEVEL_FLAGS).get(key).value
      : flagsMap.get(INHERIT_FLAGS).get(key).value;
  }
}

// Utils

function notifyEvaluation(key) {
  // sendBeacon('/feature-falg-analytics')
  console.log(`${key} evaled`);
}

function createList(routeInfo) {
  const ret = [];
  if (routeInfo === null) {
    return ret;
  }

  routeInfo.find((item) => {
    ret.push(item);
    return false;
  });
  return ret;
}
