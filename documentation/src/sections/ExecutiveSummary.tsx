import React from 'react';
import Section from './Sections';
import { FileText } from 'lucide-react';

export default function ExecutiveSummary({ number }: { number: number }) {


  
  return (
    <Section id="executive-summary" number={number} title="Executive Summary" Icon={FileText}>
      <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>BI1 (Bot I)</strong> is a first-generation, indoor mobile serving robot prototype (Version 1.0), purpose-built to demonstrate autonomous retrieval and delivery of payloads—such as beverages, documents, and small items—via <strong>voice control, mobile app commands, and manual override</strong>. Designed with a strong emphasis on modularity, cost-efficiency, and extensibility, BI1 targets semi-structured environments such as <strong>schools, research labs, offices, and light industrial floors</strong>.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At its core, BI1 utilizes a <strong>three-layered control architecture</strong>:
              </p>

              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>A <strong>central controller</strong>: <strong>Arduino Mega 2560</strong> (serving as the master node),</li>
                <li>Two <strong>peripheral nodes</strong>: <strong>Arduino Uno R4 boards</strong>, which act as communication and actuator sub-controllers,</li>
                <li>A unified communication framework involving <strong>serial UART links</strong> and <strong>WiFi-based UDP</strong>.</li>
              </ul>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                The robot responds to <strong>natural voice commands</strong> via <strong>Google Assistant or Amazon Alexa</strong>, enabled through integration with the <strong>Sinric Pro IoT cloud platform</strong>, and is further operable through a <strong>custom React Native mobile app</strong> and a <strong>FlySky FS-i6 2.4 GHz RC system</strong> for manual fallback control.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.1 Key Functional Highlights</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span><strong>Multi-modal Command Interface</strong>: Voice (via Sinric Pro), custom app, and RC transmitter.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span><strong>Indoor Navigation</strong>: IR-based line following using an <strong>RLS-08 reflectance sensor array</strong>, with fallback ultrasonic obstacle avoidance via <strong>dual HC-SR04 sensors</strong> (effective range: 2–400 cm).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span><strong>Payload Manipulation</strong>: A <strong>retractable 3-DOF collaborative robotic (cobot) arm</strong> and <strong>motorized rotating base</strong>, enabling stable object placement and retrieval.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span><strong>Mobility Platform</strong>: Dual <strong>250W MY1016 brushed DC motors</strong> driving the rear wheels via <strong>chain-drive transmission</strong>, controlled by <strong>Cytron MD13S motor drivers</strong> for precise torque and direction.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span><strong>Heavy-Duty Chassis</strong>: Custom-built frame using <strong>sunboard panels, acrylic sheets, and modular GIGO plastic blocks</strong>, and base supporting up to <strong>80 kg payload capacity</strong>.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.2 Power System Overview</h3>
                <p className="text-gray-700">
                  BI1 is powered by a <strong>custom 55.5V Li-ion battery pack</strong> (group of custom built 12v packs) with <strong>integrated Battery Management System (BMS)</strong> for cell balancing, short-circuit protection, and over-discharge cutoff. Voltage rails are stepped down via onboard <strong>buck converters</strong> to 12 V (for motors) and 5 V (for logic-level electronics).
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.3 System Integration & Control</h3>
                <p className="text-gray-700 mb-4">A high-level overview of the system includes:</p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li><strong>Voice Command → Sinric Pro Cloud → Arduino R4 (WiFi) → Arduino Mega 2560 (via UART) → Motion/Arm Actions</strong></li>
                  <li><strong>App or RC input → Arduino Mega 2560 → Real-time control logic</strong></li>
                  <li>Communication uses a <strong>UDP-based WiFi protocol</strong> between R4 boards for lightweight, low-latency data exchange.</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.4 Prototype Status (v1.0)</h3>
                <p className="text-gray-700 mb-4">BI1 has been successfully validated under lab conditions and demonstrates the following baseline capabilities:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">📍</span>
                    <span>Delivery to two preconfigured destinations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">📡</span>
                    <span>Autonomous IR-guided path tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">🛑</span>
                    <span>Real-time obstacle avoidance with safety stop</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">🎮</span>
                    <span>Seamless switching between voice/app/manual modes</span>
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  This v1 prototype establishes a <strong>robust baseline architecture</strong> for ongoing development. Subsequent versions (v2 to v10) are projected to incorporate <strong>AI-based vision, SLAM navigation, omnidirectional mobility, dynamic mapping, and cloud robotics features</strong>.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1.5 Document Scope</h3>
                <p className="text-gray-700">
                  This documentation presents an exhaustive breakdown of BI1's system architecture, hardware specifications, firmware logic, navigation strategy, power design, and test benchmarks. It serves both as a <strong>technical reference</strong> and a <strong>development roadmap</strong> for future iterations toward an industrial-grade service robot.
                </p>
              </div>
      </div>
    </Section>
  );
}



