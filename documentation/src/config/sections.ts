import { FileText, Eye, Zap, Cpu, Sliders, Code, Radar, BatteryCharging, Box, Gauge, Wrench, Users } from 'lucide-react';

export type SectionDef = {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
};

export const SECTIONS: SectionDef[] = [
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
