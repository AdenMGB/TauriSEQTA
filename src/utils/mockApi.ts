

// Helpers mirrored from netUtil but scoped here
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const now = new Date('2025-12-31T12:00:00Z');
const toISODate = (d: Date) => d.toISOString().slice(0, 10);
const genDates2025 = (intervalDays = 7) => {
  const result: string[] = [];
  const start = new Date('2025-01-01T00:00:00Z');
  const end = new Date('2025-12-31T00:00:00Z');
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + intervalDays)) {
    result.push(toISODate(d));
  }
  return result;
};
const sortByDateDesc = <T>(arr: T[], getDate: (x: T) => string | Date) => {
  return arr.sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime());
};

const createPRNG = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

type MessageLabel = 'inbox' | 'starred' | 'trash' | 'sent' | 'outbox';

type MockMessage = {
  id: number;
  label: MessageLabel;
  subject: string;
  sender: string;
  sender_photo: string;
  date: string;
  participants: { name: string }[];
  attachments: boolean;
  read: boolean;
  starred: boolean;
  lastMessageAt: string;
};

const MESSAGE_SUBJECTS = [
  'Welcome to DesQTA',
  'Assignment Reminder',
  'Important Notice',
  'Class Schedule Update',
  'Exam Information',
  'Project Guidelines',
  'Parent Meeting',
  'Field Trip Permission',
  'Library Resources',
  'Course Materials',
  'Homework Help',
  'Study Group',
  'Academic Progress',
  'Event Invitation',
  'System Maintenance',
  'New Resources Available',
  'Grade Update',
  'Attendance Notice',
  'Calendar Change',
  'Support Request',
];

const MESSAGE_SENDERS = [
  'Mr. Johnson',
  'Ms. Smith',
  'Dr. Williams',
  'Mrs. Brown',
  'Prof. Davis',
  'Mr. Wilson',
  'Ms. Taylor',
  'Dr. Anderson',
  'Mrs. Martin',
  'Mr. Thompson',
  'Ms. Garcia',
  'Dr. Rodriguez',
  'Mrs. Lewis',
  'Mr. Walker',
  'Ms. Hall',
  'School Admin',
  'IT Support',
  'Library Staff',
  'Counselor',
  'Principal',
];

const MESSAGE_RECIPIENTS = [
  'Student Services',
  'Class Group 10A',
  'Study Team Alpha',
  'Project Team Delta',
  'All Students',
  'Year 10 Cohort',
  'Year 11 Cohort',
  'Year 12 Cohort',
];

const MESSAGE_BODY_TEMPLATES = [
  '<p>Dear Student,</p><p>This is an important message regarding your upcoming assignments. Please ensure you review all materials and submit your work on time.</p><p>Best regards,<br/>Teaching Staff</p>',
  '<p>Hi there,</p><p>Just a quick reminder about the project deadline next week. Make sure to check the rubric and requirements.</p><p>Thanks!</p>',
  '<p>Hello,</p><p>We are excited to announce a new initiative starting next term. More details will be shared at the assembly.</p><p>Stay tuned!</p>',
  '<p>Attention students,</p><p>The exam schedule has been posted on the portal. Please review it carefully and plan your study time accordingly.</p><p>Good luck with your preparation!</p>',
  '<p>Dear all,</p><p>This is to inform you about changes to the school calendar. Please check the updated dates for all important events.</p><p>Thank you for your attention.</p>',
  '<div class="forward"><p><strong>Forwarded message:</strong></p><blockquote><p>Please be advised that the library will have extended hours during exam period.</p></blockquote></div>',
  '<p>Team,</p><p>Great work on the group project! Your collaboration and effort really showed in the final presentation.</p><p>Keep it up!</p>',
  '<p>Student,</p><p>Your progress report for this term is now available. Please review it with your parents/guardians.</p><p>If you have any questions, feel free to reach out.</p>',
];

