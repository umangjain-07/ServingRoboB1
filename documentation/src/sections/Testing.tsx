import React from 'react';
import Section from './Sections';
import { Gauge } from 'lucide-react';

export default function Testing({ number }: { number: number }) {
  return (
    <Section id="testing" number={number} title="Testing & Calibration" Icon={Gauge}>
      <div className="prose prose-lg max-w-none">
    {/* 10.1 IR Sensor Calibration */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">IR Sensor Calibration</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Sensitivity tuned via onboard potentiometer.</li>
        <li>Calibrated on black/white test surfaces.</li>
        <li>Example readings:
          <ul className="list-disc pl-6 space-y-1">
            <li>White: ~1023</li>
            <li>Black: ~200</li>
          </ul>
        </li>
        <li>Thresholds: <strong>Black = 250</strong>, <strong>White = 900</strong>.</li>
        <li>Pot positions logged for repeatability.</li>
      </ul>
    </div>

    {/* 10.2 PID Tuning */}
    <div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-green-900 mb-4">PID Tuning</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Step-response tuning with manual displacement tests.</li>
        <li>Final gains:
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Kp = 0.06</strong></li>
            <li><strong>Ki = 0.01</strong></li>
            <li><strong>Kd = 0.02</strong></li>
          </ul>
        </li>
        <li>Stable tracking at <strong>baseSpeed = 80/100 PWM</strong> with minimal oscillation.</li>
      </ul>
    </div>

    {/* 10.3 Ultrasonic Tests */}
    <div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-yellow-900 mb-4">Ultrasonic Tests</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>HC-SR04 vs laser rangefinder.</li>
        <li>Accuracy: ±5 cm @ 1–2 m.</li>
        <li>Latency: ~60 ms per ping.</li>
        <li>Avoidance threshold set to <strong>30 cm</strong>.</li>
      </ul>
    </div>

    {/* 10.4 Battery Life */}
    <div className="bg-purple-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-purple-900 mb-4">Battery Life</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Dual <strong>13,000 mAh / 13 A, 55 V packs</strong> → ~90 min runtime.</li>
        <li>Max current: ~40 A (stall), Avg: ~5 A.</li>
        <li>Long-duration tests ongoing.</li>
      </ul>
    </div>

    {/* 10.5 Max Speed */}
    <div className="bg-red-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-red-900 mb-4">Max Speed</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>MY1016 motors ~3100 RPM (unloaded).</li>
        <li>Gear reduction limits ground speed.</li>
        <li>Measured top speed: <strong>~1.2 m/s</strong>.</li>
        <li>Speed reduces proportionally with payload.</li>
      </ul>
    </div>

    {/* 10.6 Navigation Accuracy */}
    <div className="bg-indigo-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-indigo-900 mb-4">Navigation Accuracy</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Figure-8 test: ±5 cm of line-center in 9/10 trials.</li>
        <li>Encoderless dead-reckoning drift: ~10% after 20 m.</li>
      </ul>
    </div>

    {/* 10.7 Obstacle Avoidance */}
    <div className="bg-orange-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-orange-900 mb-4">Obstacle Avoidance</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Stops within <strong>0.2 s</strong> at 30 cm.</li>
        <li>Hit-rate &lt;5% in 20 randomized runs.</li>
      </ul>
    </div>

    {/* 10.8 Payload Test */}
    <div className="bg-pink-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-pink-900 mb-4">Payload Test</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Static: <strong>80 kg</strong> capacity verified.</li>
        <li>Dynamic: 40–50 kg without instability.</li>
        <li>Minor sag in IR mount at high loads; reinforcement planned.</li>
      </ul>
    </div>

    {/* 10.9 Test Rigs */}
    <div className="bg-gray-50 rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Rigs</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Black-line track mat for calibration.</li>
        <li>Oscilloscope used for PWM validation.</li>
        <li>Battery discharge profiled with wattmeter.</li>
      </ul>
    </div>
  </div>
    </Section>
  );
}



