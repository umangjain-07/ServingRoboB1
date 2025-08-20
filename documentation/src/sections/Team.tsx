import React from 'react';
import Section from './Sections';
import { Users } from 'lucide-react';

export default function Team({ number }: { number: number }) {
  return (
    <Section id="team" number={number} title="Team & Timeline" Icon={Users}>
      <div className="prose prose-lg max-w-none">
    {/* 12.1 Team Roles */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Team Roles (6 Members)</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-4">
        <li><strong>Adi Joshi – Mechanical Designer</strong><br />Chassis structure, frame strength, and stability.</li>
        <li><strong>Umang Jain – Firmware & Control Systems</strong><br />Arduino/embedded code for navigation, sensors, motor control.</li>
        <li><strong>Ashish Mahato – Electrical Engineer</strong><br />Wiring, power distribution, battery management, PCB integration.</li>
        <li><strong>Prince Sen – Technical Support & Assembly</strong><br />Build support, integration, and testing logistics.</li>
        <li><strong>Amar Dubey – Backend Developer</strong><br />Backend services, comm protocols, and data logging.</li>
        <li><strong>Abhi Raghuvanshi – App Developer</strong><br />React Native app for control, monitoring, calibration.</li>
      </ul>
    </div>

    {/* 12.2 Project Timeline */}
    <div className="bg-green-50 rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-green-900 mb-4">Project Timeline (2-Month Plan)</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-4">
        <li><strong>Week 1–2</strong>
          <ul className="list-disc pl-6 space-y-1">
            <li>Finalize conceptual design (mechanical, electrical, control).</li>
            <li>Procure motors, sensors, control boards.</li>
          </ul>
        </li>
        <li><strong>Week 3–4</strong>
          <ul className="list-disc pl-6 space-y-1">
            <li>Assemble chassis & mechanical subsystems.</li>
            <li>Electrical wiring, battery integration, safety checks.</li>
            <li>Initial firmware setup (line-following, calibration).</li>
          </ul>
        </li>
        <li><strong>Week 5–6</strong>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mobile app dev (dashboard, calibration).</li>
            <li>Backend integration for robot-app communication.</li>
            <li>Parallel firmware testing with obstacle detection.</li>
          </ul>
        </li>
        <li><strong>Week 7</strong>
          <ul className="list-disc pl-6 space-y-1">
            <li>System integration: firmware + app + backend.</li>
            <li>Full motion and payload load test.</li>
          </ul>
        </li>
        <li><strong>Week 8</strong>
          <ul className="list-disc pl-6 space-y-1">
            <li>Final testing & calibration.</li>
            <li>Documentation + <strong>Prototype v1.0 demo</strong>.</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
    </Section>
  );
}


