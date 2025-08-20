import React from 'react';
import Section from './Sections';
import { Box } from 'lucide-react';

export default function Payload({ number }: { number: number }) {
  return (
    <Section id="payload" number={number} title="Payload & Mechanical Design" Icon={Box}>
      <div className="prose prose-lg max-w-none">
    {/* 9.1 Cobot Arm */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Cobot Arm</h3>
      <p className="text-gray-700 mb-4">
        A 3-DOF articulated robotic arm is integrated into the BI1 platform.
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Mounting</strong>: Installed on a sliding base; retracts into chassis or extends for delivery.</li>
        <li><strong>Actuation</strong>:
          <ul className="list-disc pl-6 space-y-1">
            <li>Joints: 270° digital metal-gear hobby servos (torque & precision).</li>
            <li>Waist extension: NEMA34 stepper with belt drive.</li>
          </ul>
        </li>
        <li><strong>Operation Sequence</strong>:
          <ol className="list-decimal pl-6 space-y-1">
            <li>Sliding base extends the arm.</li>
            <li>Servos position the end-effector.</li>
            <li>Arm retracts & folds back inside chassis.</li>
          </ol>
        </li>
        <li><strong>Mechanics</strong>: Extension via screw drive or rack-and-pinion for stable motion.</li>
      </ul>
    </div>

    {/* 9.2 Base Load Capacity */}
    <div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-green-900 mb-4">Base Load Capacity</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Static Load</strong>: ~80 kg (verified).</li>
        <li><strong>Dynamic Load</strong>: Safe ~40–50 kg during motion.</li>
        <li><strong>Stability</strong>: Wheel bearings distribute weight; low center of mass prevents tipping.</li>
      </ul>
    </div>

    {/* 9.3 Retractable Mechanisms */}
    <div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-yellow-900 mb-4">Retractable Mechanisms</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Sliding Platform</strong>: NEMA34-driven waist extension for linear movement.</li>
        <li><strong>Frame</strong>: Sunboard + aluminum extrusion, modular GIGO-style fastening.</li>
        <li><strong>Covering</strong>: Acrylic enclosures with vent slots for passive cooling.</li>
      </ul>
    </div>

    {/* 9.4 Design Documentation */}
    <div className="bg-purple-50 rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-purple-900 mb-4">Design Documentation</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>CAD Models</strong>: Full frame & arm in SolidWorks.</li>
        <li><strong>Assembly</strong>: Exploded views with structural sequence.</li>
        <li><strong>Dimensions</strong>:
          <ul className="list-disc pl-6 space-y-1">
            <li>Wheelbase: ~600 mm</li>
            <li>Height: ~400 mm</li>
            <li>Arm Reach: ~300 mm (extended)</li>
          </ul>
        </li>
        <li><strong>Mobility</strong>: Ball-bearing wheels + casting plate keep IR sensors at fixed height.</li>
      </ul>
    </div>
  </div>
    </Section>
  );
}

