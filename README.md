# workflow-marketplace
![CI](https://github.com/mainlayer/workflow-marketplace/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/badge/license-MIT-blue)

Marketplace for n8n, Zapier, and Make automation workflows — buy ready-made automations with instant download after payment.

## Installation
```
npm install @mainlayer/sdk
```

## Quickstart
```ts
import { MainlayerClient } from '@mainlayer/sdk';

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY });

// Register your workflow for sale
const resource = await ml.resources.create({
  id: 'my-workflow',
  name: 'Slack to Notion Task Sync',
  price: 1499,
  metadata: { type: 'workflow', platform: 'n8n', nodeCount: 12 },
});

// Buyer purchases and gets workflow JSON
const result = await ml.resources.verifyAccess('my-workflow', buyerToken);
if (result.granted) {
  const downloadUrl = await generateWorkflowDownloadUrl('my-workflow', result.accessToken);
  return { success: true, downloadUrl, workflowJson };
}
```

## Features
- Browse workflows across n8n, Zapier, Make, and Pipedream
- One-time purchase grants instant access to workflow JSON and setup instructions
- Seller dashboard with download counts and revenue stats
- Support for multi-trigger and multi-platform workflows

📚 Full docs at [mainlayer.fr](https://mainlayer.fr)
