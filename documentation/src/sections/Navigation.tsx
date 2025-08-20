import React from 'react';
import Section from './Sections';
import { Radar } from 'lucide-react';

export default function Navigation({ number }: { number: number }) {
  return (
    <Section id="navigation" number={number} title="Navigation & Control" Icon={Radar}>
       <div className="space-y-8">
    {/* Intro */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-200/50 shadow-sm">
      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 ring-1 ring-orange-300/40">
        Overview
      </span>
      <p className="mt-3 text-gray-800">
        BI1’s navigation integrates <strong className="text-orange-700">autonomous line-following</strong>, 
        <strong className="text-amber-700"> obstacle avoidance</strong>, and multiple 
        <strong className="text-rose-700"> manual override modes</strong> (RC, Wi-Fi, voice). 
        A <strong className="text-indigo-700">finite-state control loop</strong> on the Mega 2560 processes sensor inputs in real time.
      </p>
    </div>

    {/* 7.1 Line-Following */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200/60 shadow-sm">
      <h3 className="text-2xl font-semibold text-orange-800 mb-2">7.1 Line-Following Algorithm</h3>
      <p className="text-gray-700">
        The <span className="font-semibold text-orange-700">IR sensor array</span> uses a PID lane-keeping loop.
      </p>
      <ol className="list-decimal pl-6 text-gray-700 mt-4 space-y-2">
        <li><span className="font-semibold">Read IR array</span> → compute line error.</li>
        <li>
          If <code className="px-1 rounded bg-orange-100 text-orange-800">error = 0</code> → 
          <span className="ml-1 font-semibold text-amber-700">LostLine Mode</span> (slow, zig-zag search).
        </li>
        <li>
          <span className="font-semibold text-orange-700">PID:</span>{" "}
          <code className="px-1 rounded bg-slate-100 text-slate-800">adjustment = Kp*error + Ki*integral + Kd*(error - lastError)</code>
        </li>
        <li>
          PWM: <code className="px-1 rounded bg-slate-100 text-slate-800">Left = baseSpeed - adj</code>{" "}
          <code className="px-1 rounded bg-slate-100 text-slate-800">Right = baseSpeed + adj</code>
        </li>
        <li>Obstacle check via ultrasonic.</li>
        <li>Repeat in <code className="px-1 rounded bg-slate-100 text-slate-800">loop()</code>.</li>
      </ol>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Kp: 20</span>
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Ki: 0.5</span>
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Kd: 15</span>
        <span className="px-2 py-1 text-xs rounded-full bg-lime-100 text-lime-800">Base: 80–100</span>
      </div>

      <pre className="mt-4 bg-slate-900 text-emerald-300 p-4 rounded-lg overflow-x-auto text-sm">
{`loop:
  error = readLineError()
  adjustment = Kp*error + Ki*integral + Kd*(error - lastError)
  setMotorSpeeds(baseSpeed - adjustment, baseSpeed + adjustment)

  if (ultrasonicDetectsObstacle()):
      enterObstacleAvoidance()`}
      </pre>
    </div>

    {/* 7.2 Obstacle Avoidance */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 shadow-sm">
      <h3 className="text-2xl font-semibold text-red-800 mb-2">7.2 Obstacle Avoidance</h3>
      <p className="text-gray-700">Triggered when distance &lt; <span className="font-semibold text-red-700">30 cm</span>.</p>
      <ol className="list-decimal pl-6 text-gray-700 mt-3 space-y-2">
        <li><span className="font-semibold">DETECT</span> – distance below threshold.</li>
        <li><span className="font-semibold">REACT</span> – stop wheels, buzzer on, wait 2s.</li>
        <li><span className="font-semibold">EVALUATE</span> – clear → resume; blocked → wait reset.</li>
      </ol>
      <pre className="bg-slate-900 text-cyan-300 p-4 rounded-lg overflow-x-auto text-sm mt-4">
{`LINE_FOLLOW → (distance < 30 cm) → OBSTACLE_STOP → (clear) → LINE_FOLLOW
                                           ↑
                                          (blocked)
                                           ↑
                                         MANUAL_RESET`}
      </pre>
    </div>

    {/* 7.3 Manual Override Modes */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/60 shadow-sm">
      <h3 className="text-2xl font-semibold text-indigo-800 mb-2">7.3 Manual Override Modes</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><span className="font-semibold text-indigo-700">RC Mode</span> — joystick control; interrupts loop.</li>
        <li><span className="font-semibold text-indigo-700">Wi-Fi UDP</span> — mobile app commands.</li>
        <li><span className="font-semibold text-indigo-700">Voice (Sinric Pro)</span> — one-shot tasks.</li>
      </ul>
    </div>

    {/* 7.4 Sinric Pro */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-sm">
      <h3 className="text-2xl font-semibold text-emerald-800 mb-2">7.4 Sinric Pro Integration</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Use Device ID & API key.</li>
        <li>Register callbacks (<code className="bg-emerald-100 text-emerald-800 px-1 rounded">onPowerState</code>, <code className="bg-emerald-100 text-emerald-800 px-1 rounded">onCustomCommand</code>).</li>
      </ul>
      <pre className="mt-3 bg-slate-900 text-emerald-300 p-4 rounded-lg overflow-x-auto text-sm">
{`Alexa Voice → Sinric Cloud → SDK → Callback → Serial CMD → Mega → Nav Sequence`}
      </pre>
      <h4 className="text-sm font-semibold text-emerald-700 mt-4">Example JSON</h4>
      <pre className="bg-slate-900 text-sky-300 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "action": "SetPowerState",
  "value": "on"
}`}
      </pre>
    </div>

    {/* 7.5 Open Points */}
    <div className="rounded-2xl p-6 bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200/60 shadow-sm">
      <h3 className="text-2xl font-semibold text-fuchsia-800 mb-2">7.5 Open Technical Points</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>PID tuning for different surfaces.</li>
        <li>LostLine recovery in intersections.</li>
        <li>Priority policy for RC/Wi-Fi/Voice clashes.</li>
      </ul>
    </div>
        </div>
    </Section>
  );
}

