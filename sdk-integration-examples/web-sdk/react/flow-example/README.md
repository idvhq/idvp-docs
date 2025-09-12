# Getting Started

### `env variables`

Create a `.env.local` file at the root of this project

With the following content (use your data in the placeholders)

```bash
VITE_SDK_SESSION_URL=https://........
VITE_SDK_SESSION_TOKEN=idv_..........
VITE_SDK_SESSION_BUILD_ID=build_.....
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
flow-example/
├── public/
│   ├── sdk-idverse/
|   |   ├── assets
│   |   |   ├── images
|   |   |   ...
|   |   |   ├── IDVerseSDK.worker.min.XXXXX.js

```

### Setting `resourcesUrl`

In the file `src/main.tsx` there is a method being called which name is `defineCustomElements`.

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
in the file `src/App.tsx` you will need to add this prop as follow (considering where we copied the assets in previous step)

This would look like(note the `worker-path` prop):

```js
<idverse-sdk-ui
  session-url={sessionUrl}
  session-token={sessionToken}
  session-build-id={buildId}
  enable-dfa={true}
  enable-face-match={true}
  skip-face-scan-intro={true}
  worker-path="./sdk-idverse/assets/IDVerseSDK.worker.min.XXXXX.js"
/>
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
