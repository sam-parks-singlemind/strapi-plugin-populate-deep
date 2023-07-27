
'use strict';
const { getFullPopulateObject } = require('./helpers')

module.exports = ({ strapi }) => {
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'beforeFindMany' || event.action === 'beforeFindOne') {
      const populate = event.params?.populate;
      const defaultDepth = strapi.plugin('strapi-plugin-populate-deep')?.config('defaultDepth') || 5

      if (populate && populate[0] === 'deep') {
        const depth = populate[1] ?? defaultDepth

        let ignore = []
        if (populate[2] && populate[2] === 'ignore') {
          ignore = populate.slice(3)
        }

        const modelObject = getFullPopulateObject(event.model.uid, depth, ignore);
        event.params.populate = modelObject.populate
      }
    }
  });
};
