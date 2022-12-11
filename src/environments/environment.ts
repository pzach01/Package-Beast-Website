// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SITE_TITLE: 'Package Beast Development Yo!',
  API_BASE_URI: 'https://developmentapi.packagebeast.com',
  CLIENT_BASE_URI: 'https://development.packagebeast.com',
  stripePublishableKey: 'pk_test_51I76dqE5mpXPYa9nEGmBuvigp0Vjs8LFIUkwEk2cnFEFPVHvqmH6nXJ6RA8SrjBjKRu7K7c0jZC23LdP01p5SzpF00XAVLBhGF',
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
  },
  GOOGLE_CLIENT_ID_URI: '1085639833940-6jfq4dqakf02kmoblamqmhljts2vsirf.apps.googleusercontent.com',
  SHIPPO_CLIENT_ID: 'bf2c8e4685b44c3dbf35b8aa3cb2df5e'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
