# Angular IDVerse Face Scan Example

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

# Getting Started

### `env variables`

Create a `.env.local` file at the root of this project

With the following content (use your data in the placeholders)

```bash
NG_APP_PUBLIC_SDK_SESSION_URL=https://........
NG_APP_PUBLIC_SDK_SESSION_TOKEN=idv_..........
NG_APP_PUBLIC_SDK_SESSION_BUILD_ID=build_.....
```

### `SDK UI dependency`

Dont forget to place `idverse-sdk-browser` as per `package.json` indicates

### Install dependencies

```bash
 npm i
```

### Copy assets

The zip you received contains some assets that needs to be hosted by your app or by any mechanism you prefer.

The whole folder from `idverse-sdk-browser/ui/dist/idverse-sdk-browser-ui/assets` needs to be copied.

i.e in this project we can place it inside the `public` directory which it is statically served and become publicly accessible at the root URL.

i.e Let's place it nested in a folder called `sdk-idverse` (you can choose any name or even not add a nested folder, but might be advisable in order to avoid conflicts with your own assets)

This will look like
public/sdk-idverse/assets/

```
face-scan/
├── public/
│   ├── sdk-idverse/
|   |   ├── assets
│   |   |   ├── images
|   |   |   ...
|   |   |   ├── IDVerseSDK.worker.min.XXXXX.js

```

### Setting `resourcesUrl`

In the file `src/main.ts` there is a method being called which name is `defineCustomElements`.

We need to set the value for `resourcesUrl` (see second argument which `defineCustomElements` is being called with);

This value has to match with what you set in previous step. (in the example we created a folder called `sdk-idverse`)
It is really important the `/` at the end of the string value:

```js
defineCustomElements(window, {
  resourcesUrl: '/sdk-idverse/',
});
```

### Setting `worker-path`

In the previous steps you might have noticed that as a part of the assets there is a IDVerseSDK.worker.min.XXXXX.js file.
You will need to reference to this when using the `<idverse-sdk-ui>` tag/component.
in the file `src/app/app.component.html` you will need to add this prop as follow (considering where we copied the assets in previous step)

This would look like(note the `worker-path` prop):

```html
 <idverse-sdk-ui 
  [attr.session-url]="sessionUrl" 
  [attr.session-token]="sessionToken" 
  [attr.session-build-id]="buildId"
  [attr.enable-dfa]="true"
  [attr.enable-face-match]="true"
  [attr.skip-face-scan-intro]="true"
  worker-path="./sdk-idverse/assets/IDVerseSDK.worker.min.d8bca5c5.js">
 </idverse-sdk-ui>
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
