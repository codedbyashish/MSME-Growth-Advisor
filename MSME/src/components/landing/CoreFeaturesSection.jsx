import React from 'react';
import { LayoutGrid, Users, Package, TrendingUp, BarChart2, Lightbulb } from 'lucide-react';

export default function CoreFeaturesSection() {
  const features = [
    {
      title: 'Sales Dashboard',
      description: 'Track revenue, monitor daily transactions, and see your financial health at a single glance.',
      icon: LayoutGrid,
    },
    {
      title: 'Customer Insights',
      description: 'Understand who buys from you, identify repeat customers, and uncover spending patterns.',
      icon: Users,
    },
    {
      title: 'Inventory Alerts',
      description: 'Never run out of stock. Get timely notifications before popular items hit zero.',
      icon: Package,
    },
    {
      title: 'Sales Forecasts',
      description: 'Predict upcoming demand based on historical data, helping you plan purchases better.',
      icon: TrendingUp,
    },
    {
      title: 'Business Insights',
      description: 'Deep dives into margin analysis, cost tracking, and profitability across different product lines.',
      icon: BarChart2,
    },
    {
      title: 'Recommended Actions',
      description: 'Receive concrete, step-by-step suggestions on how to improve cash flow and reduce waste.',
      icon: Lightbulb,
    },
  ];

  return (
    <section id="features" className="bg-[#FAF8F5] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] tracking-tight">
            Everything you need to grow
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Powerful tools wrapped in a simple interface, designed specifically for the daily realities of small businesses.
          </p>
        </div>

        {/* 6 Feature Cards Grid (3 columns x 2 rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Icon Box */}
                <div className="w-10 h-10 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-[#1E293B] mb-5">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-[#1E293B] mb-2.5">
                  {feat.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-[#64748B] leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