const MESSAGE_DATA: MockMessage[] = (() => {
  const prng = createPRNG(2025);
  const config: { label: MessageLabel; count: number }[] = [
    { label: 'inbox', count: 90 },
    { label: 'starred', count: 20 },
    { label: 'trash', count: 12 },
    { label: 'sent', count: 24 },
    { label: 'outbox', count: 12 },
  ];
  const dataset: MockMessage[] = [];
  let idCounter = 1000;

  config.forEach((cfg, cfgIndex) => {
    for (let i = 0; i < cfg.count; i += 1) {
      const baseSubject = MESSAGE_SUBJECTS[(i + cfgIndex) % MESSAGE_SUBJECTS.length];
      const subjectVariant = cfg.label === 'inbox' ? baseSubject : `${baseSubject} (${cfg.label.toUpperCase()})`;
      const sender = cfg.label === 'sent' || cfg.label === 'outbox' ? 'You' : MESSAGE_SENDERS[(i + cfgIndex) % MESSAGE_SENDERS.length];
      const participantName = cfg.label === 'sent' || cfg.label === 'outbox'
        ? MESSAGE_RECIPIENTS[(i + cfgIndex) % MESSAGE_RECIPIENTS.length]
        : 'You';

      const messageDate = new Date(now);
      const daysOffset = Math.floor(prng() * 120) + cfgIndex * 5 + i;
      messageDate.setUTCDate(messageDate.getUTCDate() - daysOffset);
      messageDate.setUTCHours(Math.floor(prng() * 24), Math.floor(prng() * 60), 0, 0);
      const isoDate = messageDate.toISOString();

      const id = idCounter++;
      const attachments = (id + cfgIndex) % 5 === 0;
      const read = cfg.label === 'inbox' ? i % 4 !== 0 : true;
      const starred = cfg.label === 'starred' ? true : cfg.label === 'inbox' && i % 12 === 0;

      dataset.push({
        id,
        label: cfg.label,
        subject: subjectVariant,
        sender,
        sender_photo: `https://picsum.photos/seed/message-${id}/64`,
        date: isoDate,
        participants: [{ name: participantName }],
        attachments,
        read,
        starred,
        lastMessageAt: isoDate,
      });
    }
  });

  return dataset.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
})();

type MockNotice = {
  id: number;
  title: string;
  label_title: string;
  staff: string;
  colour: string;
  label: number;
  contents: string;
  date: string;
};

const NOTICE_LABELS = [
  { id: 1, title: 'General', colour: '#910048' },
  { id: 2, title: 'Urgent', colour: '#ff0000' },
  { id: 3, title: 'Academic', colour: '#2563eb' },
  { id: 4, title: 'Events', colour: '#059669' },
  { id: 5, title: 'Sports', colour: '#dc2626' },
  { id: 6, title: 'Administrative', colour: '#7c3aed' },
];

const NOTICE_TITLES = [
  'Welcome Back to School',
  'Parent-Teacher Conference Schedule',
  'School Sports Day Event',
  'Library Hours Extended',
  'New Course Registration Open',
  'Exam Schedule Released',
  'Student Council Elections',
  'Science Fair Announcement',
  'Art Exhibition Opening',
  'Drama Club Auditions',
  'Field Trip Permission Required',
  'Uniform Policy Update',
  'Cafeteria Menu Changes',
  'Technology Lab Maintenance',
  'Music Concert Tickets Available',
  'Career Fair Next Week',
  'Scholarship Opportunities',
  'Health & Safety Guidelines',
  'Lost & Found Items',
  'Transportation Schedule Change',
  'Academic Excellence Awards',
  'Club Meeting Schedule',
  'PTA Meeting Announcement',
  'School Closure Notice',
  'Emergency Contact Update',
  'Fundraising Event Details',
  'Workshop Registration',
  'Guest Speaker Visit',
  'Academic Support Available',
  'Student Survey Request',
];

const NOTICE_CONTENT_TEMPLATES = [
  'Please read this important information carefully and take appropriate action.',
  'We are pleased to announce this exciting opportunity for all students.',
  'Your participation is highly encouraged. Please see details below.',
  'This notice contains important updates to school policies and procedures.',
  'Registration is now open. Limited spaces available - first come, first served.',
  'All students and parents are invited to attend this important event.',
  'Please ensure you have all required documentation before the deadline.',
  'Contact the main office if you have any questions or concerns.',
  'This is a mandatory requirement for all students in affected programs.',
  'We appreciate your cooperation and understanding in this matter.',
];

const NOTICE_STAFF = [
  'Principal Johnson',
  'Vice Principal Smith',
  'Academic Director Brown',
  'Student Services Wilson',
  'Ms. Anderson',
  'Mr. Thompson',
  'Dr. Martinez',
  'Mrs. Davis',
  'Coach Roberts',
  'Librarian Lee',
  'IT Administrator',
  'School Secretary',
  'Counselor Taylor',
  'Nurse Williams',
  'Facilities Manager',
];

