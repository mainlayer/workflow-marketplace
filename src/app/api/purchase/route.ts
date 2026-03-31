import { NextRequest, NextResponse } from 'next/server';
import { verifyWorkflowPurchase } from '@/lib/mainlayer';
import { workflows } from '@/data/workflows';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, buyerToken } = body;

    if (!workflowId || !buyerToken) {
      return NextResponse.json(
        { error: 'workflowId and buyerToken are required' },
        { status: 400 }
      );
    }

    const workflow = workflows.find((w) => w.id === workflowId);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const result = await verifyWorkflowPurchase(workflowId, buyerToken);

    if (!result.granted) {
      return NextResponse.json(
        { error: 'Payment verification failed. Please complete checkout.' },
        { status: 402 }
      );
    }

    const downloadUrl = await generateWorkflowDownloadUrl(workflowId, result.accessToken!);

    return NextResponse.json({
      success: true,
      downloadUrl,
      workflowJson: workflow.sampleJson,
      instructions: workflow.setupInstructions,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Workflow purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateWorkflowDownloadUrl(workflowId: string, accessToken: string): Promise<string> {
  const baseUrl = process.env.CDN_BASE_URL ?? 'https://cdn.workflow-marketplace.io';
  return `${baseUrl}/workflows/${workflowId}.json?token=${accessToken}`;
}
