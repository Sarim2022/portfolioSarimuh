// Terminal Portfolio - Vanilla JavaScript
// Command system and interaction logic

const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');
const cursor = document.getElementById('cursor');

let commandHistory = [];
let historyIndex = -1;
let isTyping = false;

// Portfolio data
const portfolioData = {
    about: {
        name: "Sarim",
        role: "Android Developer",
        bio: "Passionate Android developer and Computer Science student crafting innovative mobile solutions.",
        passion: "Building mobile applications that solve real-world problems and enhance user experiences.",
        mindset: "Always learning, always building, always improving."
    },
    skills: {
        "Languages/Core": ["Java", "Python", "CSS", "HTML", "SQL", "Kotlin", "XML", "JavaScript (Beginner)"],
        "Other": ["Data Structures & Algorithms", "REST APIs", "Machine Learning", "Artificial Intelligence (Beginner)"]
    },
    projects: {
        "medremainders": {
            name: "MedRemainders App",
            description: "A mobile app to alert users for medicine intake and track health routines. Features intelligent reminders and health tracking capabilities.",
            tech: "Flutter, Machine Learning, Firebase",
            livePreview: "https://sarim2022.github.io/medremainders/"
        },
        "android-todo": {
            name: "Android-ToDo-App",
            description: "A comprehensive task-management app with intuitive UI and seamless data synchronization.",
            tech: "Kotlin, XML, Java, Android tools, Firebase, Github",
            livePreview: "https://sarim2022.github.io/Android-ToDo-App/"
        },
        "markmyattendance": {
            name: "MarkMyAttendence",
            description: "A digital attendance system for college students with secure login and real-time record tracking. Streamlines attendance management for educational institutions.",
            tech: "Android, Kotlin, Firebase",
            livePreview: "https://sarim2022.github.io/markmyattendance/"
        },
        "minichatbot": {
            name: "MiniChatBot",
            description: "A terminal theme chatbot with basic features built using HTML, CSS, and JavaScript. Interactive command-based interface with modern dark theme.",
            tech: "HTML, CSS, JavaScript",
            livePreview: "https://sarim2022.github.io/minichatbot/"
        },
        "crackerscode": {
            name: "Crackerscode",
            description: "A password generator and checker with functional design built in JavaScript. Helps users create secure passwords and verify password strength.",
            tech: "JavaScript, HTML, CSS",
            livePreview: "https://sarim2022.github.io/Crackerscode/"
        }
    },
    education: [
        {
            degree: "Bachelor of Technology",
            field: "Computer Science & Engineering",
            institution: "Jamia Hamdard University, New Delhi",
            year: "09/2022 - Present",
            cgpa: "CGPA (until 6th sem): 7.18"
        },
        {
            degree: "Schooling",
            field: "CBSE Board",
            institution: "Victoria Modern Public School",
            year: "2022 (CBSE): 62% | 2020: 68%"
        }
    ],
    experience: [
        {
            role: "Android Developer Intern",
            company: "Paytm",
            duration: "July 2025 - Jan 2026",
            description: "Improving the Android app's UI and integrating backend APIs to enhance user experience and payment functionalities."
        }
    ],
    learning: [
        "Machine Learning",
        "Artificial Intelligence",
        "Advanced Android Development",
        "REST APIs",
        "JavaScript"
    ],
    interests: [
        "Games",
        "Coding",
        "Problem Solving",
        "Travelling"
    ],
    contact: {
        email: "sarimhasan2022@gmail.com",
        phone: "8448048903",
        location: "New Delhi, India",
        github: "https://github.com/Sarim2022",
        leetcode: "https://leetcode.com/u/sarimhasan2022/",
        leetcodeStats: "140+ problems solved",
        linkedin: "https://www.linkedin.com/in/sarimhasanprofes67?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
        geeksforgeeks: "https://geeksforgeeks.org/profile/sarimhasowyc"
    },
    certificates: [
        "Python certificate from HackerRank",
        "Problem solving (Basic) certificate",
        "MySQL certificate"
    ],
    achievements: [
        "Google Cloud Arcade Facilitator Program (2025 C1) — earned 50+ badges and won exclusive swag"
    ],
    resume: {
        view: "https://drive.google.com/file/d/1HWwIVd8mFQcgt25BHkRGbvQkIW8Ds4a3/view",
        download: "https://drive.google.com/uc?export=download&id=1HWwIVd8mFQcgt25BHkRGbvQkIW8Ds4a3"
    }
};

