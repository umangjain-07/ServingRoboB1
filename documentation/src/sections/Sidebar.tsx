import React from 'react';
import { ChevronRight, Download } from 'lucide-react';
import type { SectionDef } from '../config/sections';

type Props = {
  sections: SectionDef[];
  onJump: (id: string) => void;
  onExport: () => void;
};

export default function Sidebar({ sections, onJump, onExport }: Props) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 md:w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto z-20 hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">BI1</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BI1 Documentation</h1>
            <p className="text-sm text-gray-600">Technical Specification</p>
          </div>
        </div>

        <button
          onClick={onExport}
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>

        <nav className="space-y-2">
          {sections.map((s, i) => {
            const Icon = s.icon as any;
            return (
              <button
                key={s.id}
                onClick={() => onJump(s.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 flex items-center gap-3 group"
              >
                <span className="text-sm font-medium text-gray-500 w-6">{i + 1}.</span>
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{s.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-600" />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
