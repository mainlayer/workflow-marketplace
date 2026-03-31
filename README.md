# Workflow Marketplace

![CI](https://github.com/mainlayer/workflow-marketplace/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/badge/license-MIT-blue)

Production-ready marketplace for buying and selling automation workflows. Supports n8n, Zapier, Make, and Pipedream workflows with instant delivery after payment via Mainlayer.

## Features

**For Buyers**
- Browse workflows across multiple automation platforms (n8n, Zapier, Make, Pipedream)
- Filter by category, difficulty, and setup time
- Preview setup instructions before purchase
- One-click checkout with Mainlayer payment
- Instant workflow download with license key
- Setup support documentation

**For Sellers**
- List automation workflows with custom pricing
- Real-time download and revenue tracking
- Seller analytics dashboard
- Multi-platform support
- Easy workflow export and updates

## Quick Start

### Prerequisites
- Node.js 18+
- Mainlayer account and API key from https://docs.mainlayer.fr

### Setup

```bash
npm install
export MAINLAYER_API_KEY="your-api-key"
npm run dev
```

Open http://localhost:3000 to browse workflows.

## Architecture

```
workflow-marketplace/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Workflow discovery/browsing
│   │   ├── workflows/[id]/    # Workflow detail page
│   │   ├── dashboard/         # Seller dashboard
│   │   └── api/download/      # Payment verification & delivery
│   ├── lib/
│   │   └── mainlayer.ts       # Mainlayer SDK integration
│   ├── data/
│   │   └── workflows.ts       # Sample workflow data
│   └── types/
│       └── index.ts           # Domain models
├── tests/                      # Test suite
├── examples/                   # Implementation examples
└── package.json
```

## Usage

### For Buyers: Purchase a Workflow

```typescript
import { initiateCheckout } from '@/lib/mainlayer';

// 1. Initiate checkout
const checkout = await initiateCheckout('workflow-001', 'https://myapp.com/return');

// 2. Redirect to payment
window.location.href = checkout.checkoutUrl;

// 3. After payment, verify access
const { granted, licenseKey } = await verifyWorkflowPurchase('workflow-001', buyerToken);

if (granted) {
  // Download workflow JSON
  const response = await fetch('/api/download', {
    method: 'POST',
    body: JSON.stringify({ workflowId: 'workflow-001', buyerToken })
  });
  const { workflowJson, setupInstructions } = await response.json();

  // Import into n8n/Zapier/Make
  console.log(workflowJson);
}
```

### For Sellers: List a Workflow

```typescript
import { createWorkflowResource } from '@/lib/mainlayer';

// Register workflow as a payable resource
const resource = await createWorkflowResource(
  'slack-to-notion-sync',
  'Slack to Notion Task Sync',
  1499, // $14.99
  {
    platform: 'n8n',
    nodeCount: 12,
    triggerCount: 2,
    category: 'Integration',
    tags: ['slack', 'notion', 'sync'],
    difficulty: 'easy',
    setupTimeMinutes: 10
  }
);

// Workflow is now available for purchase
```

## API Reference

### POST /api/download
Verify payment and retrieve workflow file.

**Request**
```json
{
  "workflowId": "workflow-001",
  "buyerToken": "tok_xxx"
}
```

**Response (200)**
```json
{
  "success": true,
  "licenseKey": "WORKFLOW-001-ABC123-XYZ789",
  "workflowJson": {...},
  "setupInstructions": "1. Open your n8n instance...",
  "supportEmail": "seller@company.com"
}
```

**Response (402 - Payment Required)**
```json
{
  "success": false,
  "paymentRequired": true,
  "checkoutUrl": "https://checkout.mainlayer.fr/..."
}
```

## Supported Platforms

### n8n
- Export workflow JSON
- Full node/trigger support
- Credentials handling
- Custom integrations

### Zapier
- Zap blueprints
- Trigger and action setup
- Multi-step workflows

### Make (formerly Integromat)
- Blueprint export
- Module configuration
- Connection setup

### Pipedream
- JavaScript workflow export
- HTTP triggers and actions
- npm module support

## Workflow Structure Example

```json
{
  "id": "slack-to-notion",
  "name": "Slack to Notion Task Sync",
  "description": "Automatically sync Slack messages to Notion database",
  "platform": "n8n",
  "version": "1.0.0",
  "price": 1499,
  "nodes": 12,
  "triggers": 1,
  "actions": 2,
  "difficulty": "easy",
  "setupTimeMinutes": 10,
  "requirements": [
    "Slack workspace admin",
    "Notion page access",
    "OAuth tokens"
  ],
  "workflowJson": {...}
}
```

## Database Setup (Production)

Replace mock data in `src/data/workflows.ts` with database queries:

```typescript
// src/app/page.tsx
async function getWorkflows(filters?: WorkflowFilters): Promise<Workflow[]> {
  return await prisma.workflow.findMany({
    where: {
      platform: filters?.platform,
      category: filters?.category,
      published: true,
    },
    include: { seller: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  });
}
```

## Environment Variables

```env
MAINLAYER_API_KEY="your-mainlayer-api-key"
MAINLAYER_BASE_URL="https://api.mainlayer.fr"
NODE_ENV="production"
```

## Testing

```bash
npm test                       # Run all tests
npm run test -- --watch      # Watch mode
npm run build && npm start   # Production build
```

## Cost Structure

- **Mainlayer transaction fee**: 2.5% per sale
- **Processing**: Instant delivery
- **Seller earnings**: Net after transaction fee
- **Withdrawals**: Available in seller dashboard

## Security

- All API keys stored server-side only
- Payment verification via Mainlayer SDK
- Input validation on all endpoints
- CORS configured appropriately
- No sensitive data in browser

## Integration Examples

See `/examples` directory for full implementations:
- `n8n-integration.ts` - n8n API integration
- `zapier-integration.ts` - Zapier blueprint import
- `make-integration.ts` - Make blueprint handling

## Support & Documentation

- **Mainlayer Docs**: https://docs.mainlayer.fr
- **n8n Docs**: https://docs.n8n.io
- **Zapier Docs**: https://zapier.com/help
- **Make Docs**: https://www.make.com/en/help
- **GitHub Issues**: https://github.com/mainlayer/workflow-marketplace/issues

## License

MIT
