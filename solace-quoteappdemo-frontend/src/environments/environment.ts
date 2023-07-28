// This file can be replaced during build by using the `fileReplacements` array.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  solace: {
    host: 'wss://mr-connection-iipj85w4xps.messaging.solace.cloud:443',
    vpn: 'hari-solace-aws-wrkshp',
    clientUserName: 'solace-cloud-client',
    clientPassword: 'vhhljhvct1vj5vbh8g6ir2kqqq'
  },
  restBackend: {
    uri: 'http://localhost:8081/api/general/listStocks'
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
