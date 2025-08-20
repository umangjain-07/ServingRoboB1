import React from 'react';
import Section from './Sections';
import { Code } from 'lucide-react';

export default function Firmware({ number }: { number: number }) {
  return (
    <Section id="firmware" number={number} title="Firmware & Codebase" Icon={Code}>
     <div className="bg-gray-50 rounded-lg p-8">
  
  <div className="prose prose-lg max-w-none">

    {/* 6.1 Repository Structure */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h4 className="text-xl font-semibold text-blue-900 mb-4">6.1 Repository Structure</h4>
      <p className="text-gray-700 mb-4">
        The <strong>BI1 firmware</strong> is modular, with each Arduino sketch (<code>.ino</code>) dedicated to a specific subsystem:
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-blue-200 text-sm bg-white rounded-lg shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-4 py-2 text-left">File / Folder</th>
              <th className="border px-4 py-2 text-left">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">ServingRoboB1.ino</td>
              <td className="border px-4 py-2">Integrated control for Mega 2560 (navigation, sensors, drive motors).</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border px-4 py-2">Motor.h + Motor.cpp</td>
              <td className="border px-4 py-2">Controls Motors.</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">StepperMotor.h + StepperMotor.cpp</td>
              <td className="border px-4 py-2">Class to control stepper motor.</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border px-4 py-2">Base.h + Base.cpp</td>
              <td className="border px-4 py-2">Combines two motor instances to make the movable base.</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">RemoteControl.h + RemoteControl.cpp</td>
              <td className="border px-4 py-2">Remote control class; takes Base + Stepper instances as input.</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border px-4 py-2 font-semibold">Libraries/</td>
              <td className="border px-4 py-2">Custom and imported libraries.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* 6.2 Integration Process */}
    <div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
      <h4 className="text-xl font-semibold text-green-900 mb-4">6.2 Integration Process</h4>
      <ol className="list-decimal pl-6 text-gray-700 space-y-2">
        <li><strong>Module Development</strong> – Prototyped each feature on its own hardware.</li>
        <li><strong>Library Alignment</strong> – Unified dependencies (SinricPro SDK, Servo, NewPing, WiFiUDP).</li>
        <li><strong>Merge Phase</strong> – Combined nav/sensor/comms into <code>ServingRoboB1.ino</code>.</li>
        <li><strong>Conflict Resolution</strong> – Removed duplicate <code>setup()</code>/<code>loop()</code>, standardized constants.</li>
        <li><strong>Compilation & Optimization</strong> – Reduced Mega SRAM usage via <code>PROGMEM</code>.</li>
        <li><strong>End-to-End Testing</strong> – Verified full command chain with serial console debugging.</li>
      </ol>
    </div>

    {/* 6.3 Evolution History */}
    <div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
      <h4 className="text-xl font-semibold text-yellow-900 mb-4">6.3 Evolution History</h4>
      
      <h5 className="font-semibold text-gray-800 mt-4">Line Following</h5>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li><strong>v0.1</strong> – Threshold-based left/right steering.</li>
        <li><strong>v0.2</strong> – Weighted FEN approach for error calculation.</li>
        <li><strong>v0.3</strong> – Full PID control; IR logic modularized into <code>readIR()</code> + <code>computeError()</code>.</li>
      </ul>

      <h5 className="font-semibold text-gray-800 mt-4">Voice Parsing</h5>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Started with hard-coded command simulation.</li>
        <li>Moved to SinricPro JSON callbacks; expanded parsing to support multiple action types.</li>
      </ul>

      <h5 className="font-semibold text-gray-800 mt-4">Serial/Wi-Fi Communication</h5>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Originally: simple byte polling.</li>
        <li>Now: handshake protocol with <code>&lt;CMD&gt;…\n</code> and <code>ACK\n</code> responses; UDP retry handling for packet loss.</li>
      </ul>

      <h5 className="font-semibold text-gray-800 mt-4">Arm Control</h5>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Initially inactive.</li>
        <li><strong>v1.2</strong> – Scripted "unfold" sequence with blocking delays.</li>
        <li>Current – Non-blocking interpolation for smoother servo transitions.</li>
      </ul>
    </div>

    {/* Code Showcase */}
    <div className="bg-gray-900 text-gray-100 rounded-xl p-6 shadow mb-8">
      <h4 className="text-xl font-semibold text-white mb-4">📂 Code Samples</h4>
      <pre className="overflow-x-auto text-sm">
        <code className="language-cpp">
{`// Example: Motor.h
#ifndef MOTOR_H
#define MOTOR_H

#include <Arduino.h>

class Motor {
int pwmPin, dirPin;

public:
Motor(int pwm, int dir) : pwmPin(pwm), dirPin(dir) {}
void begin() {
  pinMode(pwmPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
}
void forward(int speed) {
  digitalWrite(dirPin, HIGH);
  analogWrite(pwmPin, speed);
}
void stop() {
  digitalWrite(dirPin, LOW);
  analogWrite(pwmPin, 0);
}
};
#endif`}
        </code>
      </pre>
      <p className="text-gray-400 text-sm mt-3">
        ↑ Example of modular <code>Motor.h</code>.  
        Full repo has modules for motors, base, stepper, remote, and networking.
      </p>
    </div>
  </div>
</div> 
    </Section>
  );
}


