import React from 'react';
import { FileText, Download, ChevronRight, Zap, Shield, Cpu, Wifi, Battery, Navigation, Eye, Brain, Cloud, Layers,  Code, Sliders, Radar, BatteryCharging, Box, Gauge, Wrench, Users, BookOpen  } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExecutiveSummary from './sections/ExecutiveSummary';
import ProjectVision from './sections/ProjectVision';
import FunctionalScope from './sections/FunctionalScope';
import SystemArchitecture from './sections/SystemArchitecture';
import ComponentsInterfaces from './sections/ComponentsInterfaces';
import Firmware from './sections/Firmware';
import NavigationSection from './sections/Navigation';
import Power from './sections/Power';
import Payload from './sections/Payload';
import Testing from './sections/Testing';
import Maintenance from './sections/Maintenance';
import Team from './sections/Team';






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

          <ExecutiveSummary number={1} />
          <ProjectVision number={2} />
          <FunctionalScope number={3}/>
          <SystemArchitecture number={4} />
          <ComponentsInterfaces number={5} />
          <Firmware number={6} />
          <NavigationSection number={7} />
          <Power number={8} />
          <Payload number={9} />
          <Testing number={10} />
          <Maintenance number={11} />
          <Team number={12} />


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