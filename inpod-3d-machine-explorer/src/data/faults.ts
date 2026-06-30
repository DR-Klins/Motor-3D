import {
  Activity,
  Bolt,
  Cable,
  Cpu,
  Gauge,
  RadioTower,
  type LucideIcon,
} from 'lucide-react';

export type FaultId =
  | 'bearings'
  | 'coupling'
  | 'electrical'
  | 'driven'
  | 'mounts'
  | 'inpod';

export type ViewMode = 'normal' | 'xray' | 'fault';

export interface FaultInfo {
  id: FaultId;
  title: string;
  cardTitle: string;
  description: string;
  detectedIssues?: string[];
  capabilities?: string[];
  measuredBy?: string[];
  explanation: string;
  alert?: string;
  tagline?: string;
  icon: LucideIcon;
}

export const faults: FaultInfo[] = [
  {
    id: 'bearings',
    title: 'Bearings',
    cardTitle: 'Bearings',
    description: 'High-frequency behaviour around rolling elements and housings.',
    detectedIssues: ['Bearing wear and defects', 'Lubrication problems', 'Looseness'],
    measuredBy: ['High-frequency vibration', 'Overall vibration', 'Temperature trend'],
    explanation:
      'INPOD can identify early bearing degradation by tracking vibration patterns and changes in operating behaviour before failure becomes visible.',
    alert: 'Rising high-frequency vibration detected on the bearing location.',
    icon: Activity,
  },
  {
    id: 'coupling',
    title: 'Coupling',
    cardTitle: 'Coupling',
    description: 'Alignment and shaft-transfer behaviour between motor and machine.',
    detectedIssues: [
      'Angular misalignment',
      'Parallel misalignment',
      'Looseness',
      'Wear or degradation',
      'Unbalance',
    ],
    measuredBy: ['Vibration trend', 'Running speed components', 'Load behaviour'],
    explanation:
      'Coupling faults often create vibration patterns linked to shaft speed. INPOD helps detect these changes early so alignment and mechanical issues can be corrected.',
    alert: 'Possible coupling misalignment trend detected.',
    icon: Cable,
  },
  {
    id: 'electrical',
    title: 'Motor Electrical',
    cardTitle: 'Motor Electrical',
    description: 'Electrical and electromagnetic health inside the motor body.',
    detectedIssues: [
      'Electrical imbalance',
      'Voltage and current issues',
      'Power quality problems',
      'Winding faults',
      'Supply frequency issues',
    ],
    measuredBy: [
      'Voltage',
      'Current',
      'Electrical parameters',
      'Frequency-related behaviour',
    ],
    explanation:
      'INPOD monitors electrical parameters alongside vibration so both mechanical and electrical health can be reviewed from one device.',
    alert: 'Voltage/current imbalance detected across phases.',
    icon: Bolt,
  },
  {
    id: 'driven',
    title: 'Driven Machine',
    cardTitle: 'Driven Machine',
    description: 'Pump or driven equipment behaviour under changing process load.',
    detectedIssues: ['Cavitation', 'Flow-related phenomena'],
    measuredBy: ['Vibration', 'Process behaviour', 'Utilisation trend'],
    explanation:
      'Changes in the driven equipment can appear as abnormal vibration or operating patterns. INPOD helps identify issues linked to pumps, fans, and other driven assets.',
    alert: 'Possible flow-related abnormality detected.',
    icon: Gauge,
  },
  {
    id: 'mounts',
    title: 'Mounts and Foundation',
    cardTitle: 'Mounts',
    description: 'Base stability, foundation condition, and structural response.',
    detectedIssues: ['Foundation looseness', 'Structural resonance'],
    measuredBy: ['Low-frequency vibration', 'Structural behaviour', 'Trend changes'],
    explanation:
      'Loose mounts and structural resonance can amplify machine vibration. INPOD helps detect these conditions before they cause wider asset damage.',
    alert: 'Structural looseness trend increasing.',
    icon: Cpu,
  },
  {
    id: 'inpod',
    title: 'INPOD Device',
    cardTitle: 'INPOD Device',
    description: 'Continuous insight from one compact condition-monitoring unit.',
    capabilities: [
      'Vibration monitoring',
      'Temperature monitoring',
      'Runtime and utilisation',
      'Electrical parameters',
      'Alerts and trending',
    ],
    explanation:
      'One device provides continuous, non-intrusive monitoring to detect early signs of mechanical and electrical faults.',
    tagline: 'One device. Complete insight.',
    icon: RadioTower,
  },
];

export const defaultFault = faults[0];

export const getFault = (id: FaultId) => faults.find((fault) => fault.id === id) ?? defaultFault;
