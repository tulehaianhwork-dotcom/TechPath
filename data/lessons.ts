export interface LessonContent {
  id: string;
  title: string;
  slug: string;
  phaseId: string;
  order: number;
  readingTime: number;
  whyShouldICare: string;
  simpleDefinition: string;
  everydayAnalogy: {
    scenario: string;
    explanation: string;
  };
  realWorldExample: {
    title: string;
    description: string;
    details: string[];
  };
  visualDiagram: {
    title: string;
    description: string;
  };
  commonMisconceptions: {
    misconception: string;
    reality: string;
  }[];
  challenge: {
    title: string;
    description: string;
    tasks: string[];
  };
  relatedConcepts: string[];
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: string[];
  isLocked: boolean;
}

export const phases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Digital Foundations',
    description: 'Understand the basics of computers and how they work',
    order: 1,
    lessons: ['computer', 'cpu', 'ram', 'storage', 'operating-system', 'files', 'applications'],
    isLocked: false,
  },
  {
    id: 'phase-2',
    title: 'Internet & Web',
    description: 'Learn how the internet connects the world',
    order: 2,
    lessons: ['internet', 'browser', 'ip-address', 'dns', 'website', 'http', 'https', 'domain', 'hosting', 'server'],
    isLocked: false,
  },
  {
    id: 'phase-3',
    title: 'Software',
    description: 'Discover how software powers modern technology',
    order: 3,
    lessons: ['software-basics', 'applications-v2', 'software-development', 'user-interfaces'],
    isLocked: true,
  },
  {
    id: 'phase-4',
    title: 'Programming',
    description: 'Understand what programmers do and how code works',
    order: 4,
    lessons: ['programming-basics', 'programming-languages', 'code-editors', 'debugging'],
    isLocked: true,
  },
  {
    id: 'phase-5',
    title: 'AI',
    description: 'Explore artificial intelligence and machine learning',
    order: 5,
    lessons: ['ai-basics', 'machine-learning', 'neural-networks', 'ai-in-practice'],
    isLocked: true,
  },
  {
    id: 'phase-6',
    title: 'Cloud',
    description: 'Learn how cloud computing changes everything',
    order: 6,
    lessons: ['cloud-basics', 'cloud-providers', 'cloud-services', 'cloud-benefits'],
    isLocked: true,
  },
  {
    id: 'phase-7',
    title: 'Build Products',
    description: 'Put it all together and create real products',
    order: 7,
    lessons: ['product-thinking', 'building-with-tools', 'launching', 'iterating'],
    isLocked: true,
  },
];

const baseRelatedConcepts: Record<string, string[]> = {
  'computer': ['CPU', 'RAM', 'Operating System', 'Applications'],
  'cpu': ['RAM', 'Computer', 'Processing', 'Software'],
  'ram': ['CPU', 'Storage', 'Memory', 'Operating System'],
  'storage': ['RAM', 'Files', 'Operating System', 'Cloud'],
  'operating-system': ['Computer', 'Files', 'Applications', 'Software'],
  'files': ['Storage', 'Operating System', 'Applications', 'Data'],
  'applications': ['Operating System', 'Files', 'Software', 'User Interface'],
  'internet': ['Browser', 'Server', 'IP Address', 'Website'],
  'browser': ['Internet', 'Website', 'HTTP', 'Search Engine'],
  'ip-address': ['Internet', 'DNS', 'Server', 'Network'],
  'dns': ['IP Address', 'Domain', 'Internet', 'Server'],
  'website': ['Browser', 'Server', 'HTTP', 'Domain'],
  'http': ['HTTPS', 'Website', 'Server', 'API'],
  'https': ['HTTP', 'Website', 'Security', 'SSL Certificate'],
  'domain': ['DNS', 'Website', 'URL', 'Hosting'],
  'hosting': ['Server', 'Website', 'Domain', 'Cloud'],
  'server': ['Internet', 'Hosting', 'Website', 'Database'],
};

