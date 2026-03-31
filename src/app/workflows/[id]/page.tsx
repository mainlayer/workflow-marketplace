import { notFound } from 'next/navigation';
import { workflows } from '@/data/workflows';

interface Props {
  params: { id: string };
}

export default function WorkflowDetailPage({ params }: Props) {
  const workflow = workflows.find((w) => w.id === params.id);
  if (!workflow) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {workflow.platform}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {workflow.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{workflow.name}</h1>
                <p className="text-gray-600">by {workflow.authorName}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${(workflow.price / 100).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">instant download</div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{workflow.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{workflow.nodeCount}</div>
                <div className="text-sm text-gray-500">Nodes</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{workflow.triggerCount}</div>
                <div className="text-sm text-gray-500">Triggers</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{workflow.integrations.length}</div>
                <div className="text-sm text-gray-500">Integrations</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {workflow.integrations.map((integration) => (
                  <span key={integration} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded border border-green-200">
                    {integration}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
              <span>★ {workflow.rating} rating</span>
              <span>·</span>
              <span>{workflow.salesCount} purchases</span>
            </div>

            <form action="/api/purchase" method="POST">
              <input type="hidden" name="workflowId" value={workflow.id} />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
              >
                Purchase for ${(workflow.price / 100).toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
