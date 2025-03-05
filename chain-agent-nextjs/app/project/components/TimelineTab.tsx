'use client';

export default function TimelineTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">项目时间线</h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">1</span>
          </div>
          <div>
            <h3 className="text-lg font-medium">项目启动</h3>
            <p className="text-gray-500">2024-01-20</p>
            <p className="mt-1 text-gray-600">项目正式启动，确定项目范围和目标。</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">2</span>
          </div>
          <div>
            <h3 className="text-lg font-medium">需求分析</h3>
            <p className="text-gray-500">2024-01-25</p>
            <p className="mt-1 text-gray-600">完成需求收集和分析，制定详细的实施计划。</p>
          </div>
        </div>
      </div>
    </div>
  );
}