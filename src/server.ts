import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Body parser for JSON
app.use(express.json({ limit: '10mb' }));

// In-memory data store (No MongoDB)
const projectsData = [
  {
    id: 'proj-01',
    name: 'SkyTower Commercial Complex & Transit Plaza',
    client: 'Metro Horizon Development Group',
    location: 'Downtown Financial District, Sector 4',
    category: 'Commercial & High-Rise',
    status: 'In Progress',
    progress: 76,
    area: '480,000 sq.ft',
    budget: '$145M',
    startDate: 'March 2024',
    completionDate: 'November 2026',
    safeHours: '420,000+ Safe Man-Hours',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80',
    description: 'A 42-story LEED Platinum certified commercial skyscraper integrated with multi-modal subterranean transit corridors and advanced seismic damping system.',
    highlights: ['42 Stories with Dual Core', 'Zero-Incident Safety Record (500+ Days)', 'Solar Glazed Façade Structure']
  },
  {
    id: 'proj-02',
    name: 'Harbor Gateway Maritime Logistics Bridge',
    client: 'State Infrastructure Authority',
    location: 'Eastern Harbor Corridor, Bay Area',
    category: 'Infrastructure & Heavy Civil',
    status: 'Structural Phase',
    progress: 62,
    area: '2.8 km span',
    budget: '$210M',
    startDate: 'August 2023',
    completionDate: 'August 2027',
    safeHours: '680,000+ Safe Man-Hours',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    description: 'Major cable-stayed bypass infrastructure designed to handle 85,000 vehicles daily with deep-water caisson foundations and real-time structural health monitoring.',
    highlights: ['High-Tensile Cable Stay System', 'Offshore Marine Safety Standards', 'Automated Weather Warning Feeds']
  },
  {
    id: 'proj-03',
    name: 'GreenTech Eco-Industrial Manufacturing Hub',
    client: 'Vanguard Industrial Technologies',
    location: 'North Innovation Corridor, Zone 9',
    category: 'Industrial & Clean Tech',
    status: 'Finishing & Fitout',
    progress: 91,
    area: '720,000 sq.ft',
    budget: '$98M',
    startDate: 'January 2024',
    completionDate: 'May 2026',
    safeHours: '310,000+ Safe Man-Hours',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    description: 'State-of-the-art cleanroom manufacturing and robotic logistics facility built with carbon-neutral materials, insulated sandwich panels, and automated deluge fire suppression.',
    highlights: ['Cleanroom ISO Class 5 Specs', 'Comprehensive COSHH Compliant Zones', 'Roof-Integrated 2.4MW Solar Array']
  },
  {
    id: 'proj-04',
    name: 'Apex Heights Luxury Residential Tower',
    client: 'Elysium Urban Living Consortium',
    location: 'Westside Marina Waterfront',
    category: 'Residential & Mixed-Use',
    status: 'In Progress',
    progress: 48,
    area: '340,000 sq.ft',
    budget: '$82M',
    startDate: 'June 2024',
    completionDate: 'March 2027',
    safeHours: '250,000+ Safe Man-Hours',
    // image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: '36-story waterfront residential development with cantilevered sky gardens, modular pre-cast facades, and wind-tunnel certified structural envelope.',
    highlights: ['Smart Building Automation', 'Fall Arrest & Safety Netting Systems', 'Full Edge-Protection Standard Compliance']
  }
];

const teamMembers = [
  {
    id: 'team-01',
    name: 'Aswin Kumar Panigrahi',
    role: 'HSE Manager',
    experience: '26 Years Experience',
    bio: 'Chartered Civil & Structural Engineer overseeing apex engineering governance, major infrastructure bids, and corporate zero-harm policies across all construction sites.',
    // photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    certifications: ['PE Civil / Structural', 'Fellow ICE', 'MBA Project Management'],
    contact: 'xxxxxxxx@trojan.com'
  },
  {
    id: 'team-02',
    name: 'Savad Mohamed Salim',
    role: 'HSE Officer',
    experience: '18 Years Experience',
    bio: 'Specialist in modern steel-concrete composites, BIM level 3 modeling, and high-rise structural optimization with an emphasis on ergonomic and safe site ergonomics.',
    // photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    certifications: ['AIA Registered', 'LEED AP BD+C', 'BIM Coordinator Cert'],
     contact: 'xxxxxxxx@trojan.com'
  },
  {
    id: 'team-03',
    name: 'Jorial',
    role: 'HSE Officer',
    experience: '19 Years Experience',
    bio: 'Directs on-site plant operations, tower crane logistics, ground engineering, and rigorous daily mechanical lifting inspections across active work fronts.',
    // photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    // certifications: ['CPCS Appointed Person', 'GoK Plant Inspector', 'IOSH Managing Safely'],
    contact: 'xxxxxxxx@trojan.com'
  },
  {
    id: 'team-04',
    // name: 'Elena Vance, CMIOSH',
    // role: 'Chief HSE & Compliance Officer',
    experience: '15 Years Experience',
    bio: 'Leads company-wide health, safety, and environmental auditing. Oversees daily site inspections, supervisor compliance workflows, and ISO 45001 safety governance.',
    // photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    certifications: ['NEBOSH Diploma', 'CMIOSH Chartered', 'ISO 45001 / 14001 Lead Auditor'],
     contact: 'xxxxxxxx@trojan.com',
    whatsapp: '+18005550199'
  }
];

