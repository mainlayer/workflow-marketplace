import { MainlayerClient } from '@mainlayer/sdk';

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY! });

export async function verifyWorkflowPurchase(
  workflowId: string,
  buyerToken: string
): Promise<{ granted: boolean; accessToken?: string }> {
  const result = await ml.resources.verifyAccess(workflowId, buyerToken);
  return {
    granted: result.granted,
    accessToken: result.accessToken,
  };
}

export async function createWorkflowResource(workflowId: string, price: number) {
  return await ml.resources.create({
    id: workflowId,
    price,
    name: `Workflow: ${workflowId}`,
  });
}

export default ml;