// Initialize terminal
function initTerminal() {
    setTimeout(() => {
        showHelp();
    }, 1500);
}

// Add output line with typing animation
function addOutputLine(text, className = "", delay = 0) {
    if (isTyping) {
        setTimeout(() => addOutputLine(text, className, delay), 100);
        return;
    }

    isTyping = true;
    const line = document.createElement('div');
    line.className = 'output-line typing-animation';
    
    setTimeout(() => {
        if (className) {
            const span = document.createElement('span');
            span.className = className;
            span.textContent = text;
            line.appendChild(span);
        } else {
            line.innerHTML = text;
        }
        
        terminalOutput.appendChild(line);
        scrollToBottom();
        isTyping = false;
    }, delay);
}

// Scroll to bottom
function scrollToBottom() {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Process commands
window.processCommand = function(input) {
    const command = input.trim().toLowerCase();
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1).join(' ');

    addOutputLine(`<span class="prompt">$</span> ${input}`, "command-text");

    switch (cmd) {
        case 'help':
            showHelp();
            break;
        case 'about':
            showAbout();
            break;
        case 'skills':
            showSkills();
            break;
        case 'projects':
            showProjects();
            break;
        case 'experience':
            showExperience();
            break;
        case 'certificates':
            showCertificates();
            break;
        case 'resume':
            showResume();
            break;
        case 'status':
            showStatus();
            break;
        case 'sudo':
            const fullCommand = input.trim().toLowerCase();
            if (fullCommand === 'sudo hire sarim') {
                showHireSarim();
            } else {
                addOutputLine("Permission denied. Try: sudo hire sarim", "error-text");
            }
            break;
        case 'clear':
            clearTerminal();
            break;
        case '':
            break;
        default:
            addOutputLine(`WHOOP 🧟‍♀️🧟‍♀️🧟‍♀️🧟‍♀️🧟‍♀️🧟‍♀️`, "error-text");
            addOutputLine(`Try typing 'help' to see all available commands.`, "info-text");
    }
}

// Command implementations
function showHelp() {
    const commands = [
        { cmd: 'help', desc: 'Show list of available commands' },
        { cmd: 'about', desc: 'Display information about me' },
        { cmd: 'skills', desc: 'Show technical skills' },
        { cmd: 'projects', desc: 'List all projects' },
        { cmd: 'experience', desc: 'Show work experience and education' },
        { cmd: 'coding profile', desc: 'Show coding profiles (LeetCode, GitHub, LinkedIn, etc.)' },
        { cmd: 'certificates', desc: 'Show certificates and certifications' },
        { cmd: 'resume', desc: 'View and download resume' },
        { cmd: 'status', desc: 'Show current status and availability' },
        { cmd: 'sudo hire sarim', desc: 'Grant permission to hire (includes contact info)' },
        { cmd: 'clear', desc: 'Clear the terminal screen' }
    ];

    let output = '<div class="section-title">Available Commands:</div>';
    commands.forEach(item => {
        output += `<div class="section-content"><span class="info-text">${item.cmd}</span> - ${item.desc}</div>`;
    });
    
    addOutputLine(output);
}

function showAbout() {
    const about = portfolioData.about;
    let output = `
        <div class="section-title">About</div>
        <div class="section-content">
            <div><span class="info-text">Name:</span> ${about.name}</div>
            <div><span class="info-text">Role:</span> ${about.role}</div>
            <div><span class="info-text">Bio:</span> ${about.bio}</div>
            <div><span class="info-text">Passion:</span> ${about.passion}</div>
            <div><span class="info-text">Mindset:</span> ${about.mindset}</div>
        </div>
    `;
    addOutputLine(output);
}

function showSkills() {
    const skills = portfolioData.skills;
    let output = '<div class="section-title">Skills Stack</div>';
    
    Object.keys(skills).forEach(category => {
        output += `<div class="skill-group"><div class="skill-category">${category}:</div>`;
        skills[category].forEach(skill => {
            output += `<div class="skill-item">• ${skill}</div>`;
        });
        output += '</div>';
    });
    
    addOutputLine(output);
}

function showProjects() {
    const projects = portfolioData.projects;
    let output = '<div class="section-title">Projects</div>';
    
    Object.keys(projects).forEach(key => {
        const project = projects[key];
        const desc = project.description.length > 60 ? project.description.substring(0, 60) + '...' : project.description;
        let projectLine = `<div class="section-content"><span class="info-text">${project.name}</span> - ${desc}`;
        if (project.livePreview) {
            projectLine += ` <a href="${project.livePreview}" target="_blank" class="link">[Live Preview]</a>`;
        }
        projectLine += '</div>';
        output += projectLine;
    });
    
    addOutputLine(output);
}

