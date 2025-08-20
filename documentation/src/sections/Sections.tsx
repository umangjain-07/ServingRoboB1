import React from 'react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  id: string;
  number: number;
  title: string;
  Icon: LucideIcon;
  children: React.ReactNode;
};

export default function Section({ id, number, title, Icon, children }: Props) {
  return (
    <section id={id} className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {number}. {title}
        </h2>
      </div>
      <div className="prose prose-lg max-w-none">{children}</div>
    </section>
  );
}
