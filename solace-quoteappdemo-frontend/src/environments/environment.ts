// This file can be replaced during build by using the `fileReplacements` array.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  solace: {
    host: 'SOLACE_BROKER_HOST_URL',
    vpn: 'SOLACE_VPN_NAME',
    clientUserName: 'SOLACE_BROKER_USERNAME',
    clientPassword: 'SOLACE_BROKER_PASSWORD'
  },
  restBackend: {
    uri: 'http://EC2_INSTANCE_PUBLIC_IP:8081/api/general/listStocks'
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
