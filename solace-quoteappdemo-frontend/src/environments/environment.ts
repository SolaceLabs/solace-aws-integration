// This file can be replaced during build by using the `fileReplacements` array.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  solace: {
    host: 'wss://mr-connection-nnbri3jwreh.messaging.solace.cloud:443',
    vpn: 'solace-aws-int-eu',
    clientUserName: 'solace-cloud-client',
    clientPassword: '3a64jebvl11vd3cc9q6t6nsv6p'
  },
  restBackend: {
    uri: 'http://35.176.0.86:8080/api/general/listStocks'
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
