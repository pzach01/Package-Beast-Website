export const environment = {
  production: true,
  SITE_TITLE: 'Package Beast',
  API_BASE_URI: 'https://api.packagebeast.com',
  stripePublishableKey: 'pk_live_51HB4dCJWFTMXIZUoyhLFMjed7MI8K87X5W7dJzAoJXxENSWGRdHmzRhj02IUox3RxmZHy7RpjlXTnwEXcD6IS6DQ00oomtEUeZ',
  standardSubscription: {
    priceId: 'price_1ICTjaJWFTMXIZUonP0TRYCm',
    productId: 'prod_Io5vXJKuoSljSG',
    price: 10
  },
  premiumSubscription: {
    priceId: 'price_1ICTkBJWFTMXIZUoULj8wGsz',
    productId: 'prod_Io5wQO8TZN0K8V',
    price: 30
  },
  beastModeSubscription: {
    priceId: 'price_1ICTkQJWFTMXIZUoyuuGwYpc',
    productId: 'prod_Io5w0g0GolhS70',
    price: 50
  }
};