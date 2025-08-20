import React from 'react';
import Section from './Sections';
import { Zap } from 'lucide-react';

export default function FunctionalScope({ number }: { number: number }) {
  return (
    <Section id="functional-scope" number={number} title="Functional Scope" Icon={Zap}>
      <div className="prose prose-lg max-w-none">
  <div className="bg-blue-50 rounded-lg p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 Voice-Control Workflow</h3>
    <p className="text-gray-700 mb-4">
      BI1 supports hands-free task execution via cloud-based voice assistant integration. The control pipeline follows a multi-layered architecture involving:
    </p>

    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Architecture:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Sinric Pro Integration</strong>: BI1 is registered as a custom IoT device on the Sinric Pro platform. This service bridges voice assistants (Amazon Alexa, Google Assistant) with local device endpoints via internet-based JSON messaging.</li>
          <li><strong>Event Flow</strong>:
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>User speaks a predefined phrase (e.g., "Bring water to Room A") to the voice assistant.</li>
              <li>Sinric parses the phrase into a structured JSON event.</li>
              <li>Event is sent over Wi-Fi to the Arduino UNO R4 WiFi module.</li>
              <li>R4 serially forwards the decoded instruction to the Mega 2560 for execution.</li>
            </ol>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Design Notes:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Recognizer Limits</strong>: Current implementation is restricted to fixed phrases and keyword-triggered routines. Natural Language Understanding (NLU) is not supported.</li>
          <li><strong>Extensibility</strong>:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Additional voice intents can be added via the Sinric Pro dashboard (visual editor or direct API calls).</li>
              <li>Sinric's free tier permits up to 3 devices; BI1 currently uses one custom device, with expansion available for multi-function integration (e.g., lights, tray arms, docking logic).</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div className="bg-green-50 rounded-lg p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">3.2 Line-Following Navigation</h3>
    <p className="text-gray-700 mb-4">
      BI1 achieves basic autonomous movement using tape or paint-guided floor paths, following dark lines on light surfaces.
    </p>

    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Hardware:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Sensor</strong>: RLS-08 sensor array (8-channel IR).</li>
          <li><strong>Mounting</strong>: Positioned at front-center base; 10–15 mm above surface.</li>
          <li><strong>Line Specs</strong>: Designed to detect black lines approximately 10 mm wide.</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Software:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Bit Pattern Mapping</strong>: The array outputs an 8-bit binary pattern indicating the line's position relative to the robot's center.</li>
          <li><strong>Error Computation</strong>: The deviation (error) is calculated based on center alignment of the active sensors.</li>
          <li><strong>PID Control</strong>: Proportional–Integral–Derivative (PID) algorithm adjusts motor speeds to minimize lateral deviation and ensure smooth curve tracking.</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Tuning:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Brightness Control</strong>: Adjustable via onboard potentiometer.</li>
          <li><strong>Thresholding</strong>: Configured per floor reflectance to distinguish line vs background.</li>
        </ul>
      </div>
    </div>
  </div>

  <div className="bg-yellow-50 rounded-lg p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">3.3 Obstacle Avoidance</h3>
    <p className="text-gray-700 mb-4">
      To prevent collisions during autonomous operation, BI1 uses ultrasonic sensors to measure and respond to nearby objects.
    </p>

    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Sensors:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Model</strong>: HC-SR04 ultrasonic distance sensors.</li>
          <li><strong>Mounting</strong>: Front (primary) and side-facing (secondary).</li>
          <li><strong>Range</strong>: 2 cm to 400 cm with ±3 mm accuracy.</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Logic:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Safety Threshold</strong>: Slowing condition set at &lt;100 cm.</li>
          <li><strong>Modes</strong>:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Normal</strong>: Continue line-following.</li>
              <li><strong>Approach</strong>: Begin slowing if an object is within 100cm.</li>
              <li><strong>Obstacle Detected</strong>: Pause or detour if under threshold; optional alarm via buzzer.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Implementation:</h4>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Integrated within a <strong>state machine</strong> running on the Mega 2560 firmware.</li>
          <li>State transitions:
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Normal (no obstacle)</li>
              <li>Deceleration</li>
              <li>Pause and wait</li>
              <li>Detour or manual intervention</li>
            </ol>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div className="bg-purple-50 rounded-lg p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">3.4 Remote Override & Manual Control</h3>
    <p className="text-gray-700 mb-4">
      BI1 allows real-time control by human operators for testing, intervention, or navigation in unstructured environments.
    </p>

    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 mb-2">Modes of Operation:</h4>
      
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h5 className="font-semibold text-gray-900 mb-2">1. RC Manual (FlySky FS-i6):</h5>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>6-channel 2.4 GHz transmitter with AFHDS2A protocol.</li>
            <li>Controlled parameters: drive speed, steering, arm movement.</li>
            <li>PWM outputs on Mega mapped to channels via standard receiver input.</li>
            <li>Effective range: 1–2 km (line of sight).</li>
          </ul>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h5 className="font-semibold text-gray-900 mb-2">2. Wi-Fi UDP App (React Native):</h5>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Custom mobile application with virtual joystick and control buttons.</li>
            <li>Sends UDP commands to Arduino UNO R4 over LAN.</li>
            <li>Commands are translated into serial packets and parsed by the Mega.</li>
          </ul>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h5 className="font-semibold text-gray-900 mb-2">3. Hybrid Override:</h5>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Default mode is autonomous (voice/Sinric).</li>
            <li>At any point, a toggle or interrupt command allows seamless switching to RC or mobile control.</li>
            <li>Useful for rescue scenarios, testing, or operation in unmapped areas.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
    </Section>
  );
}


