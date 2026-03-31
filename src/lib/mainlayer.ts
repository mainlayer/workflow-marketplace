import { MainlayerClient } from '@mainlayer/sdk';

if (!process.env.MAINLAYER_API_KEY) {
  throw new Error('MAINLAYER_API_KEY environment variable is required');
}

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY });

export interface WorkflowMetadata {
  platform: 'n8n' | 'zapier' | 'make' | 'pipedream' | 'other';
  nodeCount?: number;
  triggerCount?: number;
  category?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'advanced';
  setupTimeMinutes?: number;
}

/**
 * Verifies that a buyer has paid for a workflow.
 * @param workflowId The workflow resource ID
 * @param buyerToken The buyer's payment token from Mainlayer checkout
 * @returns Access verification result with license key
 */
export async function verifyWorkflowPurchase(
  workflowId: string,
  buyerToken: string
): Promise<{ granted: boolean; accessToken?: string; licenseKey?: string }> {
  if (!workflowId || !buyerToken) {
    throw new Error('Workflow ID and buyer token are required');
  }

  try {
    const result = await ml.resources.verifyAccess(workflowId, buyerToken);
    return {
      granted: result.granted,
      accessToken: result.accessToken,
      licenseKey: result.granted ? generateLicenseKey(workflowId, buyerToken) : undefined,
    };
  } catch (error) {
    console.error(`Failed to verify workflow purchase for ${workflowId}:`, error);
    throw new Error(`Workflow verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Registers a workflow as a Mainlayer resource for payment processing.
 * @param workflowId Unique workflow identifier
 * @param workflowName Human-readable workflow name
 * @param price Price in cents (USD)
 * @param metadata Platform and workflow details
 * @returns Created resource with payment URL
 */
export async function createWorkflowResource(
  workflowId: string,
  workflowName: string,
  price: number,
  metadata?: WorkflowMetadata
) {
  if (price < 0) {
    throw new Error('Price must be non-negative');
  }
  if (!workflowId || !workflowName) {
    throw new Error('Workflow ID and name are required');
  }

  try {
    return await ml.resources.create({
      id: workflowId,
      price,
      name: workflowName,
      metadata: metadata ? {
        platform: metadata.platform,
        nodeCount: metadata.nodeCount,
        triggerCount: metadata.triggerCount,
        category: metadata.category,
        tags: metadata.tags,
        difficulty: metadata.difficulty,
        setupTimeMinutes: metadata.setupTimeMinutes,
        type: 'workflow',
      } : undefined,
    });
  } catch (error) {
    console.error(`Failed to create resource for workflow ${workflowId}:`, error);
    throw new Error(`Workflow creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Initiates payment checkout for a workflow.
 * @param workflowId The workflow resource ID
 * @param returnUrl URL to return to after checkout
 * @returns Checkout session with payment URL
 */
export async function initiateCheckout(workflowId: string, returnUrl: string) {
  if (!workflowId || !returnUrl) {
    throw new Error('Workflow ID and return URL are required');
  }

  try {
    const session = await ml.checkout.create({
      resourceId: workflowId,
      returnUrl,
      metadata: { type: 'workflow_purchase' },
    });
    return session;
  } catch (error) {
    console.error(`Checkout creation failed for workflow ${workflowId}:`, error);
    throw new Error(`Checkout initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates a unique license key for a purchased workflow.
 * In production, store this in your database.
 */
function generateLicenseKey(workflowId: string, buyerToken: string): string {
  const timestamp = Date.now().toString(36);
  const hash = Buffer.from(`${workflowId}:${buyerToken}`).toString('base64').substring(0, 16);
  return `${workflowId}-${hash}-${timestamp}`.toUpperCase();
}

export default ml;