const NOTICE_DATA: MockNotice[] = (() => {
  const prng = createPRNG(1337);
  const baseDate = new Date('2025-12-31T00:00:00Z');
  const dataset: MockNotice[] = [];

  for (let i = 0; i < 240; i += 1) {
    const label = NOTICE_LABELS[i % NOTICE_LABELS.length];
    const titleBase = NOTICE_TITLES[i % NOTICE_TITLES.length];
    const repeatIndex = Math.floor(i / NOTICE_TITLES.length);
    const title = repeatIndex > 0 ? `${titleBase} (${repeatIndex + 1})` : titleBase;
    const staff = NOTICE_STAFF[i % NOTICE_STAFF.length];
    const contentTemplate = NOTICE_CONTENT_TEMPLATES[i % NOTICE_CONTENT_TEMPLATES.length];

    const noticeDate = new Date(baseDate);
    const offset = i + Math.floor(prng() * 4);
    noticeDate.setUTCDate(noticeDate.getUTCDate() - offset);
    noticeDate.setUTCHours(8 + (i % 6), Math.floor(prng() * 60), 0, 0);
    const isoDate = toISODate(noticeDate);

    dataset.push({
      id: 1000 + i,
      title,
      label_title: label.title,
      staff,
      colour: label.colour,
      label: label.id,
      contents: `<p>${contentTemplate}</p><p><strong>Published:</strong> ${isoDate}</p><p>Category: ${label.title}</p>`,
      date: isoDate,
    });
  }

  return dataset.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
})();

