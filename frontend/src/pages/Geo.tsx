import { Layout } from '../components/Layout';

export const Geo: React.FC = () => {
  return (
    <Layout title="GEO 分析" description="地理位置数据分析">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">GEO 数据分析</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              GEO 功能开发中
            </h2>
            <p className="text-gray-600 mb-6">
              此功能将提供地理位置相关的数据分析和可视化。
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-500">计划功能：</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>访问来源地理位置分析</li>
                <li>GEO 维度数据可视化</li>
                <li>访问分布热力图</li>
                <li>地区访问统计</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

