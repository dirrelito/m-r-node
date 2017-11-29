# Intro
This is a clone of the M-R library that is the standard CQRS implementation, by Greg Young.

## Inspiration 

- https://www.infoq.com/articles/rest-api-on-cqrs/
- http://m-r.azurewebsites.net/index.html#/
- https://github.com/aliostad/m-r

## Information

The repo holds three main folders.

- **SimpleCQRS**. Library code. Does the CQRS logic of the backend.
- **CQRSServer**. Web server supplying a REST'ish interface. Node express.
- **CQRSGui**. Front end served by separate web servr.

# Instructions

1. Run `npm install`
2. Run `ng serve` to start the front end server.
3. Open a new console and run `npm run watch` to start the back end API server.
4. Navigate to `localhost:4200`.