function showExperience() {
    const experience = portfolioData.experience;
    const education = portfolioData.education;
    
    let output = '<div class="section-title">Experience</div>';
    
    experience.forEach(exp => {
        output += `
            <div class="section-content">
                <div><span class="info-text">${exp.role}</span> at ${exp.company}</div>
                <div>${exp.duration}</div>
                <div class="project-detail">${exp.description}</div>
            </div>
        `;
    });
    
    output += '<div class="section-title" style="margin-top: 20px;">Education</div>';
    
    education.forEach(edu => {
        output += `
            <div class="section-content">
                <div><span class="info-text">${edu.degree}</span> in ${edu.field}</div>
                <div>${edu.institution}</div>
                <div>${edu.year}</div>
                ${edu.cgpa ? `<div>${edu.cgpa}</div>` : ''}
            </div>
        `;
    });
    
    addOutputLine(output);
}

function clearTerminal() {
    terminalOutput.innerHTML = '';
    addOutputLine("Terminal cleared.", "system-text");
}

function showCertificates() {
    const certificates = portfolioData.certificates;
    let output = '<div class="section-title">Certificates</div>';
    output += '<div class="section-content">';
    certificates.forEach(cert => {
        output += `<div>• ${cert}</div>`;
    });
    output += '</div>';
    addOutputLine(output);
}

function showResume() {
    const resume = portfolioData.resume;
    let output = `
        <div class="section-title">Resume</div>
        <div class="section-content">
            <div style="margin-bottom: 12px;">
                <span class="info-text">View Resume:</span> 
                <a href="${resume.view}" target="_blank" class="link">Open in Google Drive</a>
            </div>
            <div>
                <span class="info-text">Download Resume:</span> 
                <a href="${resume.download}" target="_blank" class="link" download>Download PDF</a>
            </div>
        </div>
    `;
    addOutputLine(output);
}

function showStatus() {
    let output = `
        <div class="section-title">Current Status</div>
        <div class="section-content">
            <div>🟢 Actively learning</div>
            <div>📱 Building Android apps</div>
            <div>🚀 Open to internships & projects</div>
        </div>
    `;
    addOutputLine(output);
}

function showHireSarim() {
    const contact = portfolioData.contact;
    let output = `
        <div class="section-title" style="color: var(--accent-green);">Permission granted.</div>
        <div class="section-content" style="color: var(--accent-green); font-size: 16px; margin-top: 12px;">
            Welcome to the team 🚀
        </div>
        <div class="section-title" style="margin-top: 20px; color: var(--text-primary);">Contact Information</div>
        <div class="section-content">
            <div><span class="info-text">Email:</span> <a href="mailto:${contact.email}" class="link">${contact.email}</a></div>
            <div><span class="info-text">Phone:</span> ${contact.phone}</div>
            <div><span class="info-text">Location:</span> ${contact.location}</div>
        </div>
        <div class="section-title" style="margin-top: 20px; color: var(--text-primary);">Coding Profiles</div>
        <div class="section-content">
            <div><span class="info-text">LeetCode:</span> <a href="${contact.leetcode}" target="_blank" class="link">${contact.leetcodeStats}</a></div>
            <div><span class="info-text">GitHub:</span> <a href="${contact.github}" target="_blank" class="link">github.com/Sarim2022</a></div>
            <div><span class="info-text">LinkedIn:</span> <a href="${contact.linkedin}" target="_blank" class="link">linkedin.com/in/sarimhasanprofes67</a></div>
            <div><span class="info-text">GeeksforGeeks:</span> <a href="${contact.geeksforgeeks}" target="_blank" class="link">geeksforgeeks.org/profile/sarimhasowyc</a></div>
        </div>
    `;
    addOutputLine(output);
}


// Event listeners
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value;
        if (command.trim()) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            processCommand(command);
        }
        terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
        }
    }
});

// Auto-focus input when clicking terminal
terminalOutput.addEventListener('click', () => {
    terminalInput.focus();
});

// Keep input focused
terminalInput.addEventListener('blur', () => {
    setTimeout(() => terminalInput.focus(), 100);
});

// Initialize
initTerminal();
