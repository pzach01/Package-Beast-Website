// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SITE_TITLE: 'Package Beast Development Yo!',
  API_BASE_URI: 'https://developmentapi.packagebeast.com',
  standardSubscription: {
    priceId: 'price_1I76eoE5mpXPYa9nlFHK60Ge',
    productId: 'prod_IiXkLvo2tLRuCi',
    price: 10
  },
  premiumSubscription: {
    priceId: 'price_1I76fUE5mpXPYa9ncmIy6tbY',
    productId: 'prod_IiXkKw7qe4Dt7l',
    price: 30
  },
  beastModeSubscription: {
    priceId: 'price_1I76gPE5mpXPYa9nzbdm3s9f',
    productId: 'prod_IiXlcdTHpmbQHR',
    price: 50
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