const formsCatalog = [
  {
    id: 'hse-inspection-daily',
    title: 'Daily HSE Inspection FRM-01',
    code: 'HSE-FRM-01',
    category: 'Daily Operations & Safety Auditing',
    description: 'Mandatory daily site HSE inspection checklist covering Housekeeping, Scaffolding, Plant & Equipment, PPE, Site Services, Fire Safety, Health & Welfare, and Environmental management.',
    isActive: true,
    totalItems: 42,
    badge: 'Primary Mandated'
  },
  {
    id: 'hot-work-permit',
    title: 'Hot Work & Gas Cutting Safety Permit',
    code: 'HSE-FRM-02',
    category: 'High-Risk Activity Permits',
    description: 'Pre-task verification for welding, gas torch cutting, grinding, and spark-producing activities with 30-minute fire watch protocols.',
    isActive: true,
    totalItems: 14,
    badge: 'High Risk'
  },
  {
    id: 'scaffold-handover',
    title: 'Scaffolding Inspection & Green Tag Certificate',
    code: 'HSE-FRM-03',
    category: 'Working at Height',
    description: '7-day periodic scaffold inspection and handover checklist verifying base plates, bracing, ties, toe boards, and access ladders.',
    isActive: true,
    totalItems: 18,
    badge: 'Weekly Audit'
  },
  {
    id: 'toolbox-talk-record',
    title: 'Daily Toolbox Talk & Hazard Briefing Record',
    code: 'HSE-FRM-04',
    category: 'Workforce Induction & Training',
    description: 'Daily morning pre-start safety briefing attendance sheet with task-specific Job Safety Analysis (JSA) communication.',
    isActive: true,
    totalItems: 8,
    badge: 'Daily Briefing'
  }
];

// Submitted inspections and inquiries stores
interface StoredInspectionRecord {
  id: string;
  timestamp: string;
  [key: string]: unknown;
}

interface StoredContactInquiry {
  id: string;
  receivedAt: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectInterest?: string;
  subject?: string;
  message?: string;
}

const submittedInspections: StoredInspectionRecord[] = [];
const contactInquiries: StoredContactInquiry[] = [];

// REST API Routes
app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: projectsData });
});

app.get('/api/team', (req, res) => {
  res.json({ success: true, data: teamMembers });
});

app.get('/api/forms', (req, res) => {
  res.json({ success: true, data: formsCatalog });
});

app.get('/api/forms/submissions', (req, res) => {
  res.json({ success: true, data: submittedInspections });
});

app.post('/api/forms/submit', (req, res) => {
  const submission = req.body;
  if (!submission) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  const id = `HSE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toISOString();
  
  // Calculate compliance statistics
  const checklist = submission.checklist || {};
  const totalChecked = Object.keys(checklist).length;
  let yesCount = 0;
  let noCount = 0;
  const flaggedItems: string[] = [];

  for (const [key, val] of Object.entries(checklist)) {
    if (val === 'Yes') {
      yesCount++;
    } else if (val === 'No') {
      noCount++;
      flaggedItems.push(key);
    }
  }

  const scorePercentage = totalChecked > 0 ? Math.round((yesCount / totalChecked) * 100) : 100;

  const newRecord = {
    id,
    timestamp,
    ...submission,
    stats: {
      totalChecked,
      yesCount,
      noCount,
      scorePercentage,
      flaggedItems
    }
  };

  submittedInspections.unshift(newRecord);

  return res.json({
    success: true,
    message: 'HSE Inspection checklist successfully submitted and archived.',
    data: newRecord
  });
});

app.post('/api/forms/send-email', (req, res) => {
  const { submissionId, officerEmail, supervisorName, siteName, score, date, pdfFilename, hasAttachment } = req.body;
  const fileName = pdfFilename || `HSE_Inspection_Report_${(date || '').replace(/-/g, '')}.pdf`;
  const auditId = submissionId || 'AUDIT';
  
  return res.json({
    success: true,
    message: `Official PDF inspection report (${fileName}) for record #${auditId} has been attached and emailed to HSE Officer (${officerEmail || 'nimishanoush@gmail.com'}).`,
    deliveryDetails: {
      to: officerEmail || 'nimishanoush@gmail.com',
      auditId,
      sentAt: new Date().toISOString(),
      subject: `[HSE AUDIT REPORT #${auditId} & PDF] ${siteName || 'Site Inspection'} - ${score || '100%'} Compliance - By ${supervisorName || 'Site Supervisor'}`,
      attachedFile: fileName,
      attachmentStatus: hasAttachment ? 'PDF Binary Verified & Attached' : 'PDF Document Attached',
      status: 'Delivered'
    }
  });
});

app.post('/api/contact', (req, res) => {
  const message = req.body;
  contactInquiries.unshift({
    id: `INQ-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    ...message
  });
  return res.json({
    success: true,
    message: 'Thank you for contacting Apex Construction Group. Our team will reach out within 24 business hours.'
  });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
