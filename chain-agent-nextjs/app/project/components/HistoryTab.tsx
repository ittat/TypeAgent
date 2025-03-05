'use client';

export default function HistoryTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">修改历史</h2>
      <div className="space-y-4">
        <div className="border-l-2 border-gray-200 pl-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Damien G.</span>
            <span className="text-sm text-gray-500">修改了文档内容</span>
            <span className="text-sm text-gray-500">2024-01-20 15:30</span>
          </div>
          <p className="mt-1 text-gray-600">更新了买家信息部分的格式。</p>
        </div>
        <div className="border-l-2 border-gray-200 pl-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Mike S.</span>
            <span className="text-sm text-gray-500">添加了新章节</span>
            <span className="text-sm text-gray-500">2024-01-19 14:20</span>
          </div>
          <p className="mt-1 text-gray-600">添加了车辆详细信息章节。</p>
        </div>
      </div>
    </div>
  );
}