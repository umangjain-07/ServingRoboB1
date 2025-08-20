import React from 'react';
import Section from './Sections';
import { BatteryCharging } from 'lucide-react';

export default function Power({ number }: { number: number }) {
  return (
    <Section id="power" number={number} title="Power Management" Icon={BatteryCharging}>
      <div className="space-y-8">
    {/* 8.1 Battery Architecture */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 border border-rose-200/60 shadow-sm">
      <h3 className="text-2xl font-semibold text-rose-800 mb-3">8.1 Battery Architecture</h3>

      {/* Topology & Modules */}
      <div className="rounded-xl bg-white/70 border border-rose-200/60 p-5">
        <h4 className="text-lg font-semibold text-rose-700 mb-2">Topology & Modules</h4>
        <ul className="list-disc pl-6 text-gray-800 space-y-2">
          <li>Pack built from <strong className="text-rose-700">five identical modules</strong>, each ~12 V nominal.</li>
          <li><span className="font-semibold text-rose-700">Per-module construction:</span> <code className="px-1 rounded bg-rose-50 text-rose-800">3S7P</code> = 21 cells total.
            <ul className="list-disc pl-6 mt-2">
              <li>3 series groups × 7 parallel cells.</li>
              <li>Nominal per cell: 3.5–3.7 V</li>
              <li>Nominal per module: ≈11.1 V (10.5 V @ 3.5 V basis)</li>
              <li>Cells per module: 21</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Pack Combination */}
      <div className="mt-5 rounded-xl bg-white/70 border border-pink-200/60 p-5">
        <h4 className="text-lg font-semibold text-pink-700 mb-2">Pack Combination</h4>
        <ul className="list-disc pl-6 text-gray-800 space-y-2">
          <li>5 modules in series → <strong className="text-pink-700">15S7P</strong> pack.</li>
          <li>Nominal voltage: ≈55.5 V (52.5 V @ 3.5 V basis)</li>
          <li>Max (4.2 V per cell): 63.0 V</li>
          <li>Min (3.0 V per cell): 45.0 V</li>
        </ul>
      </div>

      {/* Mechanical & Summary */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/70 border border-fuchsia-200/60 p-5">
          <h4 className="text-lg font-semibold text-fuchsia-700 mb-2">Mechanical & Wiring</h4>
          <ul className="list-disc pl-6 text-gray-800 space-y-2">
            <li>Each module: 3 blocks of 7P cells, insulated and compression-mounted.</li>
            <li>5 modules series-linked into 15S7P.</li>
            <li>Balance leads for all 15 series groups to BMS.</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white/70 border border-rose-200/60 p-5">
          <h4 className="text-lg font-semibold text-rose-700 mb-2">Summary</h4>
          <ul className="list-disc pl-6 text-gray-800 space-y-2">
            <li>Configuration: 15S7P</li>
            <li>Target system voltage: ~55 V nominal</li>
            <li>Total cells: 105</li>
          </ul>
        </div>
      </div>
    </div>

    {/* 8.2 BMS */}
    <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-rose-400 shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-rose-800 mb-3">8.2 Battery Management System (BMS)</h3>
        <p className="text-gray-800">One centralized <strong className="text-rose-700">15S BMS</strong> with balance harness (S0–S15).</p>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-rose-200/60 p-4">
            <h4 className="font-semibold text-rose-700 mb-2">Protections</h4>
            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              <li>Over-voltage cutoff: ~4.20 V</li>
              <li>Under-voltage cutoff: ~3.00 V</li>
              <li>Over-current & short-circuit protection</li>
              <li>Temperature monitoring (charge/discharge)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-pink-200/60 p-4">
            <h4 className="font-semibold text-pink-700 mb-2">Balancing</h4>
            <p className="text-gray-800">Passive balancing across all 15 groups during charge.</p>
          </div>
          <div className="rounded-lg border border-fuchsia-200/60 p-4">
            <h4 className="font-semibold text-fuchsia-700 mb-2">Note</h4>
            <p className="text-gray-800">Centralized BMS simplifies pack-level protection and state reporting.</p>
          </div>
        </div>
      </div>
    </div>

    {/* 8.3 Power Distribution */}
    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-amber-400 shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-amber-800 mb-3">8.3 Power Distribution & Voltage Rails</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-amber-200/60 p-4">
            <h4 className="font-semibold text-amber-700 mb-2">Main Rail</h4>
            <p className="text-gray-800">15S pack ≈ 45–63 V directly feeds motor drivers.</p>
          </div>
          <div className="rounded-lg border border-lime-200/60 p-4">
            <h4 className="font-semibold text-lime-700 mb-2">Low-Voltage Rails</h4>
            <ul className="list-disc pl-6 text-gray-800">
              <li>12 V — fans, relays, auxiliaries</li>
              <li>5 V — MCUs, sensors, servos</li>
            </ul>
          </div>
        </div>
        <pre className="bg-slate-900 text-amber-200 p-4 rounded-lg mt-4 text-sm overflow-x-auto">
{`[15S7P PACK +] → Main Fuse → Motor Drivers / Buck 55V→12V / Buck 55V→5V
[15S7P PACK -] → Return
BMS balance leads S0–S15`}
        </pre>
      </div>
    </div>

    {/* 8.4 Protection & Safety */}
    <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-400 shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-red-800 mb-3">8.4 Protection, Switching & Safety</h3>
        <ul className="list-disc pl-6 text-gray-800 space-y-1">
          <li>Main pack fuse + individual rail fuses</li>
          <li>Master cutoff / E-STOP upstream of converters & drivers</li>
          <li>Optional pre-charge circuit for large capacitive loads</li>
          <li>Star ground to minimize noise; ferrites and RC snubbers for EMI</li>
        </ul>
      </div>
    </div>

    {/* 8.5 Thermal */}
    <div className="rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border-l-4 border-sky-400 shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-sky-800 mb-3">8.5 Thermal Management</h3>
        <ul className="list-disc pl-6 text-gray-800 space-y-1">
          <li>Heatsinks + directed airflow on drivers, DC-DCs, and BMS</li>
          <li>Battery bay ventilation to prevent hotspots</li>
          <li>Keep all components under 60 °C during sustained load</li>
        </ul>
      </div>
    </div>

    {/* 8.6 Validation */}
    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-400 shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-emerald-800 mb-3">8.6 Test & Validation Checklist</h3>
        <ol className="list-decimal pl-6 text-gray-800 space-y-1">
          <li>Verify each 3S7P module (voltage, resistance, balance)</li>
          <li>Check full pack voltages across charge states</li>
          <li>Trip test OVP/UVP protections</li>
          <li>Measure steady-state, surge & stall currents</li>
          <li>Validate 12 V/5 V rails under dynamic load</li>
          <li>E-STOP functional test under load</li>
        </ol>
      </div>
    </div>

    {/* 8.7 Maintenance */}
    <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-purple-800 mb-3">8.7 Maintenance</h3>
        <ul className="list-disc pl-6 text-gray-800 space-y-1">
          <li>Periodic per-group voltage audits via BMS telemetry</li>
          <li>Inspect interconnects, fuse holders, and insulation</li>
          <li>Track capacity drift; replace weak groups</li>
          <li>Keep spare fuses and tested replacement BMS</li>
        </ul>
      </div>
    </div>
  </div>
    </Section>
  );
}