export const lessons: LessonContent[] = [
  // Phase 1: Digital Foundations
  {
    id: 'computer',
    title: 'Computer',
    slug: 'computer',
    phaseId: 'phase-1',
    order: 1,
    readingTime: 5,
    whyShouldICare: `Computers are everywhere in your workplace. Understanding what a computer actually is helps you communicate better with technical teams, make smarter purchasing decisions, and troubleshoot basic problems without feeling helpless.`,
    simpleDefinition: `A computer is an electronic device that takes in information (input), processes it using instructions, and produces results (output). Think of it as a super-powered calculator that can handle many different types of tasks—documents, spreadsheets, video calls, and much more.`,
    everydayAnalogy: {
      scenario: 'A kitchen in a busy restaurant.',
      explanation: `The computer is like the entire kitchen operation. The counter where ingredients arrive is the input. The chef who follows recipes to transform ingredients is the processor. The finished dishes leaving the kitchen are the output. Just as a kitchen handles many orders simultaneously using recipes, a computer handles many tasks using programs.`,
    },
    realWorldExample: {
      title: 'Your Work Laptop',
      description: 'When you type an email, your computer receives your keystrokes (input), process them as text, and displays the words on screen (output).',
      details: [
        'Input: Keyboard, mouse, touchscreen, microphone',
        'Processing: The computer follows programs (like Outlook or Word) to understand what you want to do',
        'Output: Text appears on screen, email gets sent, notification sounds play',
        'Storage: Your email is saved so you can read it later',
      ],
    },
    visualDiagram: {
      title: 'How a Computer Works',
      description: 'Input devices send data → Processing happens → Output is produced → Data gets stored for later',
    },
    commonMisconceptions: [
      {
        misconception: 'A computer is just the screen and keyboard.',
        reality: 'The "computer" is actually the processing hardware inside the case. The screen, keyboard, and mouse are just input/output devices that connect to it.',
      },
      {
        misconception: 'Computers think like humans.',
        reality: 'Computers cannot think independently. They only follow very specific instructions created by programmers. They cannot understand context or make judgments.',
      },
      {
        misconception: 'A faster computer will solve all performance problems.',
        reality: 'Performance depends on many factors: the software being used, internet connection, available memory, and whether software is optimized.',
      },
    ],
    challenge: {
      title: 'Computer Detective',
      description: 'Next time you use your computer for work, identify each step in the input-process-output cycle.',
      tasks: [
        'Name three input devices you use regularly',
        'Identify what processing is happening when you open a document',
        'List three outputs your computer produces during your workday',
      ],
    },
    relatedConcepts: baseRelatedConcepts['computer'] || [],
  },
  {
    id: 'cpu',
    title: 'CPU',
    slug: 'cpu',
    phaseId: 'phase-1',
    order: 2,
    readingTime: 6,
    whyShouldICare: `The CPU determines how fast your computer works. When your IT team talks about "upgrading processors" or when you see "Intel i7" or "Apple M2" in specs—they are talking about CPUs. Understanding this helps you have meaningful conversations about performance and hardware purchases.`,
    simpleDefinition: `The CPU (Central Processing Unit) is the "brain" of your computer. It executes instructions—every click you make, every letter you type, every video you play requires the CPU to process billions of tiny calculations per second.`,
    everydayAnalogy: {
      scenario: 'A master chef in a restaurant kitchen.',
      explanation: `The CPU is like the head chef who coordinates everything. The kitchen has many stations (other components), but the head chef decides what happens when, following recipes (programs) to create dishes (output). A faster chef can handle more orders at once, just as a faster CPU handles more tasks.`,
    },
    realWorldExample: {
      title: 'Opening a Large Spreadsheet',
      description: 'When you open a Excel file with thousands of rows, your CPU springs into action.',
      details: [
        'It reads the file from storage (that is the beginning)',
        'It calculates all the formulas in your spreadsheet',
        'It renders each cell on your screen',
        'It responds to your scrolling in real-time',
        'A powerful CPU makes this instant; a slower one causes the "spinning wheel" of waiting',
      ],
    },
    visualDiagram: {
      title: 'CPU Processing Cycle',
      description: 'Fetch instruction → Decode what it means → Execute the action → Store result',
    },
    commonMisconceptions: [
      {
        misconception: 'More CPU cores always mean better performance.',
        reality: 'More cores help with multitasking, but single-task performance depends on clock speed and architecture. A 4-core modern CPU can outperform an 8-core older one.',
      },
      {
        misconception: 'CPU is the only thing that affects speed.',
        reality: 'RAM, storage speed (SSD vs HDD), and software optimization matter equally. A fast CPU with slow storage often waits idle.',
      },
    ],
    challenge: {
      title: 'Task Manager Explorer',
      description: 'Open Task Manager (Ctrl+Shift+Esc on Windows) or Activity Monitor (Mac) during your workday.',
      tasks: [
        'Find your CPU usage percentage when idle',
        'Open several applications and watch CPU usage change',
        'Identify which application uses the most CPU when you work',
      ],
    },
    relatedConcepts: baseRelatedConcepts['cpu'] || [],
  },
  {
    id: 'ram',
    title: 'RAM',
    slug: 'ram',
    phaseId: 'phase-1',
    order: 3,
    readingTime: 5,
    whyShouldICare: `When your computer slows down with many apps open, it is usually a RAM issue. Understanding RAM helps you make smarter decisions about multitasking and explains why closing unused applications often fixes sluggish performance.`,
    simpleDefinition: `RAM (Random Access Memory) is your computer's short-term workspace. It temporarily holds the information your computer is actively using right now. Unlike storage, RAM clears when you restart your computer.`,
    everydayAnalogy: {
      scenario: 'A desk surface vs. a filing cabinet.',
      explanation: `RAM is like the top of your desk where you spread out documents you are actively working on. Storage (like your hard drive) is the filing cabinet across the room. You keep current work on the desk for quick access. When your desk gets too full, you must put things away or work becomes difficult.`,
    },
    realWorldExample: {
      title: 'Browser Tabs',
      description: 'Every browser tab you have open uses RAM. This is why your computer slows down when you have 50+ tabs open.',
      details: [
        'Each tab stores the webpage content in RAM for instant access',
        'Tabs with videos or ads use much more RAM',
        'When RAM fills up, your computer starts using much slower storage',
        'This creates the lag you feel when typing or clicking',
        'Closing tabs frees up RAM and often speeds things up',
      ],
    },
    visualDiagram: {
      title: 'Memory Hierarchy',
      description: 'CPU → RAM (fast, temporary) → Storage (slower, permanent)',
    },
    commonMisconceptions: [
      {
        misconception: 'More RAM always makes your computer faster.',
        reality: 'More RAM only helps if you were running out of RAM. If you only use 4GB of your 16GB, adding more provides no benefit.',
      },
      {
        misconception: 'RAM stores your files permanently.',
        reality: 'RAM is temporary. When you shut down, everything in RAM disappears. This is why you must save your work to storage (hard drive).',
      },
      {
        misconception: 'Clearing RAM improves performance.',
        reality: 'Empty RAM is wasted RAM. Your computer efficiently manages RAM. Forcing it to empty actually makes things slower as apps reload data.',
      },
    ],
    challenge: {
      title: 'RAM Awareness',
      description: 'Observe how your computer behaves with different RAM usage levels.',
      tasks: [
        'Check your current RAM usage in Task Manager',
        'Open progressively more applications until you notice slowdown',
        'Note at what percentage the slowdown becomes noticeable',
      ],
    },
    relatedConcepts: baseRelatedConcepts['ram'] || [],
  },
  {
    id: 'storage',
    title: 'Storage',
    slug: 'storage',
    phaseId: 'phase-1',
    order: 4,
    readingTime: 6,
    whyShouldICare: `All your files, photos, documents, and applications live in storage. The type of storage in your computer dramatically affects how quickly everything loads. Understanding storage helps you make better decisions about backups, cloud services, and hardware purchases.`,
    simpleDefinition: `Storage is your computer's long-term memory. Unlike RAM, storage keeps your data safe even when your computer is turned off. Your operating system, applications, documents, and photos all live in storage until you need them.`,
    everydayAnalogy: {
      scenario: 'A warehouse vs. your desk at work.',
      explanation: `Storage is like a warehouse where everything is organized on shelves. It can hold massive amounts, but retrieving items takes time—you need to walk there, find the right shelf, and bring items back to your desk (RAM). RAM is faster but smaller; storage is larger but slower.`,
    },
    realWorldExample: {
      title: 'SSD vs HDD',
      description: 'Most modern computers have SSD (Solid State Drive) storage, while older ones have HDD (Hard Disk Drive).',
      details: [
        'HDD has spinning physical disks—like a record player',
        'SSD has no moving parts, like a giant USB drive',
        'SSD is typically 5-10x faster than HDD',
        'A computer with SSD boots in seconds; HDD takes minutes',
        'SSD computers cost more but the speed difference is dramatic',
      ],
    },
    visualDiagram: {
      title: 'Storage Types by Speed',
      description: 'Cloud Storage (slowest) → Network Drive → HDD → SSD → RAM (fastest)',
    },
    commonMisconceptions: [
      {
        misconception: 'More storage means a faster computer.',
        reality: 'Storage capacity does not affect speed. What matters is storage type (SSD vs HDD) and quality. A 256GB SSD is much faster than a 2TB HDD.',
      },
      {
        misconception: 'Deleting files speeds up your computer.',
        reality: 'Deleting files frees space but does not affect speed—unless your drive is nearly full (above 90%), which can slow things down.',
      },
      {
        misconception: 'Cloud storage is just storage on the internet.',
        reality: 'Cloud storage is actually storage on someone else server computers, accessed via the internet. It introduces network latency but enables access from anywhere.',
      },
    ],
    challenge: {
      title: 'Storage Detective',
      description: 'Investigate the storage on your work computer.',
      tasks: [
        'Find out how much total storage your computer has',
        'Check how much free space is available',
        'Identify the largest folders or applications using storage',
      ],
    },
    relatedConcepts: baseRelatedConcepts['storage'] || [],
  },
  {
    id: 'operating-system',
    title: 'Operating System',
    slug: 'operating-system',
    phaseId: 'phase-1',
    order: 5,
    readingTime: 7,
    whyShouldICare: `The operating system is the reason you can use a computer without knowing how it works. It is the foundation everything else builds on. Understanding OS concepts helps you troubleshoot problems, understand compatibility issues, and make informed decisions about software purchases.`,
    simpleDefinition: `An Operating System (OS) is the master program that manages everything on your computer. It runs between you and the hardware, translating your clicks into actions, managing memory, running applications, and keeping track of files—and you never have to think about it.`,
    everydayAnalogy: {
      scenario: 'A building superintendent.',
      explanation: `The OS is like the super of an apartment building. Residents (applications) do not worry about plumbing, electricity, or security—the super handles it all. The super assigns apartments (memory), ensures utilities work (hardware interface), and handles complaints (error messages). Residents just live their lives.`,
    },
    realWorldExample: {
      title: 'Common Operating Systems',
      description: 'You have probably used several operating systems without thinking about it.',
      details: [
        'Windows: Dominant in business environments, runs on PCs from many manufacturers',
        'macOS: Apple laptops and desktops, known for design and ecosystem integration',
        'iOS: iPhones and iPads, mobile-focused with strict app controls',
        'Android: Most non-Apple phones, more flexible and customizable',
        'Linux: Powers most servers and many cloud services, rarely seen by end users',
      ],
    },
    visualDiagram: {
      title: 'Where the OS Lives',
      description: 'Hardware → Operating System → Applications → User',
    },
    commonMisconceptions: [
      {
        misconception: 'Applications work on any operating system.',
        reality: 'Applications are built for specific operating systems. A Windows app does not run on Mac without special adaptations. This is why software often has different versions for each OS.',
      },
      {
        misconception: 'The operating system is just the interface you see.',
        reality: 'The visible interface (start menu, taskbar, windows) is just one part. The OS also manages memory, runs processes, handles security, and communicates with hardware—all invisibly.',
      },
      {
        misconception: 'You should always upgrade to the newest OS immediately.',
        reality: 'New OS versions sometimes break older applications. Businesses often wait months to verify compatibility before upgrading.',
      },
    ],
    challenge: {
      title: 'OS Exploration',
      description: 'Learn more about your current operating system.',
      tasks: [
        'Identify which OS version you are using right now',
        'List three tasks your OS performs that you never think about',
        'Check what applications start automatically when your computer boots',
      ],
    },
    relatedConcepts: baseRelatedConcepts['operating-system'] || [],
  },
  {
    id: 'files',
    title: 'Files',
    slug: 'files',
    phaseId: 'phase-1',
    order: 6,
    readingTime: 5,
    whyShouldICare: `Everything you create on a computer—a document, spreadsheet, presentation, photo—is a file. Understanding files helps you organize work, share correctly, avoid losing important data, and communicate with developers who build systems that handle millions of files daily.`,
    simpleDefinition: `A file is a container for data stored on your computer. Files have names and types (indicated by extensions like .docx or .xlsx). Your operating system keeps track of where files are stored so you can find and open them later.`,
    everydayAnalogy: {
      scenario: 'Paper documents in filing cabinets.',
      explanation: `Files are like paper documents. The filename is the label on the folder. The extension is like the document type—memo, invoice, contract. Folders are literal folders. The directory structure is your filing system. Opening a file is pulling a document from the cabinet.`,
    },
    realWorldExample: {
      title: 'File Extensions Explain Everything',
      description: 'File extensions tell your computer what type of data a file contains and which application should open it.',
      details: [
        '.docx → Microsoft Word document',
        '.xlsx → Microsoft Excel spreadsheet',
        '.pdf → Portable Document Format (read-only)',
        '.jpg/.png → Image files',
        '.mp4 → Video files',
        'Wrong extension = wrong application tries to open it',
      ],
    },
    visualDiagram: {
      title: 'File Path Structure',
      description: 'Users/Documents/Work/Q1Report.xlsx → Folder > Folder > Folder > File',
    },
    commonMisconceptions: [
      {
        misconception: 'A file with a .jpg extension must be an image.',
        reality: 'Anyone can rename any file with any extension. A malicious file can hide as image.jpg.exe. Security systems check the actual contents, not just extensions.',
      },
      {
        misconception: 'Deleting a file permanently removes it.',
        reality: 'Deleted files go to the Recycle Bin/Trash and can be recovered. Even after emptying trash, forensic tools can often recover files until overwritten.',
      },
      {
        misconception: 'Saving a file means it is safe.',
        reality: 'Saved files are only on that one device. Hardware failure, theft, or damage can lose everything. This is why backup and cloud sync matter.',
      },
    ],
    challenge: {
      title: 'File Organization Audit',
      description: 'Examine your file management practices.',
      tasks: [
        'Find the oldest file on your computer you still need',
        'Identify three files with extensions you do not recognize',
        'Create a logical folder structure for a current project',
      ],
    },
    relatedConcepts: baseRelatedConcepts['files'] || [],
  },
  {
    id: 'applications',
    title: 'Applications',
    slug: 'applications',
    phaseId: 'phase-1',
    order: 7,
    readingTime: 6,
    whyShouldICare: `Applications are what make computers useful for you. Every time you open Word, Slack, Excel, or Chrome, you are using an application. Understanding how applications work helps you troubleshoot crashes, understand compatibility, and communicate with development teams.`,
    simpleDefinition: `An application (or "app") is a program designed to perform specific tasks for users. Applications take your inputs (clicks, typing, file selections) and turn them into useful outputs—documents, calculations, communications, and visualizations.`,
    everydayAnalogy: {
      scenario: 'Tools in a workshop.',
      explanation: `Applications are like specialized tools. A hammer does one job well (driving nails). A drill does another (making holes). You choose the right tool for each task. Each tool has controls you learn, and higher-quality tools work better but cost more. Your OS is the workshop keeping it all organized.`,
    },
    realWorldExample: {
      title: 'Types of Applications',
      description: 'Applications come in several categories you use daily.',
      details: [
        'Productivity: Word, Excel, PowerPoint, Google Docs',
        'Communication: Gmail, Slack, Teams, Zoom',
        'Web Browsers: Chrome, Safari, Firefox, Edge',
        'Creative: Photoshop, Figma, Premiere Pro',
        'System Tools: Antivirus, Backup software, Password managers',
        'Business: Salesforce, SAP, HubSpot, Jira',
      ],
    },
    visualDiagram: {
      title: 'Application Layers',
      description: 'User Interface (what you see) → Application Logic (rules) → Data Storage (files/databases)',
    },
    commonMisconceptions: [
      {
        misconception: 'Closing a window always closes the application.',
        reality: 'Many applications keep running in the background (check your system tray or menu bar). Some sync data even when "closed."',
      },
      {
        misconception: 'All applications on my phone are the same type.',
        reality: 'Native apps (installed), web apps (browser-based), and hybrid apps combine both. They have different capabilities and performance.',
      },
      {
        misconception: 'More expensive applications are always better.',
        reality: 'Free alternatives (like LibreOffice vs. Microsoft Office) often meet basic needs. Price reflects target market, features, and brand, not just quality.',
      },
    ],
    challenge: {
      title: 'Application Inventory',
      description: 'Take stock of the applications you depend on.',
      tasks: [
        'List every application you use in a typical workday',
        'Identify which applications you could not do your job without',
        'Find one application alternative you did not know about',
      ],
    },
    relatedConcepts: baseRelatedConcepts['applications'] || [],
  },
  // Phase 2: Internet & Web
  {
    id: 'internet',
    title: 'Internet',
    slug: 'internet',
    phaseId: 'phase-2',
    order: 1,
    readingTime: 6,
    whyShouldICare: `The internet is the infrastructure your business depends on daily—email, video calls, cloud applications, research. Understanding what it actually is helps you grasp why things sometimes fail, why geography affects speed, and what developers mean when they talk about network issues.`,
    simpleDefinition: `The internet is a global network of connected computers that communicate using standardized rules (protocols). It is not a place or a service—it is infrastructure, like the road system that enables vehicles to travel between locations.`,
    everydayAnalogy: {
      scenario: 'The highway system.',
      explanation: `The internet is like roads connecting cities. The "cities" are computers and servers. "Traffic" is data. You can travel (send data) from any city to any other—but routes may have traffic, construction (outages), or require traveling through certain hubs. No single entity owns all the roads.`,
    },
    realWorldExample: {
      title: 'Sending an Email',
      description: 'When you send an email to a colleague in another country, here is what happens.',
      details: [
        'Your computer sends data to your email server',
        'Your email server looks up the destination server',
        'Data travels through multiple network hubs across countries',
        'Each hub forwards packets closer to the destination',
        'The destination server receives and stores the message',
        'Your colleague downloads it from their server',
        'This happens in seconds across thousands of miles',
      ],
    },
    visualDiagram: {
      title: 'Internet Hierarchy',
      description: 'Your Device → ISP → Internet Backbone → Destination Server → Content',
    },
    commonMisconceptions: [
      {
        misconception: 'The internet and the web are the same thing.',
        reality: 'The web is just one use of the internet. Email, video calls, file transfers, gaming, and many other services all use the internet but are not "the web."',
      },
      {
        misconception: 'The internet is controlled by one company or government.',
        reality: 'The internet is decentralized. Many organizations own pieces. ICANN coordinates addresses, but no single entity controls everything.',
      },
      {
        misconception: 'WiFi and internet are the same.',
        reality: 'WiFi is just the wireless connection between your device and your router. Internet connectivity comes from your ISP through that router.',
      },
    ],
    challenge: {
      title: 'Internet Trace',
      description: 'Understand your internet connection path.',
      tasks: [
        'Identify who your Internet Service Provider (ISP) is',
        'Check your internet speed at speedtest.net',
        'Notice how speed changes at different times of day',
      ],
    },
    relatedConcepts: baseRelatedConcepts['internet'] || [],
  },
  {
    id: 'browser',
    title: 'Browser',
    slug: 'browser',
    phaseId: 'phase-2',
    order: 2,
    readingTime: 5,
    whyShouldICare: `Your browser is your primary work tool for research, web applications, and communication. Understanding what a browser actually does helps you troubleshoot issues, understand why websites look different on different browsers, and communicate with developers about compatibility problems.`,
    simpleDefinition: `A web browser is software that retrieves, interprets, and displays content from the internet. It speaks the language of the web (HTTP), downloads code (HTML, CSS, JavaScript), and renders it into the interactive pages you see.`,
    everydayAnalogy: {
      scenario: 'A translator and interpreter.',
      explanation: `The browser receives documents written in specialized languages (HTML, CSS, JavaScript) that you cannot read directly. It translates these instructions into the visual, interactive pages you can understand and use—just as an interpreter turns foreign speech into your language.`,
    },
    realWorldExample: {
      title: 'What Happens When You Visit a Website',
      description: 'Opening a URL triggers a complex process you never see.',
      details: [
        'You type a URL and press Enter',
        'Browser looks up the address (DNS) of that website server',
        'Browser sends a request for the page',
        'Server sends back HTML code (structure)',
        'Browser requests images, styles, and scripts referenced in HTML',
        'Browser executes JavaScript for interactivity',
        'All this happens in under 2 seconds for most sites',
      ],
    },
    visualDiagram: {
      title: 'Browser Rendering Pipeline',
      description: 'URL → Request → HTML → Parse → Render → Display',
    },
    commonMisconceptions: [
      {
        misconception: 'All browsers display websites the same way.',
        reality: 'Different browsers interpret code slightly differently. Developers test on multiple browsers because layouts can break on some.',
      },
      {
        misconception: 'Your browser is the internet.',
        reality: 'The browser is just a viewer. Other applications (like email clients, Slack, Spotify) also access the internet without using a browser.',
      },
      {
        misconception: 'Clearing "browser data" clears everything.',
        reality: 'Browser data includes cache, cookies, and history. Your actual files and accounts elsewhere are unaffected. It often improves performance.',
      },
    ],
    challenge: {
      title: 'Browser Comparison',
      description: 'Experiment with different browsers to see differences.',
      tasks: [
        'Open the same website in two different browsers',
        'Look for any visual differences between them',
        'Check how many browser extensions you have installed',
      ],
    },
    relatedConcepts: baseRelatedConcepts['browser'] || [],
  },
  {
    id: 'ip-address',
    title: 'IP Address',
    slug: 'ip-address',
    phaseId: 'phase-2',
    order: 3,
    readingTime: 6,
    whyShouldICare: `Every device on the internet has an IP address—your laptop, phone, work computer, the servers hosting your company website. When developers talk about network configuration or security mentions IP filtering, they are using this concept.`,
    simpleDefinition: `An IP (Internet Protocol) address is a unique identifier assigned to every device on a network—like a phone number for computers. It ensures data reaches the correct destination among billions of connected devices.`,
    everydayAnalogy: {
      scenario: 'A home mailing address.',
      explanation: `Your home address tells the postal service exactly where to deliver mail. An IP address tells the internet exactly where to deliver data. Without addresses, mail would be impossible to deliver. Without IP addresses, data packets would have no destination.`,
    },
    realWorldExample: {
      title: 'IP Address in Action',
      description: 'When you visit a website, IP addressing works at every step.',
      details: [
        'Your device has an IP address (like 192.168.1.105)',
        'Your router has an internal IP and an external IP',
        'Your ISP assigns a public IP to your connection',
        'The website server has its own IP address',
        'Data finds its way through each hop using these addresses',
        'IPv4 is running out—IPv6 adds trillions more addresses',
      ],
    },
    visualDiagram: {
      title: 'IP Address Hierarchy',
      description: 'Your Device IP → Router IP → ISP Public IP → Destination Server IP',
    },
    commonMisconceptions: [
      {
        misconception: 'My IP address identifies me personally.',
        reality: 'IP addresses identify network connections, not people. Many people share one IP (like in an office). VPNs and mobile networks change IPs constantly.',
      },
      {
        misconception: 'IP addresses are always the same.',
        reality: 'Most IPs are dynamic—they change. Your home IP might change when you restart your router. Only servers typically have static (permanent) IPs.',
      },
      {
        misconception: 'Anyone can find my location from my IP.',
        reality: 'IP geolocation is approximate—usually city-level at best. It cannot pinpoint your exact address. It is more like knowing someone is in Chicago, not their street.',
      },
    ],
    challenge: {
      title: 'IP Investigation',
      description: 'Discover your IP addresses.',
      tasks: [
        'Search "what is my IP" to find your public IP',
        'Check your device local IP in network settings',
        'Notice that your public IP changes if you disconnect and reconnect',
      ],
    },
    relatedConcepts: baseRelatedConcepts['ip-address'] || [],
  },
  {
    id: 'dns',
    title: 'DNS',
    slug: 'dns',
    phaseId: 'phase-2',
    order: 4,
    readingTime: 6,
    whyShouldICare: `Without DNS, you would have to memorize numbers to visit any website. When tech support mentions "DNS issues," they are explaining why websites are not loading. Understanding DNS helps you grasp how domain names work and why sometimes "the internet seems broken" but it is actually this one system.`,
    simpleDefinition: `DNS (Domain Name System) is the internet phonebook. It translates human-readable domain names (like "google.com") into IP addresses (like "142.250.190.78") that computers use. Without DNS, you would need to memorize IP addresses for every website.`,
    everydayAnalogy: {
      scenario: 'A phone contact list.',
      explanation: `You do not memorize phone numbers—you save them with contact names. When you tap "Mom," your phone looks up the number and dials it. DNS does the same for websites. You type a memorable name; DNS looks up the number (IP address) for you.`,
    },
    realWorldExample: {
      title: 'What DNS Does When You Type a URL',
      description: 'The journey from typing to viewing involves DNS at every step.',
      details: [
        'You type "company.com" into your browser',
        'Your computer asks: "What IP is company.com?"',
        'DNS servers respond: "It is 203.0.113.45"',
        'Your browser now knows where to send the request',
        'This happens in milliseconds, billions of times daily',
        'Cached results mean future visits skip the lookup',
      ],
    },
    visualDiagram: {
      title: 'DNS Resolution Process',
      description: 'Domain Name → DNS Query → Nameservers → IP Address Response → Connection',
    },
    commonMisconceptions: [
      {
        misconception: 'DNS is a single database.',
        reality: 'DNS is a distributed system of millions of servers worldwide. No single server holds all domain information—they pass requests to the correct servers.',
      },
      {
        misconception: 'DNS only handles websites.',
        reality: 'DNS directs email, instant messaging, and any network service that uses domain names. Email servers look up DNS to know where to deliver messages.',
      },
      {
        misconception: 'DNS changes are instant.',
        reality: 'DNS changes can take hours to propagate worldwide due to caching. This is why new domains sometimes do not work immediately everywhere.',
      },
    ],
    challenge: {
      title: 'DNS Detective',
      description: 'See DNS in action.',
      tasks: [
        'Open terminal and type "nslookup google.com"',
        'Note the IP address that appears',
        'Try a different website and compare IPs',
      ],
    },
    relatedConcepts: baseRelatedConcepts['dns'] || [],
  },
  {
    id: 'website',
    title: 'Website',
    slug: 'website',
    phaseId: 'phase-2',
    order: 5,
    readingTime: 5,
    whyShouldICare: `Websites are fundamental to modern business—your company has one, your competitors have them, and you probably access dozens daily for work. Understanding what a website actually is helps you participate in conversations about web development, understand why features request budgets, and set realistic expectations.`,
    simpleDefinition: `A website is a collection of related web pages identified by a domain name, stored on a server, and accessible via the internet. Websites are built from code (HTML, CSS, JavaScript) that browsers interpret into visual, interactive experiences.`,
    everydayAnalogy: {
      scenario: 'A digital office building.',
      explanation: `A website is like an office building with floors (pages) connected by hallways and elevators (links). The domain name is the street address. The server is the physical building. The individual pages are offices. You enter through the lobby (homepage) and navigate to what you need.`,
    },
    realWorldExample: {
      title: 'Website Types for Different Purposes',
      description: 'Businesses use different website types based on needs.',
      details: [
        'Marketing sites: Company information, services, contact',
        'E-commerce: Online stores with shopping carts and checkout',
        'Web applications: Gmail, Salesforce, Slack—full software in browser',
        'Portals: Client access to documents, support, tracking',
        'Blogs/Content sites: Articles, news, resources',
        'Landing pages: Single pages focused on one conversion goal',
      ],
    },
    visualDiagram: {
      title: 'Website Architecture',
      description: 'Domain → Server → Pages (HTML/CSS/JS) → Browser → User',
    },
    commonMisconceptions: [
      {
        misconception: 'A website is one thing.',
        reality: 'A website has many pages, files, databases, and systems working together. "Updating the website" can mean changing text or rebuilding the entire system.',
      },
      {
        misconception: 'Making a website is one skill.',
        reality: 'Modern websites require designers (visual), developers (coding), content writers, and often multiple specialists for different technical needs.',
      },
      {
        misconception: 'Once launched, a website is done.',
        reality: 'Websites require ongoing updates for security, content, features, and compatibility with new browsers and devices.',
      },
    ],
    challenge: {
      title: 'Website Analysis',
      description: 'Analyze how a professional website is built.',
      tasks: [
        'Visit a competitor website and count how many pages you can find',
        'Notice the navigation structure—how are pages organized?',
        'Identify what makes the site feel professional or not',
      ],
    },
    relatedConcepts: baseRelatedConcepts['website'] || [],
  },
  {
    id: 'http',
    title: 'HTTP',
    slug: 'http',
    phaseId: 'phase-2',
    order: 6,
    readingTime: 6,
    whyShouldICare: `HTTP is the language of the web. When developers discuss API integrations, loading times, or status codes (like the infamous 404 error), they are talking HTTP. Understanding it demystifies many conversations about web development and debugging.`,
    simpleDefinition: `HTTP (Hypertext Transfer Protocol) is the set of rules computers use to exchange web content. It defines how browsers request pages and how servers respond. Every time you load a webpage, your browser speaks HTTP to a server.`,
    everydayAnalogy: {
      scenario: 'A waiter at a restaurant.',
      explanation: `HTTP works like restaurant service. You (browser) tell the waiter what you want (request). The kitchen (server) prepares it. The waiter brings back your order (response). Sometimes items are unavailable (error codes). The menu describes available options (API documentation).`,
    },
    realWorldExample: {
      title: 'HTTP in Your Daily Work',
      description: 'HTTP status codes appear everywhere once you know them.',
      details: [
        '200 OK: Request succeeded—everything worked',
        '301 Redirect: Page moved permanently—browser takes you to new location',
        '403 Forbidden: You cannot access this—permissions issue',
        '404 Not Found: Page does not exist—mistyped URL or deleted page',
        '500 Server Error: Something broke on their end—not your fault',
        'Understanding codes helps you report problems accurately',
      ],
    },
    visualDiagram: {
      title: 'HTTP Request-Response Cycle',
      description: 'Client Request → Server Processing → Response → Client Rendering',
    },
    commonMisconceptions: [
      {
        misconception: 'HTTP only handles web pages.',
        reality: 'HTTP transfers any data: images, videos, JSON documents, files. Mobile apps often use HTTP to communicate with servers behind the scenes.',
      },
      {
        misconception: 'HTTP keeps a continuous connection.',
        reality: 'HTTP is stateless—each request is independent. Each image on a page is a separate HTTP request. Servers do not remember you between requests.',
      },
      {
        misconception: 'HTTP is secure.',
        reality: 'Plain HTTP sends data in readable text. Anyone watching network traffic can read it. HTTPS encrypts everything—which is why modern sites use it.',
      },
    ],
    challenge: {
      title: 'HTTP Status Code Hunter',
      description: 'Find HTTP codes in real life.',
      tasks: [
        'Deliberately visit a page that does not exist to see a 404',
        'Open browser developer tools (F12) and watch the Network tab',
        'Identify the HTTP codes for resources loading on this page',
      ],
    },
    relatedConcepts: baseRelatedConcepts['http'] || [],
  },
  {
    id: 'https',
    title: 'HTTPS',
    slug: 'https',
    phaseId: 'phase-2',
    order: 7,
    readingTime: 5,
    whyShouldICare: `HTTPS protects your credentials, payment information, and private communications. When you see the lock icon or "Not Secure" warning, HTTPS—or lack of it—is the reason. Understanding it helps you recognize secure vs. risky websites and why modern browsers insist on HTTPS.`,
    simpleDefinition: `HTTPS (HTTP Secure) is HTTP with encryption enabled. It uses SSL/TLS protocols to scramble data during transmission, preventing anyone intercepting network traffic from reading sensitive information like passwords or credit card numbers.`,
    everydayAnalogy: {
      scenario: 'Sending a letter in a sealed envelope vs. a postcard.',
      explanation: `HTTP is like a postcard—anyone handling it can read the message. HTTPS is like a sealed envelope inside a locked briefcase. Even if someone intercepts the delivery, they cannot read the contents without a special key only the recipient possesses.`,
    },
    realWorldExample: {
      title: 'When HTTPS Matters',
      description: 'HTTPS is critical for certain types of data.',
      details: [
        'Login pages: Protects your username and password',
        'Payment forms: Encrypts credit card numbers',
        'Personal data: Protects health info, addresses, SSNs',
        'Business communications: Keeps strategy and plans private',
        'Modern browsers: Warn users about non-HTTPS sites',
        'Search rank boost: Google ranks HTTPS sites higher',
      ],
    },
    visualDiagram: {
      title: 'HTTPS Handshake Process',
      description: 'Server proves identity → Keys exchanged → Secure channel established → Encrypted data flows',
    },
    commonMisconceptions: [
      {
        misconception: 'HTTPS means a website is trustworthy.',
        reality: 'HTTPS only means the connection is encrypted. Scammers can also get HTTPS certificates. The lock icon does not verify the website is legitimate.',
      },
      {
        misconception: 'HTTPS makes data completely safe.',
        reality: 'HTTPS protects data in transit. Once data reaches the server, it is stored there. If the server is hacked, HTTPS did not help. Security requires multiple layers.',
      },
      {
        misconception: 'HTTPS slows down websites.',
        reality: 'Modern HTTPS has minimal performance impact. The tiny delay is worth the security benefit. Most users cannot notice any difference.',
      },
    ],
    challenge: {
      title: 'HTTPS Checker',
      description: 'Audit the security of websites you use.',
      tasks: [
        'Check if your email provider uses HTTPS',
        'Visit your banking website and verify HTTPS',
        'Find a website that still shows "Not Secure" (no HTTPS)',
      ],
    },
    relatedConcepts: baseRelatedConcepts['https'] || [],
  },
  {
    id: 'domain',
    title: 'Domain',
    slug: 'domain',
    phaseId: 'phase-2',
    order: 8,
    readingTime: 5,
    whyShouldICare: `Your company domain (yourcompany.com) is a critical business asset. Domains require registration, renewal, and protection. Understanding domains helps you participate in branding conversations, recognize phishing attempts, and understand why certain web addresses cost more than others.`,
    simpleDefinition: `A domain is a human-readable address for a website—like "google.com" or "yourcompany.com". Domains replace IP addresses as the easy way to find websites. Behind the scenes, DNS converts domains to IP addresses.`,
    everydayAnalogy: {
      scenario: 'A trademarked business name.',
      explanation: `A domain is like registering your business name with the government. Once registered, only you can use it. You must pay renewal fees regularly. If you forget to renew, someone else can claim it. Premium locations (short, memorable names) cost more.`,
    },
    realWorldExample: {
      title: 'Domain Structure',
      description: 'Domains have parts that mean different things.',
      details: [
        'Full domain: www.example.com',
        'Subdomain: www (the "www" part)',
        'Domain name: example',
        'Top-level domain (TLD): .com, .org, .net, .io',
        'Domain registrars: GoDaddy, Namecheap, Google Domains',
        'Popular TLDs cost more; new TLDs like .ai and .app are available',
      ],
    },
    visualDiagram: {
      title: 'Domain Anatomy',
      description: 'https://blog.company.com → Subdomain.Domain.TLD',
    },
    commonMisconceptions: [
      {
        misconception: ' Owning a trademark gives you the domain.',
        reality: 'Trademarks and domains are separate. Others may register your trademark as their domain. Recovering domains can require legal action or paying high prices.',
      },
      {
        misconception: 'All domains cost the same.',
        reality: 'Domain prices vary wildly. Regular domains cost $10-20/year. Premium domains (short, common words) can cost thousands or millions.',
      },
      {
        misconception: 'A domain includes a website.',
        reality: 'Registering a domain only claims the name. You still need to build and host a website separately—like buying the address but still needing to construct the building.',
      },
    ],
    challenge: {
      title: 'Domain Investigation',
      description: 'Research domain ownership.',
      tasks: [
        'Use whois lookup to see who owns a famous domain',
        'Check if your dream domain name is available',
        'Compare prices for .com vs .io vs .co domains',
      ],
    },
    relatedConcepts: baseRelatedConcepts['domain'] || [],
  },
  {
    id: 'hosting',
    title: 'Hosting',
    slug: 'hosting',
    phaseId: 'phase-2',
    order: 9,
    readingTime: 6,
    whyShouldICare: `Every website you use is hosted somewhere. Hosting affects website speed, reliability, and sometimes what features are possible. Understanding hosting helps you ask informed questions when vendors propose solutions and understand why some websites are faster or more reliable than others.`,
    simpleDefinition: `Hosting is the service of storing website files on specially configured computers (servers) connected to high-speed internet, making them accessible to visitors worldwide. Without hosting, your website files have nowhere visible to live.`,
    everydayAnalogy: {
      scenario: 'Renting office space.',
      explanation: `Hosting is like renting physical space for your business. You need a location (server) with good roads (internet connectivity), electricity (power reliability), and space for all your equipment (storage). You can rent a desk (shared hosting), office suite (VPS), or entire building (dedicated server).`,
    },
    realWorldExample: {
      title: 'Types of Hosting',
      description: 'Different hosting solutions fit different needs.',
      details: [
        'Shared hosting: Cheapest, many sites on one server, good for small sites',
        'VPS (Virtual Private Server): Dedicated portion of a server, more control',
        'Dedicated server: Entire server for one site, enterprise-level',
        'Cloud hosting: Spread across many servers, scalable, pay for what you use',
        'Managed hosting: Provider handles technical maintenance',
        'Companies: AWS, Google Cloud, DigitalOcean, Netlify, Vercel',
      ],
    },
    visualDiagram: {
      title: 'Hosting Choice Spectrum',
      description: 'Shared (cheapest, least control) → VPS → Dedicated → Cloud (most flexible)',
    },
    commonMisconceptions: [
      {
        misconception: 'Hosting is just storage space.',
        reality: 'Hosting includes compute power, memory, bandwidth, security, backups, support, and often databases. It is a complete computing environment, not just a file locker.',
      },
      {
        misconception: 'Expensive hosting means a faster website.',
        reality: 'Hosting is just one factor. Poorly built websites run slowly even on expensive hosting. Well-optimized sites can be fast on cheap hosting.',
      },
      {
        misconception: 'Hosting handles everything technical.',
        reality: 'Shared hosting manages the basics. As you scale or need custom configurations, you or your developer must handle more technical details.',
      },
    ],
    challenge: {
      title: 'Hosting Research',
      description: 'Compare hosting options.',
      tasks: [
        'Research what hosting your company website uses',
        'Compare prices for shared hosting vs. VPS',
        'Read reviews of well-known hosting providers',
      ],
    },
    relatedConcepts: baseRelatedConcepts['hosting'] || [],
  },
  {
    id: 'server',
    title: 'Server',
    slug: 'server',
    phaseId: 'phase-2',
    order: 10,
    readingTime: 6,
    whyShouldICare: `Servers power everything your business does online—email, websites, cloud applications, video calls. When IT mentions server maintenance, outages, or capacity, they are talking about the computers that make modern work possible.`,
    simpleDefinition: `A server is a computer designed to provide services to other computers. Unlike your laptop (designed for one person), servers handle requests from many users simultaneously, running 24/7 in climate-controlled data centers.`,
    everydayAnalogy: {
      scenario: 'A restaurant kitchen.',
      explanation: `Your laptop is a home kitchen—efficient for personal meals. A server is a professional kitchen serving hundreds of customers. It has more ovens (CPU cores), counter space (RAM), and storage (hard drives). Chefs (software) work in shifts to serve meals (data) to anyone who orders (requests).`,
    },
    realWorldExample: {
      title: 'Servers in Your Work Day',
      description: 'Servers are involved in almost everything you do.',
      details: [
        'Email server: Stores and routes your messages',
        'Web server: Hosts company website and intranet',
        'File server: Stores shared documents in your organization',
        'Authentication server: Verifies logins and permissions',
        'Database server: Stores application data',
        'Application server: Runs business software you use',
        'These are often many virtual servers on fewer physical machines',
      ],
    },
    visualDiagram: {
      title: 'Client-Server Model',
      description: 'Client (your device) → Internet → Server → Database → Server → Client',
    },
    commonMisconceptions: [
      {
        misconception: 'A server is completely different from a personal computer.',
        reality: 'Servers and personal computers share the same components—CPU, RAM, storage. Servers just have more of everything and run different software optimized for serving many users.',
      },
      {
        misconception: 'Servers never fail.',
        reality: 'Servers fail all the time. Professional operations use redundancy—multiple servers, backups, failover—so one failure does not take everything down.',
      },
      {
        misconception: 'Cloud means no servers.',
        reality: 'Cloud computing is still servers—lots of them managed by someone else. Amazon, Google, and Microsoft run millions of servers in their cloud data centers.',
      },
    ],
    challenge: {
      title: 'Server Awareness',
      description: 'Map the servers you depend on.',
      tasks: [
        'List five servers that support your work day',
        'Research what happens when a critical server goes down',
        'Ask IT what redundancy protects your critical systems',
      ],
    },
    relatedConcepts: baseRelatedConcepts['server'] || [],
  },
];

export function getLessonBySlug(slug: string): LessonContent | undefined {
  return lessons.find(lesson => lesson.slug === slug);
}

export function getLessonsByPhase(phaseId: string): LessonContent[] {
  return lessons.filter(lesson => lesson.phaseId === phaseId);
}

export function getPhaseById(phaseId: string): Phase | undefined {
  return phases.find(phase => phase.id === phaseId);
}

export function getNextLesson(currentSlug: string): LessonContent | undefined {
  const currentIndex = lessons.findIndex(lesson => lesson.slug === currentSlug);
  return lessons[currentIndex + 1];
}

export function getPreviousLesson(currentSlug: string): LessonContent | undefined {
  const currentIndex = lessons.findIndex(lesson => lesson.slug === currentSlug);
  return currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
}
