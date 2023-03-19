# Divemate Viewer

## About the App
This WebApp connects to Google Drive and reads your DiveMate dive log and displays your dives (read only).

All the magic happens in your browser, there is no backend service:
* The DiveMate file (DiveMate/DiveMate.ddb) is load directly by your browser, gets cached in your browser and is processed in your browser.
* Authentication using OAuth 2.

This application reads the backed up divelog from the mobile phone app [DiveMate](https://www.divemate.de/). You need to create & upload a backup to Google Drive first (in the DiveMate format). This requires the _"Data Extension Pack"_ from DiveMate.

## Technology
* This an [Angular](https://angular.io/) + [Angular Material](https://material.angular.io/) application.
* The DiveMate backup is a [SQLite](https://sqlite.org/) database file processed in the browser by [sql.js](https://github.com/sql-js/sql.js/).
* To connect to Google Drive OAuth 2 is uesed provided by [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) (_code flow_).
* The SQLite divelog database file is cached in the browser's IndexedDB.

## Dev Guide
* run local: `npm run serve`
* deploy to firebase
  * 1st, build: `npm run build`
  * 2dn, deploy: `firebase deploy`
  * 3rd, verify: go to https://divemate-viewer-314318.web.app

