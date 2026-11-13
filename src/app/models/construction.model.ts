export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  category: string;
  status: 'In Progress' | 'Structural Phase' | 'Finishing & Fitout' | 'Completed' | 'Pre-Construction';
  progress: number;
  area: string;
  budget: string;
  startDate: string;
  completionDate: string;
  safeHours: string;
  image: string;
  description: string;
  highlights: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  photo: string;
  certifications: string[];
  contact: string;
  whatsapp?: string;
}

export interface ChecklistQuestion {
  id: string; // e.g. "1.1", "2.1"
  text: string;
}

export type HseRatingValue = '1' | '2' | '3' | '4' | '5' | 'NA' | '';

export interface ChecklistCategory {
  categoryNumber: number;
  categoryCode: string;
  categoryName: string;
  items: ChecklistQuestion[];
}

export interface FormTemplate {
  id: string;
  title: string;
  code: string;
  category: string;
  description: string;
  isActive: boolean;
  totalItems: number;
  badge: string;
}

export interface SupervisorUser {
  id: string;
  firstName: string;
  surname: string;
  name: string;
  email: string;
  usernameAlias?: string;
  designation: string;
  computerNo: string;
  Language: string;
  Prjname:string;
  contractorName: string;
  phone?: string;
  role: string;
}

export interface SupervisorSession {
  id: string;
  firstName: string;
  surname: string;
  name: string;
  email: string;
  designation: string;
  computerNo: string;
  Language: string;
  Prjname:string;
  contractorName?: string;
  phone?: string;
  role: string;
}

export interface HseInspectionSubmission {
  id: string;
  timestamp: string;
  formTitle: string;
  formCode: string;
  Language: string;
  Prjname:string;
  siteLocation: string;
  date: string;
  supervisorName: string;
  designation: string;
  computerNo: string;
  supervisorSignature: string; // data URL or signature representation
  hseOfficerName: string;
  hseOfficerEmail: string;
  hseOfficerWhatsapp: string;
  ppeAdherence: 'Yes' | 'No';
  checklist: Record<string, HseRatingValue>;
  remarks?: Record<string, string>;
  levelZone:string;
  correctiveActions?: string;
  stats?: {
    totalChecked: number;
        ratedCount: number;
    naCount: number;
    totalMarks: number;
    maxMarks: number;

    scorePercentage: number;
    flaggedItems: string[];
  };
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectInterest?: string;
  message: string;
  subject: string;
}

