import React from 'react';
import Section from './Sections';
import { Shield } from 'lucide-react';

export default function Maintenance({ number }: { number: number }) {
  return (
    <Section id="maintenance" number={number} title="Maintenance & Safety" Icon={Shield}>
      <div className="prose prose-lg max-w-none">
    {/* 11.1 Routine Checklists */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Routine Checklists</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Inspect wiring integrity and verify all connectors are secure.</li>
        <li>Clean and realign IR sensors.</li>
        <li>Check ultrasonic sensors for obstructions.</li>
        <li>Tighten servo mounting screws.</li>
        <li>Lubricate wheel bearings.</li>
        <li>Track software updates via Git commits; firmware version must match hardware build.</li>
      </ul>
    </div>

    {/* 11.2 Sensor Recalibration */}
    <div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-green-900 mb-4">Sensor Recalibration</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Recalibrate IR sensors regularly: clean lenses & adjust potentiometers.</li>
        <li>Run ultrasonic accuracy checks against known distances.</li>
        <li>Planned feature: React Native app command <strong>“Calibrate”</strong> to trigger automated tests.</li>
      </ul>
    </div>

    {/* 11.3 Failsafes */}
    <div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-yellow-900 mb-4">Failsafes</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Hardware:</strong> Emergency-stop relay cuts motor power; main switch disconnects battery.</li>
        <li><strong>Software:</strong> Watchdog halts motors if no serial update for &gt;5s.</li>
        <li><strong>Electrical:</strong> Motor drivers have current limiting; firmware halts on over-current faults.</li>
      </ul>
    </div>

    {/* 11.4 Thermal Management */}
    <div className="bg-red-50 rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-red-900 mb-4">Thermal Management</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Heatsinks + vent slots on motor drivers & buck converters.</li>
        <li>Measured temps:
          <ul className="list-disc pl-6 space-y-1">
            <li>Motor drivers: &lt;45 °C under load</li>
            <li>Buck converter: ~50 °C</li>
          </ul>
        </li>
        <li>Fans can be added if needed.</li>
        <li>Planned safety: auto-shutdown if drivers hit <strong>80 °C</strong>.</li>
      </ul>
    </div>
  </div>
    </Section>
  );
}


