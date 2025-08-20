import React from 'react';
import Section from './Sections';
import { Cpu } from 'lucide-react';

export default function SystemArchitecture({ number }: { number: number }) {
  return (
    <Section id="system-architecture" number={number} title="System Architecture" Icon={Cpu}>
      <div className="prose prose-lg max-w-none">

{/* 4.1 Block Diagram Overview */}
<div className="bg-blue-50 rounded-lg p-6 mb-8">
<h3 className="text-2xl font-semibold text-gray-900 mb-4">4.1 Block Diagram Overview</h3>
<p className="text-gray-700 mb-4">
BI1 Serving Robot follows a <strong>multi-controller architecture</strong>, with layered control across communication, perception, and motion.
</p>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li><strong>Voice commands</strong> → Sinric Pro (cloud) → Arduino R4 (Sender) → R4 (Receiver) → <strong>Arduino Mega 2560</strong> (Master Controller)</li>
<li>The Mega 2560 controls:
<ul className="list-disc pl-6 mt-2">
<li>Mobility (via Cytron motor drivers and DC motors)</li>
<li>Manipulator arm (270° servos)</li>
<li>Navigation sensors (IR + ultrasonic)</li>
<li>Remote interface inputs (RC, Wi-Fi)</li>
</ul>
</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-4">Core Modules</h4>
<div className="overflow-x-auto mb-8">
<table className="min-w-full border border-gray-200 text-sm bg-white rounded-lg shadow">
<thead className="bg-indigo-100">
<tr>
<th className="border px-4 py-2 text-left">Module</th>
<th className="border px-4 py-2 text-left">Input / Trigger</th>
<th className="border px-4 py-2 text-left">Output / Action</th>
</tr>
</thead>
<tbody>
<tr>
<td className="border px-4 py-2">Voice Interface</td>
<td className="border px-4 py-2">Alexa / Google → Sinric → Arduino R4</td>
<td className="border px-4 py-2">Motor or servo actions on Mega</td>
</tr>
<tr className="bg-gray-50">
<td className="border px-4 py-2">Line-Follower</td>
<td className="border px-4 py-2">8x IR sensors</td>
<td className="border px-4 py-2">Steering adjustments via PID</td>
</tr>
<tr>
<td className="border px-4 py-2">Obstacle Avoidance</td>
<td className="border px-4 py-2">HC-SR04 ultrasonic sensors</td>
<td className="border px-4 py-2">Stop / reroute routine</td>
</tr>
<tr className="bg-gray-50">
<td className="border px-4 py-2">Manual Override</td>
<td className="border px-4 py-2">FS-i6 RC / Wi-Fi app</td>
<td className="border px-4 py-2">Joystick or button input → PWM & Servo</td>
</tr>
<tr>
<td className="border px-4 py-2">Manipulation</td>
<td className="border px-4 py-2">Commanded via Mega or button input</td>
<td className="border px-4 py-2">Arm deploy / retract / deliver</td>
</tr>
</tbody>
</table>
</div>
</div>

{/* 4.2 Data Flows & Protocols */}
<div className="bg-green-50 rounded-lg p-6 mb-8">
<h3 className="text-2xl font-semibold text-gray-900 mb-4">4.2 Data Flows & Protocols</h3>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Wi-Fi (UDP)</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>The <strong>R4 Sender</strong> opens a <strong>UDP listener</strong> on a fixed port.</li>
<li>The <strong>React Native app</strong> sends motion commands (e.g. <code>forward, speed=50</code>) as UDP datagrams.</li>
<li>No authentication in v1 — commands are accepted from any client on the same network.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Sinric Pro (MQTT over WebSockets)</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>R4 Sender uses <strong>SinricPro Arduino SDK</strong> to connect securely to the cloud.</li>
<li>Voice command triggers event (e.g. <code>SetPowerState</code>).</li>
<li>Callback formats command string (e.g. <code>CMD:GO, DEST=A</code>) and forwards via <strong>Serial1</strong>.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">UART Serial</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>Sender ↔ Receiver: 19200 bps over <code>Serial1</code></li>
<li>Receiver ↔ Mega 2560: 19200 bps over USB/TTL</li>
<li>Protocol: Comma-separated or JSON-style strings, newline terminated.</li>
</ul>
<pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-6">
CMD:GO,DEST=A\n
</pre>

<h4 className="text-xl font-semibold text-gray-900 mb-2">RC (PWM)</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li><strong>FS-i6B Receiver</strong> → Mega via PWM inputs.</li>
<li>Channels: CH1 (Fwd/Back), CH2 (Left/Right), CH3 (Line-follow mode), CH4 (Waist), CH5 (Speed).</li>
<li>PWM widths mapped to motor PWM/servo angles.</li>
</ul>
</div>

{/* 4.3 I/O Mapping */}
<div className="bg-yellow-50 rounded-lg p-6 mb-8">
<h3 className="text-2xl font-semibold text-gray-900 mb-4">4.3 I/O Mapping (Arduino Mega)</h3>
<div className="overflow-x-auto mb-8">
<table className="min-w-full border border-gray-200 text-sm bg-white rounded-lg shadow">
<thead className="bg-yellow-100">
<tr>
<th className="border px-4 py-2 text-left">Function</th>
<th className="border px-4 py-2 text-left">Pins Used</th>
</tr>
</thead>
<tbody>
<tr>
<td className="border px-4 py-2">IR Sensor Array</td>
<td className="border px-4 py-2">D22–D29</td>
</tr>
<tr className="bg-gray-50">
<td className="border px-4 py-2">Ultrasonic Sensors</td>
<td className="border px-4 py-2">D30–D33</td>
</tr>
<tr>
<td className="border px-4 py-2">Motor Drivers (Cytron)</td>
<td className="border px-4 py-2">D2–D13</td>
</tr>
<tr className="bg-gray-50">
<td className="border px-4 py-2">Servos (Arm/Base)</td>
<td className="border px-4 py-2">D4, D5, D6…</td>
</tr>
<tr>
<td className="border px-4 py-2">UART Serial</td>
<td className="border px-4 py-2">TX/RX, 19200 bps</td>
</tr>
</tbody>
</table>
</div>
</div>

{/* 4.4 Firmware Module Interaction */}
<div className="bg-purple-50 rounded-lg p-6 mb-8">
<h3 className="text-2xl font-semibold text-gray-900 mb-4">4.4 Firmware Module Interaction</h3>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Line-Follower Module</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>Reads IR array (8-bit digital input).</li>
<li>Computes line deviation.</li>
<li>Runs <strong>PID control loop</strong> for steering.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Obstacle Avoidance</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>Uses ultrasonic sensors.</li>
<li>If distance &lt; threshold → stop or detour.</li>
<li>Optional buzzer/alert.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Voice / Command Processor</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>Parses commands (<code>CMD:...</code>).</li>
<li>Executes sequence: navigate → manipulate → wait.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Waist Rotation Module</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>Controls chassis rotation via continuous servos.</li>
<li>Used for precise orientation.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Cobot Arm Module</h4>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>3-DOF arm with 270° servos.</li>
<li>Supports deploy, pick, tilt tray, stow.</li>
</ul>

<h4 className="text-xl font-semibold text-gray-900 mb-2">Control / State Machine</h4>
<p className="text-gray-700 mb-2">Finite states:</p>
<pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-6">
IDLE → NAVIGATING → OBSTACLE_AVOIDING → DELIVERING → RETURN
</pre>
<ul className="list-disc pl-6 text-gray-700 mb-6">
<li>Prioritizes manual input, autonomous routines, safety interrupts.</li>
</ul>
</div>
</div>
    </Section>
  );
}