export const HSE_INSPECTION_CHECKLIST_DATA: ChecklistCategory[] = [
  {
    categoryNumber: 1,
        categoryCode: 'A',
    categoryName: 'HSE Planning, PTW, Documentation and Competency',
    items: [
      { id: '1', text: 'Approved method statement/JSA available and daily TBT conducted' },
      { id: '2', text: 'Applicable Permit to Work (PTW) valid, available and complied' },
      { id: '3', text: 'Safety induction completed and communication barriers adequately controlled' },
      { id: '4', text: 'Operatives, supervisors and specialists competent and appropriately certified' },
      { id: '5', text: 'Simultaneous operations and contractor interfaces effectively coordinated' },
      { id: '6', text: 'Night-work authority permit, supervision and minimum 100 lux lighting provided' },
    ]
  },
  {
    categoryNumber: 2,
     categoryCode: 'B',
    categoryName: 'Emergency, Welfare, Occupational Health and Environment',
    items: [
      { id: '7', text: 'Firefighting equipment, emergency arrangements and trained fire wardens available' },
      { id: '8', text: 'First-aid facilities and trained first aider available' },
      { id: '9', text: 'Rest area, drinking water, toilets and designated smoking area maintained' },
      { id: '10', text: 'Temperature, humidity, wind, fog and rain conditions monitored and controlled' },
      { id: '11', text: 'Noise, vibration and dust controls implemented' },
      { id: '12', text: 'Lighting, ventilation and shading adequate for the work' },
      { id: '13', text: 'Environmental protection, spill prevention and waste segregation/disposal maintained' },
    ]
  },
  {
    categoryNumber: 3,
    categoryCode: 'C',
    categoryName: 'Access, Housekeeping, Material Storage and Hazard Protection',
    items: [
      { id: '14', text: 'Safe access/egress, housekeeping, clear walkways/stairs and slip/trip prevention maintained' },
      { id: '15', text: 'Work layout and available working space adequate and not obstructed' },
      { id: '16', text: 'Loading, unloading and stacking activities safely controlled' },
      { id: '17', text: 'Materials properly stored, secured and protected from weather' },
      { id: '18', text: 'Sharp edges protected and protruding nails removed or made safe' },
      { id: '19', text: 'Falling/flying objects controlled and suitable exclusion zones established' },
      { id: '20', text: 'Openings, hazardous areas and protruding rebars protected with barricades/signage/caps' },
    ]
  },
  {
    categoryNumber: 4,
    categoryCode: 'D',
    categoryName: 'Work at Height, Scaffolding and Temporary Works',
    items: [
      { id: '21', text: 'Edge protection, PFPE and work-at-height rescue arrangements provided' },
      { id: '22', text: 'Scaffolds complete with safe platform, access ladder, guardrails, toe boards and valid scaffold tag' },
      { id: '23', text: 'Ladders/step ladders suitable, inspected, secured and free from defects' },
      { id: '24', text: 'Formwork/falsework supported by approved design, calculations and drawings; competent TWC appointed, PTW and permit-to-load/strike issued, safe access, fall protection and controlled dismantling provided' },
      { id: '25', text: 'Unprotected holes and openings securely covered or guarded to prevent falls and falling objects' },
      { id: '26', text: 'Manual handling, lifting and carrying activities properly assessed and controlled' },
    ]
  },
  {
    categoryNumber: 6,
      categoryCode: 'E',
    categoryName: 'Excavation, Piling',
    items: [
      { id: '27', text: 'Excavation controls include services identification, safe access/egress, edge protection, warning signs, shoring and dewatering' },
      { id: '28', text: 'Piling operations controlled through approved procedures, exclusion zones and competent supervision' },
    ]
  },
  {
    categoryNumber: 7,
     categoryCode: 'F',
    categoryName: 'Tools and Electrical Safety',
    items: [
      { id: '29', text: 'Hand tools, work benches suitable for the intended task, site-fabricated or defective equipment prohibited from use' },
      { id: '30', text: 'Power tools suitable (220V with 30 mA RCD), guarded, inspected and colour coded' },
      { id: '31', text: 'Power-tool PAT tested and users are competent and authorized' },
      { id: '32', text: 'Electrical cables/DBs properly routed, identified, protected and earthed, danger signs and RCD protection provided' },
      { id: '33', text: 'Trapping, impact and entanglement hazards identified and controlled' },
      { id: '34', text: 'Minimum and task-specific PPE/RPE correctly selected, worn and maintained' },
    ]
  },
  {
    categoryNumber: 8,
    
    categoryCode: 'H',
    categoryName: 'Traffic Management and logistics',
    items: [
      { id: '40', text: 'Traffic management includes PUDO, pedestrian segregation, inspection bay and designated parking' },
      { id: '41', text: 'Site roads, haul routes and gates maintained with signages and speed limits enforced' },
      { id: '42', text: 'Material laydown/offloading areas coordinated per the site logistics plan' },
      { id: '43', text: 'Site perimeter fencing/hoarding secure and intact, no gaps, access controlled through manned gates' },
    ]
  },
  {
    categoryNumber: 9,
    categoryCode: 'I',
    categoryName: 'Chemical and Hazardous substances',
    items: [
      { id: '44', text: 'Chemical/COSHH assessments implemented, current SDS available at point of use and communicated to users' },
      { id: '45', text: 'Chemicals stored in designated, ventilated and bunded areas, correctly labelled with incompatible substances segregated' },
      { id: '46', text: 'Spill kits, containment measures and eyewash/washing facilities available, and chemical waste disposed of through approved routes' },
      { id: '47', text: 'Task-specific PPE/RPE for chemical handling selected, worn and maintained, and handlers trained on chemical hazards' },
    ]
  },
  {
    categoryNumber: 10,
    categoryCode: 'J',
    categoryName: 'Hot Work Activities',
    items: [
      { id: '48', text: 'Hot-work PTW, fire watch, flashback arresters and suitable eye/fire protection and other TSPPE provided' },
      { id: '49', text: 'Gas cylinders upright, secured, segregated by type and fitted with regulators, gauges and hoses free from defects' },
      { id: '50', text: 'Combustible materials removed or protected, exclusion zone established and fire blankets/screens provided' },
      { id: '51', text: 'Suitable fire extinguishers available, welding fume/ventilation controls implemented and post-work fire watch maintained' },
      { id: '52', text: 'Hot-work operators (welders, cutters, grinders) competent, certified' },
    ]
  }
];