export function mockApiResponse(url: string, init?: any): any {
  // Helper: extract query params from URL
  const qsParams = (() => {
    const qIndex = url.indexOf('?');
    if (qIndex === -1) return {} as Record<string, string>;
    const query = url.substring(qIndex + 1);
    const out: Record<string, string> = {};
    query.split('&').filter(Boolean).forEach(p => {
      const [k, v] = p.split('=');
      out[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return out;
  })();

  // LOGIN
  if (url.includes('/seqta/student/login')) {
    return JSON.stringify({
      payload: {
        clientIP: '127.0.0.1',
        email: getRandomItem(['student2025@example.com', 'user2025@school.edu']),
        id: 999,
        lastAccessedTime: now.getTime(),
        meta: { code: 'STU', governmentID: 'GOV2025' },
        personUUID: 'uuid-2025-' + Math.random().toString(36).substring(2, 10),
        saml: [
          { autologin: false, label: 'SEQTA', method: 'POST', request: '', sigalg: '', signature: '', slo: false, url: '' },
        ],
        status: 'active',
        type: 'student',
        userCode: 'U2025',
        userDesc: 'Student',
        userName: 'student2025',
        displayName: 'Student Two Zero Two Five',
      },
    });
  }

  // HEARTBEAT
  if (url.includes('/seqta/student/heartbeat')) {
    return JSON.stringify({ ok: true, timestamp: now.toISOString() });
  }

  // LOAD SETTINGS
  if (url.includes('/seqta/student/load/settings')) {
    return JSON.stringify({
      payload: {
        theme: 'default',
        messaging: { signaturesEnabled: true },
        timetable: { weekStartsOn: 'Monday' },
        updatedAt: now.toISOString(),
      },
    });
  }

  // PROFILE
  if (url.includes('/seqta/student/load/profile')) {
    return JSON.stringify({
      payload: {
        firstname: 'Alex',
        surname: 'Taylor',
        displayName: 'Alex Taylor',
        year: '12',
        house: 'Gryphon',
        email: 'alex.taylor@school.edu',
        lastUpdated: now.toISOString(),
      },
    });
  }

  // PHOTO GET (simulate return URL)
  if (url.includes('/seqta/student/photo/get')) {
    return JSON.stringify('https://picsum.photos/seed/seqta-2025/128');
  }

  // SUBJECTS (Folders with subjects)
  if (url.includes('/seqta/student/load/subjects')) {
    return JSON.stringify({
      payload: [
        {
          code: 'FOLDER1',
          description: 'Core Subjects',
          id: 1,
          active: 1,
          subjects: [
            { code: 'MATH', classunit: 101, description: 'Mathematics', metaclass: 1, title: 'Mathematics', programme: 1, marksbook_type: 'A' },
            { code: 'SCI', classunit: 102, description: 'Science', metaclass: 2, title: 'Science', programme: 1, marksbook_type: 'A' },
          ],
        },
        {
          code: 'FOLDER2',
          description: 'Languages',
          id: 2,
          active: 1,
          subjects: [
            { code: 'ENG', classunit: 201, description: 'English', metaclass: 3, title: 'English', programme: 2, marksbook_type: 'B' },
          ],
        },
      ],
    });
  }

  // COURSES (list of course cards)
  if (url.includes('/seqta/student/load/courses')) {
    return JSON.stringify({
      payload: [
        { id: 'C101', title: 'Algebra II', subject: 'MATH', teacher: 'Ms. Smith', updated: now.toISOString() },
        { id: 'C102', title: 'Chemistry', subject: 'SCI', teacher: 'Mr. Jones', updated: now.toISOString() },
        { id: 'C201', title: 'English Lit', subject: 'ENG', teacher: 'Mrs. Brown', updated: now.toISOString() },
      ],
    });
  }

  // PREFS
  if (url.includes('/seqta/student/load/prefs')) {
    return JSON.stringify({
      payload: [
        { name: 'timetable.subject.colour.MATH', value: '#ff0000' },
        { name: 'timetable.subject.colour.SCI', value: '#00ff00' },
        { name: 'timetable.subject.colour.ENG', value: '#0000ff' },
      ],
    });
  }

  // TIMETABLE
  if (url.includes('/seqta/student/load/timetable')) {
    const lessons: any[] = [];
    const start = new Date('2025-01-01T00:00:00Z');
    const end = new Date('2025-12-31T00:00:00Z');
    const slots = [
      { from: '08:30', until: '09:20' },
      { from: '09:30', until: '10:20' },
      { from: '10:30', until: '11:20' },
      { from: '11:30', until: '12:20' },
      { from: '13:10', until: '14:00' },
      { from: '14:10', until: '15:00' },
    ];
    const subjects = [
      { code: 'MATH', description: 'Mathematics', staff: 'Ms. Smith', room: 'A1', classunit: 101 },
      { code: 'SCI', description: 'Science', staff: 'Mr. Jones', room: 'B2', classunit: 102 },
      { code: 'ENG', description: 'English', staff: 'Mrs. Brown', room: 'C3', classunit: 201 },
    ];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const day = d.getUTCDay();
      if (day === 0 || day === 6) continue;
      slots.forEach((slot, idx) => {
        const subj = subjects[(d.getUTCDate() + idx) % subjects.length];
        lessons.push({
          date: toISODate(d),
          from: slot.from,
          until: slot.until,
          description: subj.description,
          staff: subj.staff,
          room: subj.room,
          code: subj.code,
          classunit: subj.classunit,
        });
      });
    }
    const qFrom = qsParams['from'];
    const qUntil = qsParams['until'];
    let items = lessons;
    if (qFrom || qUntil) {
      items = lessons.filter(l => (!qFrom || l.date >= qFrom) && (!qUntil || l.date <= qUntil));
    }
    if (!qFrom && !qUntil) {
      const latestDate = items.length ? items[items.length - 1].date : toISODate(now);
      const startLatest = new Date(latestDate);
      startLatest.setUTCDate(startLatest.getUTCDate() - 7);
      const startStr = toISODate(startLatest);
      items = items.filter(l => l.date >= startStr);
    }
    return JSON.stringify({ payload: { items } });
  }

  // COURSE CONTENT FOR LESSONS
  if (url.includes('/seqta/student/load/course/content')) {
    const classunit = qsParams['classunit'] || '101';
    const date = qsParams['date'] || toISODate(now);
    const seed = (classunit + '-' + date).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const topicsByClass: Record<string, string[]> = {
      '101': ['Quadratic Equations', 'Trigonometric Identities', 'Sequences and Series', 'Probability'],
      '102': ['Atomic Structure', 'Chemical Reactions', 'Acids and Bases', 'Stoichiometry'],
      '201': ['Poetry Analysis', 'Persuasive Writing', 'Novel Study', 'Comparative Essays'],
    };
    const resourcesByClass: Record<string, { label: string; url: string }[]> = {
      '101': [
        { label: 'Worksheet: Quadratics', url: 'https://example.com/math/quadratics.pdf' },
        { label: 'Desmos Activity', url: 'https://www.desmos.com/' },
      ],
      '102': [
        { label: 'Lab Sheet: Reactions', url: 'https://example.com/sci/reactions.pdf' },
        { label: 'PhET Simulations', url: 'https://phet.colorado.edu/' },
      ],
      '201': [
        { label: 'Poetry Anthology', url: 'https://example.com/eng/poetry.pdf' },
        { label: 'Essay Planner', url: 'https://example.com/eng/planner.docx' },
      ],
    };
    const classKey = ['101', '102', '201'].includes(classunit) ? classunit : '101';
    const topics = topicsByClass[classKey];
    const topic = topics[seed % topics.length];
    const resources = resourcesByClass[classKey];
    const homework = {
      description: `Complete exercises related to: ${topic}`,
      due: toISODate(new Date(Date.UTC(
        Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)) + 2
      ))),
    };
    const content = {
      overview: `Lesson focus: ${topic}`,
      objectives: [
        `Understand key concepts of ${topic}`,
        `Apply ${topic} to problem-solving`,
        `Review prior knowledge relevant to ${topic}`,
      ],
      activities: [
        `Warm-up: Quick recap on last lesson (5 min)`,
        `Main activity: Guided practice on ${topic} (30 min)`,
        `Independent work: Exercises on ${topic} (15 min)`,
      ],
      resources,
      homework,
      lastUpdated: new Date(date + 'T15:00:00Z').toISOString(),
    };
    return JSON.stringify({ payload: { classunit: Number(classunit), date, content } });
  }

  // ASSESSMENTS - UPCOMING
  if (url.includes('/seqta/student/assessment/list/upcoming')) {
    const dates = genDates2025(14);
    const subjectMap = [
      { code: 'MATH', subject: 'Math' },
      { code: 'SCI', subject: 'Science' },
      { code: 'ENG', subject: 'English' },
    ];
    let payload = dates.map((d, i) => {
      const m = subjectMap[i % subjectMap.length];
      return { id: 200 + i, code: m.code, subject: m.subject, due: d, title: 'Assessment ' + (i + 1), status: 'UPCOMING' };
    });
    payload = sortByDateDesc(payload, x => x.due);
    const today = new Date();
    const future = payload.filter(a => new Date(a.due) >= today);
    if (future.length < 3) {
      payload = payload.slice(0, 5);
    } else {
      payload = future.slice(0, 5);
    }
    return JSON.stringify({ payload });
  }

  // ASSESSMENTS - PAST
  if (url.includes('/seqta/student/assessment/list/past')) {
    const dates = genDates2025(14);
    let tasks = dates.map((d, i) => ({ id: 300 + i, code: getRandomItem(['MATH', 'SCI', 'ENG']), due: d, title: 'Past Task ' + (i + 1), status: 'MARKS_RELEASED' }));
    tasks = sortByDateDesc(tasks, x => x.due);
    return JSON.stringify({ payload: { tasks } });
  }

  // ASSESSMENT DETAIL
  if (url.includes('/seqta/student/assessment/get')) {
    const id = qsParams['id'] || '9999';
    return JSON.stringify({
      payload: { id: Number(id), title: 'Assessment Detail ' + id, description: 'This is a mock assessment for 2025.', due: '2025-11-15', subject: 'Math', resources: [{ name: 'Rubric.pdf', uuid: 'file-uuid-' + id }] },
    });
  }

  // ASSESSMENT SUBMISSIONS GET
  if (url.includes('/seqta/student/assessment/submissions/get')) {
    const id = qsParams['id'] || '9999';
    return JSON.stringify({ payload: [ { id: 1, assessmentId: Number(id), submitted: true, submittedAt: '2025-11-10T10:00:00Z', grade: 'A' }, { id: 2, assessmentId: Number(id), submitted: false, submittedAt: null, grade: null } ] });
  }

  // ASSESSMENT SUBMISSIONS SAVE
  if (url.includes('/seqta/student/assessment/submissions/save')) {
    return JSON.stringify({ status: 'ok', payload: { linkId: 'link-2025-' + Math.random().toString(36).slice(2, 6) } });
  }

  // MESSAGING - PEOPLE DIRECTORY
  if (url.includes('/seqta/student/load/message/people')) {
    const body = init?.body || {};
    const mode = body.mode || 'student';
    
    if (mode === 'staff') {
      // Return staff members
      const staff = [
        { id: 1, firstname: 'John', surname: 'Johnson', xx_display: 'Mr. Johnson (Mathematics)', title: 'Mr.', department: 'Mathematics' },
        { id: 2, firstname: 'Sarah', surname: 'Smith', xx_display: 'Ms. Smith (Science)', title: 'Ms.', department: 'Science' },
        { id: 3, firstname: 'David', surname: 'Williams', xx_display: 'Dr. Williams (English)', title: 'Dr.', department: 'English' },
        { id: 4, firstname: 'Emily', surname: 'Brown', xx_display: 'Mrs. Brown (History)', title: 'Mrs.', department: 'History' },
        { id: 5, firstname: 'Michael', surname: 'Davis', xx_display: 'Prof. Davis (Physics)', title: 'Prof.', department: 'Physics' },
        { id: 6, firstname: 'Jennifer', surname: 'Wilson', xx_display: 'Ms. Wilson (Chemistry)', title: 'Ms.', department: 'Chemistry' },
        { id: 7, firstname: 'Robert', surname: 'Taylor', xx_display: 'Mr. Taylor (Geography)', title: 'Mr.', department: 'Geography' },
        { id: 8, firstname: 'Linda', surname: 'Anderson', xx_display: 'Dr. Anderson (Biology)', title: 'Dr.', department: 'Biology' },
        { id: 9, firstname: 'William', surname: 'Martin', xx_display: 'Mr. Martin (Art)', title: 'Mr.', department: 'Art' },
        { id: 10, firstname: 'Patricia', surname: 'Thompson', xx_display: 'Mrs. Thompson (Music)', title: 'Mrs.', department: 'Music' },
        { id: 11, firstname: 'James', surname: 'Garcia', xx_display: 'Mr. Garcia (PE)', title: 'Mr.', department: 'Physical Education' },
        { id: 12, firstname: 'Maria', surname: 'Rodriguez', xx_display: 'Ms. Rodriguez (Languages)', title: 'Ms.', department: 'Languages' },
        { id: 13, firstname: 'Richard', surname: 'Lewis', xx_display: 'Dr. Lewis (Economics)', title: 'Dr.', department: 'Economics' },
        { id: 14, firstname: 'Barbara', surname: 'Walker', xx_display: 'Mrs. Walker (IT)', title: 'Mrs.', department: 'Information Technology' },
        { id: 15, firstname: 'Charles', surname: 'Hall', xx_display: 'Mr. Hall (Drama)', title: 'Mr.', department: 'Drama' },
      ];
      return JSON.stringify({ payload: staff });
    } else {
      // Return students
      const students = [
        { id: 101, firstname: 'Alice', surname: 'Smith', xx_display: 'Alice Smith', year: '10', 'sub-school': 'Middle', house: 'Red', house_colour: '#dc2626', campus: 'Main', rollgroup: '10A' },
        { id: 102, firstname: 'Bob', surname: 'Jones', xx_display: 'Bob Jones', year: '11', 'sub-school': 'Senior', house: 'Blue', house_colour: '#2563eb', campus: 'North', rollgroup: '11B' },
        { id: 103, firstname: 'Charlie', surname: 'Brown', xx_display: 'Charlie Brown', year: '12', 'sub-school': 'Senior', house: 'Green', house_colour: '#059669', campus: 'Main', rollgroup: '12C' },
        { id: 104, firstname: 'Diana', surname: 'Prince', xx_display: 'Diana Prince', year: '10', 'sub-school': 'Middle', house: 'Yellow', house_colour: '#eab308', campus: 'Main', rollgroup: '10B' },
        { id: 105, firstname: 'Ethan', surname: 'Hunt', xx_display: 'Ethan Hunt', year: '11', 'sub-school': 'Senior', house: 'Red', house_colour: '#dc2626', campus: 'South', rollgroup: '11C' },
        { id: 106, firstname: 'Fiona', surname: 'Green', xx_display: 'Fiona Green', year: '12', 'sub-school': 'Senior', house: 'Blue', house_colour: '#2563eb', campus: 'Main', rollgroup: '12A' },
        { id: 107, firstname: 'George', surname: 'White', xx_display: 'George White', year: '10', 'sub-school': 'Middle', house: 'Green', house_colour: '#059669', campus: 'North', rollgroup: '10C' },
        { id: 108, firstname: 'Hannah', surname: 'Black', xx_display: 'Hannah Black', year: '11', 'sub-school': 'Senior', house: 'Yellow', house_colour: '#eab308', campus: 'Main', rollgroup: '11A' },
        { id: 109, firstname: 'Isaac', surname: 'Gray', xx_display: 'Isaac Gray', year: '12', 'sub-school': 'Senior', house: 'Red', house_colour: '#dc2626', campus: 'South', rollgroup: '12B' },
        { id: 110, firstname: 'Julia', surname: 'Silver', xx_display: 'Julia Silver', year: '10', 'sub-school': 'Middle', house: 'Blue', house_colour: '#2563eb', campus: 'Main', rollgroup: '10A' },
      ];
      return JSON.stringify({ payload: students });
    }
  }

  // MESSAGING - LIST/THREAD
  if (url.includes('/seqta/student/load/message')) {
    const body = init?.body || {};
    const action = body.action || 'list';
    const labelRaw = (body.label || 'inbox') as string;
    const label = (labelRaw.toLowerCase() as MessageLabel) || 'inbox';
    const messageId = body.id;
    
    // Handle detail view for specific message
    if (action === 'message' && typeof messageId === 'number') {
      const msg = MESSAGE_DATA.find((m) => m.id === messageId);
      const contentIndex = messageId % MESSAGE_BODY_TEMPLATES.length;
      const starred = msg ? msg.starred : ((messageId * 7) % 10) > 7;
      const contents = MESSAGE_BODY_TEMPLATES[contentIndex];
      
      return JSON.stringify({
        payload: {
          id: messageId,
          contents,
          starred,
          read: true,
          sender: msg?.sender ?? 'Teaching Staff',
          subject: msg?.subject ?? 'Message',
          date: msg?.date ?? now.toISOString(),
        }
      });
    }
    
    // Determine relevant messages based on label and filters
    let messages = (() => {
      switch (label) {
        case 'starred':
          return MESSAGE_DATA.filter((m) => m.starred);
        case 'trash':
          return MESSAGE_DATA.filter((m) => m.label === 'trash');
        case 'sent':
          return MESSAGE_DATA.filter((m) => m.label === 'sent');
        case 'outbox':
          return MESSAGE_DATA.filter((m) => m.label === 'outbox');
        case 'inbox':
        default:
          return MESSAGE_DATA.filter((m) => m.label === 'inbox');
      }
    })();
    
    const datetimeUntil = body.datetimeUntil as string | undefined;
    if (datetimeUntil) {
      messages = messages.filter((m) => m.date <= datetimeUntil);
    }
    
    const searchValue = typeof body.searchValue === 'string' ? body.searchValue.trim().toLowerCase() : '';
    if (searchValue) {
      messages = messages.filter((m) =>
        m.subject.toLowerCase().includes(searchValue) ||
        m.sender.toLowerCase().includes(searchValue) ||
        m.participants.some((p) => p.name.toLowerCase().includes(searchValue))
      );
    }
    
    const sortOrder = (body.sortOrder || 'desc').toLowerCase();
    const sorted = [...messages].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    });
    
    const limit = typeof body.limit === 'number' && body.limit > 0 ? body.limit : 100;
    const offset = typeof body.offset === 'number' && body.offset >= 0 ? body.offset : 0;
    const paginated = sorted.slice(offset, offset + limit);
    
    return JSON.stringify({ payload: { messages: paginated, total: sorted.length } });
  }

  // MESSAGING - SAVE/SEND
  if (url.includes('/seqta/student/save/message')) {
    const body = init?.body || {};
    const mode = body.mode;
    
    if (mode === 'x-star') {
      // Toggle starred status
      const starred = body.starred !== undefined ? body.starred : true;
      return JSON.stringify({ 
        status: 'ok', 
        payload: { starred: starred }
      });
    } else if (mode === 'x-label') {
      // Move to different label/folder
      const label = body.label || 'inbox';
      return JSON.stringify({ 
        status: 'ok', 
        payload: { label: label }
      });
    } else if (mode === 'link') {
      // Send/save message
      return JSON.stringify({ 
        status: 'ok', 
        payload: { 
          messageId: 'msg-2025-' + Math.random().toString(36).slice(2, 6), 
          savedAt: now.toISOString() 
        }
      });
    }
    
    // Default response
    return JSON.stringify({ 
      status: 'ok', 
      payload: { 
        messageId: 'msg-2025-' + Math.random().toString(36).slice(2, 6), 
        savedAt: now.toISOString() 
      }
    });
  }

  // PORTALS LIST
  if (url.includes('/seqta/student/load/portals')) {
    const body = init?.body || {};
    
    // Special case for splash portal (welcome portal)
    if (body.splash) {
      return JSON.stringify({
        status: '200',
        payload: {
          url: 'https://example.com/welcome-portal',
          contents: '<iframe src="https://example.com/welcome-portal" width="100%" height="100%"></iframe>'
        }
      });
    }
    
    // Handle portal detail request
    if (body.id) {
      const id = body.id;
      const portalsMap: Record<string, any> = {
        'uuid-p1': {
          label: 'Library',
          links: [
            { label: 'Library Catalog', url: 'https://library.example.com/catalog' },
            { label: 'Research Databases', url: 'https://library.example.com/databases' },
            { label: 'Book Recommendations', url: 'https://library.example.com/recommendations' },
          ]
        },
        'uuid-p2': {
          label: 'Careers',
          links: [
            { label: 'Career Pathways', url: 'https://careers.example.com/pathways' },
            { label: 'University Applications', url: 'https://careers.example.com/university' },
            { label: 'Work Experience', url: 'https://careers.example.com/work-experience' },
          ]
        },
        'uuid-p3': {
          label: 'Wellbeing',
          links: [
            { label: 'Mental Health Resources', url: 'https://wellbeing.example.com/mental-health' },
            { label: 'Counseling Services', url: 'https://wellbeing.example.com/counseling' },
            { label: 'Student Support', url: 'https://wellbeing.example.com/support' },
          ]
        },
        'uuid-p4': {
          label: 'Student Services',
          links: [
            { label: 'Student Portal', url: 'https://services.example.com/portal' },
            { label: 'IT Support', url: 'https://services.example.com/it-support' },
            { label: 'Student Resources', url: 'https://services.example.com/resources' },
          ]
        },
        'uuid-p5': {
          label: 'Community',
          contents: '<div class="portal-content"><h2>Community Portal</h2><p>Welcome to the community portal. Stay connected with school events and activities.</p><ul><li>Upcoming Events</li><li>News & Announcements</li><li>Parent Resources</li></ul></div>'
        },
      };
      
      const portal = portalsMap[id] || portalsMap['uuid-p1'];
      return JSON.stringify({
        status: '200',
        payload: portal
      });
    }
    
    // Return list of portals
    const portals = [
      {
        id: 1,
        uuid: 'uuid-p1',
        label: 'Library',
        icon: 'colour-blue',
        priority: 1,
        is_power_portal: false,
        inherit_styles: true,
        url: 'https://library.example.com'
      },
      {
        id: 2,
        uuid: 'uuid-p2',
        label: 'Careers',
        icon: 'colour-green',
        priority: 2,
        is_power_portal: false,
        inherit_styles: true,
        url: 'https://careers.example.com'
      },
      {
        id: 3,
        uuid: 'uuid-p3',
        label: 'Wellbeing',
        icon: 'colour-turquoise',
        priority: 3,
        is_power_portal: false,
        inherit_styles: true,
        url: 'https://wellbeing.example.com'
      },
      {
        id: 4,
        uuid: 'uuid-p4',
        label: 'Student Services',
        icon: 'colour-orange',
        priority: 4,
        is_power_portal: false,
        inherit_styles: true,
        url: 'https://services.example.com'
      },
      {
        id: 5,
        uuid: 'uuid-p5',
        label: 'Community',
        icon: 'colour-purple',
        priority: 5,
        is_power_portal: true,
        inherit_styles: false,
        url: 'https://community.example.com'
      },
    ];
    return JSON.stringify({ status: '200', payload: portals });
  }

  // NOTICES
  if (url.includes('/seqta/student/load/notices')) {
    const body = init?.body || {};
    if (body.mode === 'labels') {
      return JSON.stringify({ payload: NOTICE_LABELS });
    }
    
    const labelFilter = body.label ?? body.labels;
    const labelIds = Array.isArray(labelFilter)
      ? labelFilter.map(Number)
      : typeof labelFilter === 'number' || typeof labelFilter === 'string'
        ? [Number(labelFilter)]
        : [];
    
    let notices = NOTICE_DATA;
    if (labelIds.length > 0) {
      notices = notices.filter((n) => labelIds.includes(n.label));
    }
    
    const requestedDate = typeof body.date === 'string' ? body.date : undefined;
    if (requestedDate) {
      const sameDay = notices.filter((n) => n.date === requestedDate);
      if (sameDay.length > 0) {
        notices = sameDay;
      } else {
        const earlier = notices.filter((n) => n.date <= requestedDate);
        if (earlier.length > 0) {
          notices = earlier;
        }
      }
    }
    
    const limit = typeof body.limit === 'number' && body.limit > 0 ? body.limit : undefined;
    const offset = typeof body.offset === 'number' && body.offset >= 0 ? body.offset : 0;
    const sliced = limit ? notices.slice(offset, offset + limit) : notices.slice(offset);
    
    return JSON.stringify({ payload: sliced });
  }

  // REPORTS
  if (url.includes('/seqta/student/load/reports')) {
    const payload = [
      { year: '2025', terms: 'Term 1', types: 'Semester Report', created_date: '2025-03-31 12:00', uuid: 'report-uuid-t1' },
      { year: '2025', terms: 'Term 2', types: 'Progress Report', created_date: '2025-06-30 12:00', uuid: 'report-uuid-t2' },
      { year: '2025', terms: 'Term 3', types: 'Progress Report', created_date: '2025-09-30 12:00', uuid: 'report-uuid-t3' },
      { year: '2025', terms: 'Term 4', types: 'Final Report', created_date: '2025-12-15 12:00', uuid: 'report-uuid-t4' },
    ];
    return JSON.stringify({ status: '200', payload });
  }

  // HOMEWORK SUMMARY
  if (url.includes('/seqta/student/dashlet/summary/homework')) {
    // Schema: { meta: number, id: number, title: string, items: string[] }
    const payload = [
      {
        meta: 101,
        id: 1,
        title: 'Mathematics',
        items: [
          'Complete exercises 1-10 from textbook pages 45-47',
          'Review quadratic equations and practice problems',
          'Prepare for upcoming test on trigonometry'
        ]
      },
      {
        meta: 102,
        id: 2,
        title: 'Science',
        items: [
          'Lab report on chemical reactions due Friday',
          'Study notes on atomic structure',
          'Complete online quiz on periodic table'
        ]
      },
      {
        meta: 201,
        id: 3,
        title: 'English',
        items: [
          'Read chapters 5-7 of assigned novel',
          'Write essay outline for persuasive writing assignment',
          'Complete vocabulary worksheet'
        ]
      }
    ];
    return JSON.stringify({ status: '200', payload });
  }

  // Default
  return JSON.stringify({ message: 'Mocked by Sensitive Info Hider', random: Math.random(), now: now.toISOString() });
} 