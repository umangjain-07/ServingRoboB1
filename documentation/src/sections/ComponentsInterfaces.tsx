import React from 'react';
import Section from './Sections';
import { Sliders } from 'lucide-react';

export default function ComponentsInterfaces({ number }: { number: number }) {
  return (
    <Section id="components" number={number} title="Components & Interfaces" Icon={Sliders}>
      <div className="prose prose-lg max-w-none">

{/* 5. Hardware Components */}
<h3 className="text-3xl font-bold text-gray-900 mb-8">5. Hardware Components</h3>

<p className="text-gray-700 mb-6">
  The <strong>BI1 Serving Robot</strong> is constructed from a combination of off-the-shelf modules and custom-fabricated parts, selected for performance, availability, and modularity.
</p>

{/* 5.1 Core Electronics */}
<div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
  <h4 className="text-xl font-semibold text-blue-900 mb-4">5.1 Core Electronics</h4>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-blue-200 text-sm bg-white rounded-lg shadow">
      <thead className="bg-blue-100">
        <tr>
          <th className="border px-4 py-2 text-left">Component</th>
          <th className="border px-4 py-2 text-left">Specification</th>
          <th className="border px-4 py-2 text-left">Function</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2"><strong>Arduino Mega 2560</strong> (Master MCU)</td>
          <td className="border px-4 py-2">ATmega2560, 8-bit, 16 MHz, 54× Digital I/O (15 PWM), 16× Analog, 4× UART</td>
          <td className="border px-4 py-2">Central controller, coordinates all subsystems</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="border px-4 py-2"><strong>Arduino UNO R4 WiFi (x2)</strong></td>
          <td className="border px-4 py-2">Renesas RA4M1 (Cortex-M4 @ 48 MHz), 32 KB SRAM, 256 KB Flash, ESP32-S3 Wi-Fi/Bluetooth</td>
          <td className="border px-4 py-2"><strong>Sender:</strong> SinricPro + app commands<br /><strong>Receiver:</strong> Forwards UDP to Mega</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

{/* 5.2 Drive System */}
<div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
  <h4 className="text-xl font-semibold text-green-900 mb-4">5.2 Drive System</h4>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-green-200 text-sm bg-white rounded-lg shadow">
      <thead className="bg-green-100">
        <tr>
          <th className="border px-4 py-2 text-left">Component</th>
          <th className="border px-4 py-2 text-left">Specification</th>
          <th className="border px-4 py-2 text-left">Function</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2"><strong>MY1016 DC Motors (x2)</strong></td>
          <td className="border px-4 py-2">24 V, 250 W brushed, ~3100 RPM, #25H chain sprocket (11T)</td>
          <td className="border px-4 py-2">Main drive motors</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="border px-4 py-2"><strong>Cytron MDDS30A Motor Drivers</strong></td>
          <td className="border px-4 py-2">Dual channel, 30 A continuous, 7–35 V</td>
          <td className="border px-4 py-2">PWM speed + direction control</td>
        </tr>
        <tr>
          <td className="border px-4 py-2"><strong>NEMA 34 Stepper + DMA860A Driver</strong></td>
          <td className="border px-4 py-2">Bipolar stepper, 8.5 Nm, 8.5 A microstepping driver</td>
          <td className="border px-4 py-2">Waist rotation for robot base</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

{/* 5.3 Sensors & Input Devices */}
<div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
  <h4 className="text-xl font-semibold text-yellow-900 mb-4">5.3 Sensors & Input Devices</h4>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-yellow-200 text-sm bg-white rounded-lg shadow">
      <thead className="bg-yellow-100">
        <tr>
          <th className="border px-4 py-2 text-left">Component</th>
          <th className="border px-4 py-2 text-left">Specification</th>
          <th className="border px-4 py-2 text-left">Function</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2"><strong>IR Sensor Array (x3)</strong></td>
          <td className="border px-4 py-2">Digital black/white detection, adjustable LED intensity</td>
          <td className="border px-4 py-2">Line following</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="border px-4 py-2"><strong>HC-SR04 Ultrasonic</strong></td>
          <td className="border px-4 py-2">5 V, 2 cm–2 m range, ±3 mm accuracy</td>
          <td className="border px-4 py-2">Obstacle detection</td>
        </tr>
        <tr>
          <td className="border px-4 py-2"><strong>FlySky FS-i6 + FS-iA6B</strong></td>
          <td className="border px-4 py-2">2.4 GHz, 6-channel, AFHDS2A</td>
          <td className="border px-4 py-2">Manual RC control</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

{/* 5.4 Power System */}
<div className="bg-red-50 rounded-xl p-6 mb-8 shadow">
  <h4 className="text-xl font-semibold text-red-900 mb-4">5.4 Power System</h4>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-red-200 text-sm bg-white rounded-lg shadow">
      <thead className="bg-red-100">
        <tr>
          <th className="border px-4 py-2 text-left">Component</th>
          <th className="border px-4 py-2 text-left">Specification</th>
          <th className="border px-4 py-2 text-left">Function</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2"><strong>Custom Li-ion Battery Pack</strong></td>
          <td className="border px-4 py-2">~15S (~54.75 V nominal)</td>
          <td className="border px-4 py-2">Main power supply</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="border px-4 py-2"><strong>BMS Modules</strong></td>
          <td className="border px-4 py-2">Over/under-voltage, over-current protection, balancing</td>
          <td className="border px-4 py-2">Battery management</td>
        </tr>
        <tr>
          <td className="border px-4 py-2"><strong>Buck Converters</strong></td>
          <td className="border px-4 py-2">55 V→12 V + 12 V→5 V</td>
          <td className="border px-4 py-2">Low-voltage rails for logic/sensors</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

{/* 5.5 Actuators */}
<div className="bg-purple-50 rounded-xl p-6 mb-8 shadow">
  <h4 className="text-xl font-semibold text-purple-900 mb-4">5.5 Actuators</h4>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-purple-200 text-sm bg-white rounded-lg shadow">
      <thead className="bg-purple-100">
        <tr>
          <th className="border px-4 py-2 text-left">Component</th>
          <th className="border px-4 py-2 text-left">Specification</th>
          <th className="border px-4 py-2 text-left">Function</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2"><strong>360° Continuous-Rotation Servos (x2)</strong></td>
          <td className="border px-4 py-2">Heavy-duty</td>
          <td className="border px-4 py-2">Base rotation</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="border px-4 py-2"><strong>270° Standard Servos (x3)</strong></td>
          <td className="border px-4 py-2">High-torque</td>
          <td className="border px-4 py-2">Shoulder, elbow, wrist tilt (cobot arm)</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

{/* 5.6 Structural & Miscellaneous */}
<div className="bg-gray-50 rounded-xl p-6 mb-8 shadow">
  <h4 className="text-xl font-semibold text-gray-900 mb-4">5.6 Structural & Miscellaneous</h4>
  <ul className="list-disc pl-6 text-gray-700 space-y-2">
    <li><strong>Chassis:</strong> PVC sun board + acrylic plates, reinforced with aluminum pipes & modular GIGO blocks</li>
    <li><strong>Wheel Mounting:</strong> Ball-bearing supported axles</li>
    <li><strong>Wiring:</strong> Modular layout, per-board prototyping for PCBs</li>
    <li><strong>Accessories:</strong> Switches (main power & emergency stop), LEDs, heat sinks, ventilation ports, connectors, chains, fasteners</li>
  </ul>
</div>
</div>
    </Section>
  );
}

