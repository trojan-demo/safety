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

export interface ChecklistCategory {
  categoryNumber: number;
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
  checklist: Record<string, 'Yes' | 'No' | ''>;
  correctiveActions?: string;
  stats?: {
    totalChecked: number;
    yesCount: number;
    noCount: number;
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
    categoryName: 'Housekeeping/General Access/Egress',
    items: [
      { id: '1.1', text: 'All walkways and workplaces are not obstructed with rubbish, leads, equipment or material at all times' },
      { id: '1.2', text: 'Openings are covered and guarded' },
      { id: '1.3', text: 'No timbers lying around with nails left in' },
      { id: '1.4', text: 'Materials stacked/stored safely' },
      { id: '1.5', text: 'No materials stacked at the slab edges or above the toe board level of working platform' },
      { id: '1.6', text: 'All staircases or work areas clear with sufficient lighting' },
      { id: '1.7', text: 'Dedicated stairways for material and personal movements' },
    ]
  },
  {
    categoryNumber: 2,
    categoryName: 'Working at Height-Scaffolding',
    items: [
      { id: '2.1', text: 'Ladders-free from damage, 5 rungs extended from the platform level, tied and Kept 1 in 4 angle' },
      { id: '2.2', text: 'Mobile towers braked and outriggers set' },
      { id: '2.3', text: 'Unauthorised boarding or cantilever single board platform is not built above the working platform.' },
      { id: '2.4', text: 'Exclusion zone is provided beneath while overhead work is in progress' },
      { id: '2.5', text: 'No scaffold boards, toe boards and guardrails missing from working platforms' },
      { id: '2.6', text: 'Intermediate transoms provided to prevent the sagging' },
      { id: '2.7', text: 'No gaps in the working platform through which materials, equipment or tools could fall' },
      { id: '2.8', text: 'Edge protection provided' },
      { id: '2.9', text: 'Green tag is in place for safe scaffolds and Red tag for incomplete/unsafe scaffolds' },
      { id: '2.10', text: 'Operatives working only on Green Tagged Scaffolding' },
    ]
  },
  {
    categoryNumber: 3,
    categoryName: 'PLANT & EQUIPMENT',
    items: [
      { id: '3.1', text: 'Any plant operated is inspected and in good condition' },
      { id: '3.2', text: 'Plant is operated by authorised person' },
      { id: '3.3', text: 'Lifting equipments, gears, operators certified by the GoK approved third party.' },
      { id: '3.4', text: 'Lifting Operation in compliance with Lifting Permit. Lifting points defined, Tag line attached to the load' },
      { id: '3.5', text: 'Moving parts of plant are suitably protected/guarded' },
      { id: '3.6', text: 'Hand Tools are in good working condition / right tool for the right task' },
    ]
  },
  {
    categoryNumber: 4,
    categoryName: 'PPE (PERSONAL PROTECTIVE EQUIPMENT)',
    items: [
      { id: '4.1', text: 'Operatives wear Safety Helmet, High Visibility Clothing/Vest and Safety Footwear' },
      { id: '4.2', text: 'Job specific PPE provided such as Earplugs, goggles, gloves, mask, harness and lanyard etc' },
    ]
  },
  {
    categoryNumber: 5,
    categoryName: 'SITE SERVICES',
    items: [
      { id: '5.1', text: 'Earth Leakage Circuit Breaker (ELCB)/ Residual Current Device (RCD) provided as appropriate' },
      { id: '5.2', text: 'Live cables not left in water or not obstructing. Cables are suspended/routed correctly' },
      { id: '5.3', text: 'No damaged electrical connections/fittings or electric cables' },
      { id: '5.4', text: 'Underground services identified and protected' },
    ]
  },
  {
    categoryNumber: 6,
    categoryName: 'FIRE',
    items: [
      { id: '6.1', text: 'Fire Emergency procedure, assembly point, Emergency contact Nos. Evacuation routes available' },
      { id: '6.2', text: 'Hot Work Permit is available (Gas cutting, Burning and welding works) for hot works' },
      { id: '6.3', text: 'Fire Extinguisher is available for valid use and all aware of Assembly point' },
      { id: '6.4', text: 'Flash back arrester is fitted with all gas cylinders' },
      { id: '6.5', text: 'Smoking prohibited at site (designated location only)' },
      { id: '6.6', text: 'Aware of First Aid Clinic' },
    ]
  },
  {
    categoryNumber: 7,
    categoryName: 'HEALTH & WELFARE',
    items: [
      { id: '7.1', text: 'Follow PPE/RPE instructions (COSHH) on the labels while using materials e.g. Paints, Cement, etc' },
      { id: '7.2', text: 'Drinking water (cool) is available at all times' },
      { id: '7.3', text: 'Dedicated rest area provided. Operatives do not utilise work area during their rest/break timings' },
      { id: '7.4', text: 'Site is free from unpleasant odour ( urinating etc)' },
      { id: '7.5', text: 'Noise to be less than 80dB' },
      { id: '7.6', text: 'Workers healthy and fit for work' },
      { id: '7.7', text: 'Site toilets & washbasins are clean and sewage water is not overflowing/flooding' },
      { id: '7.8', text: 'Lighting and temperature satisfactory' },
    ]
  },
  {
    categoryNumber: 8,
    categoryName: 'GENERAL and Environment',
    items: [
      { id: '8.1', text: 'No communication barrier' },
      { id: '8.2', text: 'Operatives know emergency numbers/procedures' },
      { id: '8.3', text: 'Job Safety Analysis is specific, Tool Box Talk provided for operatives prior to start any task and is effective' },
      { id: '8.4', text: 'Environment protective measures are in place' },
      { id: '8.5', text: 'Waste management done effectively (oil, fuel, chemicals, construction waste etc' },
    ]
  }
];
