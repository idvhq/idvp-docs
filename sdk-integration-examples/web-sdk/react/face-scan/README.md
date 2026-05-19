# Getting Started

### `env variables`

Create a `.env.local` file at the root of this project

With the following content (use your data in the placeholders)

```bash
VITE_SDK_SESSION_URL=https://........
VITE_SDK_SESSION_TOKEN=idv_..........
```

### Install dependencies

```bash
 npm i
```

### Copy assets
The sdk needs a few static assets, which needs to be copied from `./node_modules/@idverse/idv-sdk-web/dist/assets` and hosted by your app or by any mechanism you prefer.
In this app we use the Vite plugin `vite-plugin-static-copy` to copy the assets at compile time (see the file `vite.config.ts`) into the directory `/idv-web-sdk/assets`.

### Setting `resourcesUrl`
In the file `src/main.tsx` we call the method `defineCustomElements` to initialise the SDK.

We need to set the value for `resourcesUrl` (see second argument with which `defineCustomElements` is being called with);

This value has to match with what you set in previous step. (in the example we created a folder called `idv-web-sdk`)
The trailing `/` is necessary to resolve the path correctly.

```js
defineCustomElements(window, {
  resourcesUrl: '/idv-web-sdk/',
});
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
