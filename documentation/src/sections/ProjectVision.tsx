import React from 'react';
import Section from './Sections';
import { Eye } from 'lucide-react';

export default function ProjectVision({ number }: { number: number }) {
  return (
    <Section id="project-vision" number={number} title="Project Origin & Vision" Icon={Eye}>
      <div className="prose prose-lg max-w-none">
  <div className="bg-green-50 rounded-lg p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 Motivation</h3>
    <p className="text-gray-700 mb-4">
      The <strong>BI1 project</strong> originated from a team of <strong>electrical and computer engineering students and researchers</strong> driven by the vision of <strong>automating repetitive service tasks</strong> in daily environments such as schools, offices, and laboratories. The team was inspired by the growing integration of <strong>robotics in non-manufacturing sectors</strong>, particularly in <strong>hospitality, healthcare, and education</strong>.
    </p>
    <p className="text-gray-700 mb-4">
      The initial idea stemmed from the recognition that <strong>human effort is often wasted on routine delivery tasks</strong>—like fetching documents, delivering coffee, or carrying equipment across departments. Commercial service robots already exist, but are <strong>often prohibitively expensive</strong> or lack open-source flexibility. The team set out to build a <strong>low-cost, customizable platform</strong> to:
    </p>
    <ul className="list-disc pl-6 mb-4 text-gray-700">
      <li>Introduce robotics in <strong>educational and R&D settings</strong></li>
      <li>Encourage <strong>DIY and modular extensions</strong></li>
      <li>Reduce operational costs in <strong>small-to-medium enterprises (SMEs)</strong></li>
    </ul>
    <p className="text-gray-700">
      By leveraging their background in <strong>embedded systems, control engineering, and IoT</strong>, the team designed BI1 to be an <strong>open, scalable, and upgradeable robot</strong> that fills the gap between basic hobby robots and expensive commercial units.
    </p>
  </div>

  <div className="bg-blue-50 rounded-lg p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">2.2 Long-Term Vision & Roadmap</h3>
    <p className="text-gray-700 mb-6">
      <strong>BI1 is the first in a multi-version roadmap (v1 → v10)</strong>, envisioned as a progressive evolution toward an industry-ready service robot fleet. Each version builds upon the previous by introducing new hardware capabilities, smarter autonomy, and improved user experience.
    </p>

    <div className="space-y-6">
      <div className="border-l-4 border-green-500 pl-4">
        <h4 className="font-semibold text-gray-900 mb-2">Short-Term Goals (v1 – v2)</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>IR line-following navigation (RLS-08)</li>
          <li>Basic voice control via Alexa / Google Assistant (Sinric Pro)</li>
          <li>Dual-location delivery (Room A and Room B)</li>
          <li>Manual override through RC or Android App</li>
          <li>Payload: Up to 80 kg on basic terrain</li>
        </ul>
      </div>

      <div className="border-l-4 border-yellow-500 pl-4">
        <h4 className="font-semibold text-gray-900 mb-2">Mid-Term Expansion (v3 – v5)</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Vision-based SLAM (Camera + LiDAR)</li>
          <li>Omni-wheel chassis for full 2D freedom</li>
          <li>Voice-command memory and feedback</li>
          <li>Multi-room delivery (up to 10 destinations)</li>
          <li>Human-following and dynamic re-routing</li>
          <li>Auto-charging and station docking</li>
        </ul>
      </div>

      <div className="border-l-4 border-purple-500 pl-4">
        <h4 className="font-semibold text-gray-900 mb-2">Long-Term Vision (v6 – v10)</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Cloud-integrated swarm/fleet behavior</li>
          <li>AI-based object detection, semantic understanding</li>
          <li>IoT integration with smart buildings (access control, elevators)</li>
          <li>Payload expansion beyond 100 kg</li>
          <li>Web dashboard for remote task assignment</li>
          <li>Modular add-ons: drawers, elevator arms, trays</li>
        </ul>
      </div>
    </div>

    <p className="text-gray-700 mt-6">
      The end goal is a <strong>product line of scalable serving robots</strong>: entry-level units for educational labs, and industrial units for logistics and facility automation.
    </p>
  </div>

  <div className="bg-purple-50 rounded-lg p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">2.3 Core Command System</h3>
    <p className="text-gray-700 mb-4">
      BI1 is designed for <strong>intuitive, human-friendly interaction</strong>, primarily through <strong>natural language voice commands</strong>, and backed up by app-based or RC-based manual control.
    </p>

    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Voice-Activated Delivery</h4>
        <p className="text-gray-700 mb-2">
          BI1 integrates with the <strong>Sinric Pro cloud IoT platform</strong>, which maps user voice intents from <strong>Google Assistant or Amazon Alexa</strong> to device-specific API calls.
        </p>
        <p className="text-gray-700 mb-2">Examples:</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>"Bring coffee to Room A"</li>
          <li>"Send delivery to Lab 1"</li>
          <li>"Start robot"</li>
          <li>"Return to base"</li>
        </ul>
        <p className="text-gray-700">
          These commands are parsed into device actions, with intent logic embedded in the Arduino firmware. Each command triggers a <strong>pre-defined actuation sequence</strong>.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Location-Aware Behavior</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Custom delivery logic</strong> for each mapped destination (e.g., speed, turning preference)</li>
          <li>Initial setup includes <strong>two destinations</strong>, expandable to <strong>ten</strong></li>
          <li>Future updates to support <strong>QR-code based precision stops</strong></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Mode Switching</h4>
        <p className="text-gray-700 mb-2">BI1 supports dynamic control handoff:</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Autonomous Mode</strong>: Receives a command, computes path, follows IR line, avoids obstacles, executes delivery</li>
          <li><strong>Manual Mode</strong>: Operator can override any time via:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Bluetooth/WiFi Android app</strong></li>
              <li><strong>FlySky 2.4 GHz RC remote</strong></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
    </Section>
  );
}


