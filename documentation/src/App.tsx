import React from 'react';
import { FileText, Download, ChevronRight, Zap, Shield, Cpu, Wifi, Battery, Navigation, Eye, Brain, Cloud, Layers,  Code, Sliders, Radar, BatteryCharging, Box, Gauge, Wrench, Users, BookOpen  } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



const App: React.FC = () => {
  const exportToPDF = async () => {
    const element = document.getElementById('documentation-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const [menuOpen, setMenuOpen] = React.useState(false);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('BI1_Bot_I_Documentation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'executive-summary', title: 'Executive Summary', icon: FileText },
    { id: 'project-vision', title: 'Project Origin & Vision', icon: Eye },
    { id: 'functional-scope', title: 'Functional Scope', icon: Zap },
    { id: 'system-architecture', title: 'System Architecture', icon: Cpu },
    { id: 'components', title: 'Components & Interfaces', icon: Sliders },
    { id: 'firmware', title: 'Firmware and Codebase', icon: Code },
    { id: 'navigation', title: 'Navigation & Sensors', icon: Radar },
    { id: 'power', title: 'Power & Battery', icon: BatteryCharging },
    { id: 'payload', title: 'Payload & Mechanical Design', icon: Box },
    { id: 'testing', title: 'Testing & Calibration', icon: Gauge },
    { id: 'maintenance', title: 'Maintenance & Safety', icon: Wrench },
    { id: 'team', title: 'Team & Timeline', icon: Users }
  ];
  

  return (
    
    
    <div className="min-h-screen bg-white">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 md:w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto z-20 hidden md:block">

        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BI1 Documentation</h1>
              <p className="text-sm text-gray-600">Technical Specification</p>
            </div>
          </div>

          <button
            onClick={exportToPDF}
            className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>

          <nav className="space-y-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{section.title}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-600" />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-80 ml-0">

        <div id="documentation-content" className="max-w-4xl mx-auto p-8">
          {/* Cover Page */}
          <div className="mb-16 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">BI1 (Bot I)</h1>
            <p className="text-xl text-gray-600 mb-8">First-Generation Indoor Mobile Serving Robot</p>
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto text-sm text-gray-600">
              <div>
                <p className="font-semibold">Version</p>
                <p>1.0</p>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Table of Contents</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid gap-3">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-left group"
                    >
                      <span className="text-blue-600 font-semibold w-8">{index + 1}.</span>
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">{section.title}</span>
                      <div className="ml-auto flex-1 border-b border-dotted border-gray-300"></div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Executive Summary */}
          <section id="executive-summary" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">1. Executive Summary</h2>
            </div>

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
          </section>

          {/* Project Origin & Vision */}
          <section id="project-vision" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">2. Project Origin & Vision</h2>
            </div>

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
          </section>

          {/* Functional Scope */}
          <section id="functional-scope" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">3. Functional Scope</h2>
            </div>

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
          </section>

          {/* Remaining sections with placeholder content */}
          <section id="system-architecture" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">4. System Architecture</h2>
            </div>
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

          </section>

          <section id="components" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Sliders className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">5. Components & Interfaces</h2>
            </div>
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


          </section>

          <section id="firmware" className="mb-16">

  {/* Section Header */}
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
      <Code className="w-5 h-5 text-pink-600" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">6. Firmware & Codebase</h2>
  </div>

  {/* Section Body */}
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
</section>


<section id="navigation" className="mb-16">
  {/* Section Header */}
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 ring-1 ring-orange-300/50">
      <Radar className="w-5 h-5 text-orange-700" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">7. Navigation & Control</h2>
  </div>

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
</section>

<section id="power" className="mb-16">
  {/* Header */}
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-rose-200 via-pink-200 to-fuchsia-200 ring-1 ring-rose-300/50">
      <BatteryCharging className="w-5 h-5 text-rose-700" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">8. Power Management</h2>
  </div>

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
</section>

{/* Payload & Mechanical Design */}
<section id="payload" className="mb-16">
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
      <Box className="w-5 h-5 text-teal-600" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">9. Payload & Mechanical Design</h2>
  </div>

  <div className="prose prose-lg max-w-none">
    {/* 9.1 Cobot Arm */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Cobot Arm</h3>
      <p className="text-gray-700 mb-4">
        A 3-DOF articulated robotic arm is integrated into the BI1 platform.
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Mounting</strong>: Installed on a sliding base; retracts into chassis or extends for delivery.</li>
        <li><strong>Actuation</strong>:
          <ul className="list-disc pl-6 space-y-1">
            <li>Joints: 270° digital metal-gear hobby servos (torque & precision).</li>
            <li>Waist extension: NEMA34 stepper with belt drive.</li>
          </ul>
        </li>
        <li><strong>Operation Sequence</strong>:
          <ol className="list-decimal pl-6 space-y-1">
            <li>Sliding base extends the arm.</li>
            <li>Servos position the end-effector.</li>
            <li>Arm retracts & folds back inside chassis.</li>
          </ol>
        </li>
        <li><strong>Mechanics</strong>: Extension via screw drive or rack-and-pinion for stable motion.</li>
      </ul>
    </div>

    {/* 9.2 Base Load Capacity */}
    <div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-green-900 mb-4">Base Load Capacity</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Static Load</strong>: ~80 kg (verified).</li>
        <li><strong>Dynamic Load</strong>: Safe ~40–50 kg during motion.</li>
        <li><strong>Stability</strong>: Wheel bearings distribute weight; low center of mass prevents tipping.</li>
      </ul>
    </div>

    {/* 9.3 Retractable Mechanisms */}
    <div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-yellow-900 mb-4">Retractable Mechanisms</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Sliding Platform</strong>: NEMA34-driven waist extension for linear movement.</li>
        <li><strong>Frame</strong>: Sunboard + aluminum extrusion, modular GIGO-style fastening.</li>
        <li><strong>Covering</strong>: Acrylic enclosures with vent slots for passive cooling.</li>
      </ul>
    </div>

    {/* 9.4 Design Documentation */}
    <div className="bg-purple-50 rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-purple-900 mb-4">Design Documentation</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>CAD Models</strong>: Full frame & arm in SolidWorks.</li>
        <li><strong>Assembly</strong>: Exploded views with structural sequence.</li>
        <li><strong>Dimensions</strong>:
          <ul className="list-disc pl-6 space-y-1">
            <li>Wheelbase: ~600 mm</li>
            <li>Height: ~400 mm</li>
            <li>Arm Reach: ~300 mm (extended)</li>
          </ul>
        </li>
        <li><strong>Mobility</strong>: Ball-bearing wheels + casting plate keep IR sensors at fixed height.</li>
      </ul>
    </div>
  </div>
</section>

{/* Testing & Calibration */}
<section id="testing" className="mb-16">
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
      <Gauge className="w-5 h-5 text-rose-600" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">10. Testing & Calibration</h2>
  </div>

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
</section>

{/* Maintenance & Safety */}
<section id="maintenance" className="mb-16">
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      <Shield className="w-5 h-5 text-gray-700" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">11. Maintenance & Safety</h2>
  </div>

  <div className="prose prose-lg max-w-none">
    {/* 11.1 Routine Checklists */}
    <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Routine Checklists</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Inspect wiring integrity and verify all connectors are secure.</li>
        <li>Clean and realign IR sensors.</li>
        <li>Check ultrasonic sensors for obstructions.</li>
        <li>Tighten servo mounting screws.</li>
        <li>Lubricate wheel bearings.</li>
        <li>Track software updates via Git commits; firmware version must match hardware build.</li>
      </ul>
    </div>

    {/* 11.2 Sensor Recalibration */}
    <div className="bg-green-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-green-900 mb-4">Sensor Recalibration</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Recalibrate IR sensors regularly: clean lenses & adjust potentiometers.</li>
        <li>Run ultrasonic accuracy checks against known distances.</li>
        <li>Planned feature: React Native app command <strong>“Calibrate”</strong> to trigger automated tests.</li>
      </ul>
    </div>

    {/* 11.3 Failsafes */}
    <div className="bg-yellow-50 rounded-xl p-6 mb-8 shadow">
      <h3 className="text-xl font-semibold text-yellow-900 mb-4">Failsafes</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Hardware:</strong> Emergency-stop relay cuts motor power; main switch disconnects battery.</li>
        <li><strong>Software:</strong> Watchdog halts motors if no serial update for &gt;5s.</li>
        <li><strong>Electrical:</strong> Motor drivers have current limiting; firmware halts on over-current faults.</li>
      </ul>
    </div>

    {/* 11.4 Thermal Management */}
    <div className="bg-red-50 rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-red-900 mb-4">Thermal Management</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Heatsinks + vent slots on motor drivers & buck converters.</li>
        <li>Measured temps:
          <ul className="list-disc pl-6 space-y-1">
            <li>Motor drivers: &lt;45 °C under load</li>
            <li>Buck converter: ~50 °C</li>
          </ul>
        </li>
        <li>Fans can be added if needed.</li>
        <li>Planned safety: auto-shutdown if drivers hit <strong>80 °C</strong>.</li>
      </ul>
    </div>
  </div>
</section>

{/* Team & Timeline */}
<section id="team" className="mb-16">
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
      <Users className="w-5 h-5 text-indigo-600" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">12. Team & Timeline</h2>
  </div>

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
</section>




          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2024 BI1 Project Documentation • Version 1.0 • Generated on {new Date().toLocaleDateString()}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;