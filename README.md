# Next.js Deploy Notifications

The goal of this library is to let your users know when you've deployed a new version of your Next.js application.

```jsx
import { hasNewDeploy } from 'next-deploy-notifications';

function App({ children }) {
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

![]()

## Installation

```bash
npm install next-deploy-notifications

# or

yarn add next-deploy-notifications
```

## Setup

### API Route

```js
// pages/api/has-new-deploy.js

export { APIRoute as default } from 'next-deploy-notifications';
```

## Usage

```jsx
import { hasNewDeploy } from 'next-deploy-notifications';

let hasNewDeploy = useHasNewDeploy();
```

## Customizing

### Non-vercel hosts
