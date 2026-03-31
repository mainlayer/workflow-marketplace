import Link from 'next/link';
import { workflows } from '@/data/workflows';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Workflow Marketplace</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/?platform=n8n" className="text-gray-600 hover:text-gray-900">n8n</Link>
            <Link href="/?platform=zapier" className="text-gray-600 hover:text-gray-900">Zapier</Link>
            <Link href="/?platform=make" className="text-gray-600 hover:text-gray-900">Make</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Automation Workflows</h2>
          <p className="text-gray-600">
            Buy ready-made automation workflows for n8n, Zapier, Make, and more. Instant download after purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {workflow.platform}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {workflow.category}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ${(workflow.price / 100).toFixed(2)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workflow.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {workflow.authorName}</span>
                  <div className="flex items-center gap-2">
                    <span>★ {workflow.rating}</span>
                    <span>·</span>
                    <span>{workflow.salesCount} purchases</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-gray-500">{workflow.nodeCount} nodes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
