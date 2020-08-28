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
    this.ROUTE_FLAGS_MAP = new Map([
      [
        FLAGS,
        new Map([
          [TOP_LEVEL_FLAGS, new Map()],
          [INHERIT_FLAGS, new Map()],
        ]),
      ],
    ]);
  },
  getFlag(key) {
    return STORE.get(key);
  },
  getFlagIsEnabled(key) {
    return getFlagIsEnabled(key);
  },
  _processFlagsStuffForRouteInfos({ from, to }) {
    const getFlagsFromName = (routeName) => {
      const privateRouter = this.router._router._routerMicrolib;
      return privateRouter.getRoute(routeName).flags;
    };
    // application -> profile -> connections
    const toList = createList(to);
    initFlagsMapForRouteHierarchy(this.ROUTE_FLAGS_MAP, getFlagsFromName, toList);
    // update flags for routes that are below pivot
    const fromList = createList(from);
    const { pivot } = diffRoutes({ fromList, toList });
    for (let i = pivot; i < toList.length; i++) {
      const flags = getFlagsFromName(toList[i].name);
      if (!flags) continue;
      const ptr = FLAGS_TO_MAP.get(flags);
      for (const v of ptr.get(FLAGS).get(TOP_LEVEL_FLAGS).values()) {
        v.update();
      }
    }
  },
});

function initFlagsMapForRouteHierarchy(routeFlagsMap, getFlagsFromName, toList) {
  // init flags map for each route hierarchy
  let ptr = routeFlagsMap;
  for (const { name, localName } of toList) {
    if (!ptr.has(localName)) {
      ptr.set(localName, new Map([[PARENT, ptr]]));
    }
    ptr = ptr.get(localName);
    // TODO: figure out if we can use buildRouteInfoMetadata
    const flags = getFlagsFromName(name);
    // flags.keys: ['a', 'b']
    if (flags && !ptr.has(FLAGS)) {
      const parentFlagsMap = ptr.get(PARENT).get(FLAGS);
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
      ptr.set(FLAGS, flagsMapForThisLevel);
      FLAGS_TO_MAP.set(flags, ptr);
    }
  }
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

const STORE = new Map(
  Object.entries(
    JSON.parse(
      decodeURI(document.querySelector('meta[name=feature-flags]').content)
    )
  )
);

export function getFlag(key) {
  return STORE.get(key) || 'control';
}

export function getFlagIsEnabled(key) {
  return getFlag(key) !== 'control';
}

export function updateFlag(key) {
  const newValue = STORE.get(key) + 1;
  STORE.set(key, newValue);
}

export function setFlag(key, value) {
  STORE.set(key, value);
}

const PARENT = '.parent';
const FLAGS = '.flags';
const TOP_LEVEL_FLAGS = '.TOP_LEVEL_FLAGS';
const INHERIT_FLAGS = '.INHERIT_FLAGS';

const FLAGS_TO_MAP = new WeakMap();

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
    const flagsMap = FLAGS_TO_MAP.get(this).get(FLAGS);
    return flagsMap.get(TOP_LEVEL_FLAGS).has(key)
      ? flagsMap.get(TOP_LEVEL_FLAGS).get(key).value
      : flagsMap.get(INHERIT_FLAGS).get(key).value;
  }
}

// Utils
function notifyEvaluation(key) {
  // sendBeacon('/feature-falg-analytics')
  console.log(`Flag "${key}" evaled`);
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

function diffRoutes({ fromList, toList }) {
  for (let i = 0; i < toList.length; i++) {
    const toSegment = toList[i];
    const fromSegment = fromList[i];
    if (!toSegment || !fromSegment) {
      return { pivot: i };
    }
    const { name: toName, params: toParams } = toList[i];
    const { name: fromName, params: fromParams } = fromList[i];
    if (toName !== fromName || !objectsMatch(toParams, fromParams))
      return { pivot: i };
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
