# IDV Platform Docs Code Examples

This repository holds code example for IDVerse's [IDV Platform](https://idvplatform.docs.idverse.com/docs/idv-platform-overview).

The SDK documentation is available at [idvplatform.docs.idverse.com/docs/getting-started](https://idvplatform.docs.idverse.com/docs/getting-started).

## Quick Start

- Make sure you have [Node.js](https://nodejs.org/) installed
- Download the built SDK from your Tenant session
- Extract the `sdk-build-******.zip` and copy `idverse-sdk-browser` folder to the `sdk-integration-examples` folder
- For each app you will need to run `npm install` to get all the dependencies then update the code below with parameters with those from your Tenant session:

```jsx
<idverse-sdk-ui
  session-url="YOUR_SESSION_URL"
  session-token="YOUR_SESSION_TOKEN"
  session-build-id="YOUR_SESSION_BUILD_ID"
></idverse-sdk-ui>
```

- Run the app with `npm run host` (your app will be available on the local network for testing with other devices as well)

## Example Apps

- [IDKit Core Web SDK using Angular](./sdk-integration-examples/web-sdk/angular)
- [IDKit Core Web SDK using React](./sdk-integration-examples/web-sdk/react)
- [IDKit Core Web SDK using Vue](./sdk-integration-examples/web-sdk/vue)
