# Next.js Deploy Notifications

This library lets your users know when you've deployed a new version of your Next.js application.

```jsx
import { useHasNewDeploy } from "next-deploy-notifications";

function App() {
  let { hasNewDeploy } = useHasNewDeploy();

  return (
    <div>
      <main>Your app</main>

      {hasNewDeploy && (
        <Notification>
          New version available!
          <button onClick={() => window.location.reload()}>Refresh</button>
        </Notification>
      )}
    </div>
  );
}
```

![Deploy notification](https://raw.githubusercontent.com/ryanto/next-deploy-notifications/main/misc/deploy.gif)

## Installation

```bash
npm install next-deploy-notifications

# or

yarn add next-deploy-notifications
```

## Setup

### API Route

You'll first need to create a new API route in order for this library to work correctly. Paste the following into `pages/api/has-new-deploy.js`.

```js
// pages/api/has-new-deploy.js

export { APIRoute as default } from "next-deploy-notifications/api";
```

## Usage

The `useHasNewDeploy` hook will tell you when a new version of your application has been deployed. This hook returns a `hasNewDeploy` property that's a boolean. It's `true` whenever there's a new deploy!

```jsx
import { useHasNewDeploy } from "next-deploy-notifications";

function Page() {
  let { hasNewDeploy } = useHasNewDeploy();

  return hasNewDeploy && <div>A new deploy is available!</div>;
}
```

The `useHasNewDeploy` hook will check for a new version of your application every 30 seconds. It will suspend checking for new versions if the application window is not focused by the user.

## Development environments

When running in development this library will treat the current git commit as your application's version. If the latest git commit sha changes then `useHasNewDeploy` hook will react as if there was a new deploy.

To trigger a new commit without checking in code, you can use the following command:

```bash
git commit -m "Trigger useHasNewDeploy!" --allow-empty
```

It's worth noting that it can take up to 30 seconds for the application to see the git commit. You'll also need to make sure the application window is focused.

## Production environments

This library works out of the box with the following hosting providers:

- Vercel

  Note: Make sure you're application has "Automatically expose System Environment Variables" checked. This can be found in the Vercel dashboard under Settings > Environment variables.

### Other hosts

If your web host is not listed above you can add a custom `version` function in order to make this library work properly.

```jsx
// pages/api/has-new-deploy.js

import { APIRoute } from "next-deploy-notifications/api";

export APIRoute.configure({
  // Return your app's version here.
  version: () => "123"
})
```

The `version` function should return the current version of the application as a string. You can read from `process.env`, the file system, or even make network calls here.

If needed, `version` can be an async function or return a promise.

Whenever the value returned by `version` changes your application's users will be notified of a new deploy.

Please open a new issue if you are adding a custom version function for a well known web host. I'd love to make common hosts supported by default!
