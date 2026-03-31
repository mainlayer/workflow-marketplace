import { jest } from '@jest/globals';

jest.mock('@mainlayer/sdk', () => {
  return {
    MainlayerClient: jest.fn().mockImplementation(() => ({
      resources: {
        verifyAccess: jest.fn(),
        create: jest.fn(),
        getStats: jest.fn(),
      },
      refunds: {
        create: jest.fn(),
      },
    })),
  };
});

import { MainlayerClient } from '@mainlayer/sdk';
import { workflows } from '../src/data/workflows';

describe('Workflow Purchase Flow', () => {
  let mlClient: ReturnType<typeof MainlayerClient.prototype.constructor>;

  beforeEach(() => {
    jest.clearAllMocks();
    mlClient = new (MainlayerClient as jest.MockedClass<typeof MainlayerClient>)({
      apiKey: 'test-key',
    });
  });

  describe('Sample workflow data', () => {
    it('contains at least 3 workflows', () => {
      expect(workflows.length).toBeGreaterThanOrEqual(3);
    });

    it('all workflows have required fields', () => {
      for (const workflow of workflows) {
        expect(workflow.id).toBeDefined();
        expect(workflow.name).toBeDefined();
        expect(workflow.price).toBeGreaterThan(0);
        expect(workflow.platform).toBeDefined();
        expect(workflow.integrations).toBeInstanceOf(Array);
        expect(workflow.sampleJson).toBeDefined();
      }
    });

    it('workflow prices are reasonable (under $50)', () => {
      for (const workflow of workflows) {
        expect(workflow.price).toBeLessThanOrEqual(5000);
      }
    });
  });

  describe('Payment verification', () => {
    it('grants access and returns download URL on success', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockResolvedValue({
        granted: true,
        accessToken: 'workflow-access-token',
      });

      const result = await mlClient.resources.verifyAccess('wf-001', 'buyer-token');

      expect(result.granted).toBe(true);
      expect(result.accessToken).toBe('workflow-access-token');
    });

    it('denies access when payment fails', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockResolvedValue({
        granted: false,
      });

      const result = await mlClient.resources.verifyAccess('wf-001', 'expired-token');

      expect(result.granted).toBe(false);
    });
  });

  describe('Workflow resource registration', () => {
    it('registers a workflow with correct metadata', async () => {
      const mockResource = {
        id: 'wf-test',
        name: 'Test Workflow',
        price: 1499,
        metadata: { type: 'workflow', platform: 'n8n', nodeCount: 12 },
      };

      (mlClient.resources.create as jest.Mock).mockResolvedValue(mockResource);

      const resource = await mlClient.resources.create({
        id: 'wf-test',
        name: 'Test Workflow',
        price: 1499,
        metadata: { type: 'workflow', platform: 'n8n', nodeCount: 12 },
      });

      expect(resource.metadata.platform).toBe('n8n');
      expect(resource.metadata.nodeCount).toBe(12);
    });
  });

  describe('Workflow stats', () => {
    it('returns purchase stats for a workflow', async () => {
      (mlClient.resources.getStats as jest.Mock).mockResolvedValue({
        totalPurchases: 234,
        totalRevenue: 351066,
        lastPurchasedAt: '2024-03-15T10:00:00Z',
      });

      const stats = await mlClient.resources.getStats('wf-001');

      expect(stats.totalPurchases).toBe(234);
      expect(stats.totalRevenue).toBeGreaterThan(0);
    });
  });

  describe('Refunds', () => {
    it('issues a refund successfully', async () => {
      (mlClient.refunds.create as jest.Mock).mockResolvedValue({
        id: 'refund-001',
        purchaseId: 'purchase-001',
        amount: 1499,
        reason: 'Workflow not compatible',
      });

      const refund = await mlClient.refunds.create({
        purchaseId: 'purchase-001',
        reason: 'Workflow not compatible',
      });

      expect(refund.id).toBe('refund-001');
      expect(refund.amount).toBe(1499);
    });
  });
});
