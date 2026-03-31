import { MainlayerClient } from '@mainlayer/sdk';
import * as fs from 'fs';
import * as path from 'path';

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY! });

/**
 * Example: List your workflow for sale on the marketplace
 */
async function sellWorkflow(workflowJsonPath: string, name: string, price: number) {
  console.log(`Listing workflow: ${name}`);
  console.log(`Price: $${(price / 100).toFixed(2)}\n`);

  // Read workflow JSON file
  const workflowJson = JSON.parse(
    fs.readFileSync(path.resolve(workflowJsonPath), 'utf-8')
  );

  const workflowId = `wf-${Date.now()}`;

  // Register workflow as payable resource
  const resource = await ml.resources.create({
    id: workflowId,
    name,
    price,
    metadata: {
      type: 'workflow',
      platform: workflowJson.platform ?? 'n8n',
      nodeCount: workflowJson.nodes?.length ?? 0,
    },
  });

  console.log('Workflow listed successfully!');
  console.log(`Marketplace ID: ${resource.id}`);
  console.log(`Share this link: https://workflow-marketplace.io/workflows/${workflowId}`);

  return resource;
}

/**
 * Example: Check how many times your workflow has been purchased
 */
async function checkWorkflowSales(workflowId: string) {
  const stats = await ml.resources.getStats(workflowId);

  console.log(`Workflow: ${workflowId}`);
  console.log(`Total purchases: ${stats.totalPurchases}`);
  console.log(`Revenue earned: $${(stats.totalRevenue / 100).toFixed(2)}`);
  console.log(`Last purchased: ${stats.lastPurchasedAt ?? 'Never'}`);

  return stats;
}

/**
 * Example: Issue a refund for a workflow purchase
 */
async function refundPurchase(purchaseId: string, reason: string) {
  const refund = await ml.refunds.create({
    purchaseId,
    reason,
  });

  console.log(`Refund issued: ${refund.id}`);
  console.log(`Amount: $${(refund.amount / 100).toFixed(2)}`);
  return refund;
}

// Run example — point to a real workflow JSON file
sellWorkflow('./my-workflow.json', 'My Awesome Automation', 1999).catch(console.error);
