export interface Workflow {
  id: string;
  name: string;
  description: string;
  platform: 'n8n' | 'Zapier' | 'Make' | 'Pipedream';
  category: string;
  price: number; // in cents
  authorId: string;
  authorName: string;
  tags: string[];
  nodeCount: number;
  triggerCount: number;
  integrations: string[];
  rating: number;
  salesCount: number;
  sampleJson: Record<string, unknown>;
  setupInstructions: string;
  createdAt: string;
}

export const workflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Slack to Notion Task Sync',
    description: 'Automatically create Notion tasks from Slack messages with a specific emoji reaction. Includes assignee detection and priority tagging.',
    platform: 'n8n',
    category: 'Productivity',
    price: 1499,
    authorId: 'author-001',
    authorName: 'AutomationPro',
    tags: ['slack', 'notion', 'tasks', 'productivity'],
    nodeCount: 12,
    triggerCount: 1,
    integrations: ['Slack', 'Notion', 'OpenAI'],
    rating: 4.8,
    salesCount: 234,
    sampleJson: {
      name: 'Slack to Notion Task Sync',
      nodes: [],
      connections: {},
      active: false,
      settings: {},
    },
    setupInstructions: '1. Import workflow JSON into n8n\n2. Configure Slack OAuth\n3. Set Notion API key\n4. Map workspace IDs\n5. Activate workflow',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'wf-002',
    name: 'AI Customer Support Router',
    description: 'Route incoming support tickets to the right team using AI classification. Integrates with Zendesk, Gmail, and Intercom.',
    platform: 'Zapier',
    category: 'Customer Support',
    price: 2499,
    authorId: 'author-002',
    authorName: 'ZapMaster',
    tags: ['support', 'ai', 'zendesk', 'routing'],
    nodeCount: 8,
    triggerCount: 2,
    integrations: ['Zendesk', 'Gmail', 'Intercom', 'OpenAI'],
    rating: 4.9,
    salesCount: 189,
    sampleJson: {
      name: 'AI Support Router',
      steps: [],
      trigger: { type: 'webhook' },
    },
    setupInstructions: '1. Import Zap template\n2. Connect Zendesk account\n3. Add OpenAI API key\n4. Configure routing rules\n5. Test with sample ticket',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'wf-003',
    name: 'E-commerce Order Analytics Pipeline',
    description: 'Sync Shopify orders to Google Sheets with automatic revenue calculations, customer segmentation, and weekly email reports.',
    platform: 'Make',
    category: 'E-commerce',
    price: 1999,
    authorId: 'author-003',
    authorName: 'DataFlowAgency',
    tags: ['shopify', 'analytics', 'google-sheets', 'ecommerce'],
    nodeCount: 15,
    triggerCount: 3,
    integrations: ['Shopify', 'Google Sheets', 'Gmail', 'Slack'],
    rating: 4.7,
    salesCount: 312,
    sampleJson: {
      name: 'Shopify Analytics Pipeline',
      blueprint: {},
      scheduling: { type: 'indefinitely', interval: 3600 },
    },
    setupInstructions: '1. Import scenario blueprint\n2. Connect Shopify store\n3. Authorize Google Sheets\n4. Set reporting email\n5. Schedule run frequency',
    createdAt: '2024-02-05T00:00:00Z',
  },
];
