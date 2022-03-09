# Next.js Deploy Notifications

This library lets your users know when you've deployed a new version of your Next.js application.

```jsx
import { hasNewDeploy } from 'next-deploy-notifications';

function App() {
  let hasNewDeploy = useHasNewDeploy();

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

export { APIRoute as default } from 'next-deploy-notifications';
```

## Usage

Next, the `useHasNewDeploy` hook will tell you when a new version of your application has been deployed. This hook returns a boolean that's `true` when there's a new deploy.

```jsx
import { useHasNewDeploy } from 'next-deploy-notifications';

function Page() {
  let hasNewDeploy = useHasNewDeploy();

  return hasNewDeploy && <div>A new deploy is available!</div>;
}
```

## Production environments

This add works out of the box with the following hosting providers:

- Vercel

  Note: Make sure you're application has "Automatically expose System Environment Variables" checked. This can be found in the Vercel dashboard under Settings > Environment variables.

### Other hosts

Coming soon.
