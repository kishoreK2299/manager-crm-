// Global State Management
let currentPage = 'dashboard';
let currentLeadType = 'show';
let selectedRows = new Set();
let deleteCallback = null;

// Data Storage Keys
const STORAGE_KEYS = {
    showLeads: 'crm_show_leads',
    industryLeads: 'crm_industry_leads',
    contacts: 'crm_contacts',
    accounts: 'crm_accounts',
    deals: 'crm_deals',
    tasks: 'crm_tasks'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    renderDashboard();
    navigateTo('dashboard');
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });

    // User Dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    userMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', function() {
        userDropdown.classList.remove('active');
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabGroup = this.closest('.page');
            const targetTab = this.dataset.tab;
            
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Handle leads tab switching
            if (targetTab === 'showLeads') {
                currentLeadType = 'show';
                renderShowLeads();
            } else if (targetTab === 'industryLeads') {
                currentLeadType = 'industry';
                renderIndustryLeads();
            }
        });
    });

    // Search
    const globalSearch = document.getElementById('globalSearch');
    globalSearch.addEventListener('input', handleGlobalSearch);

    // Table searches
    setupTableSearch('showLeadsSearch', renderShowLeads);
    setupTableSearch('industryLeadsSearch', renderIndustryLeads);
    setupTableSearch('contactsSearch', renderContacts);
    setupTableSearch('accountsSearch', renderAccounts);
    setupTableSearch('tasksSearch', renderTasks);

    // Filters
    setupFilter('statusFilter', renderShowLeads);
    setupFilter('sourceFilter', renderShowLeads);
    setupFilter('industryStatusFilter', renderIndustryLeads);
    setupFilter('industrySourceFilter', renderIndustryLeads);
    setupFilter('taskStatusFilter', renderTasks);
    setupFilter('taskPriorityFilter', renderTasks);

    // Select All Checkboxes
    document.getElementById('selectAllShowLeads')?.addEventListener('change', function() {
        selectAll('showLeads', this.checked);
    });

    document.getElementById('selectAllIndustryLeads')?.addEventListener('change', function() {
        selectAll('industryLeads', this.checked);
    });
}

function setupTableSearch(inputId, renderFunction) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', renderFunction);
    }
}

function setupFilter(selectId, renderFunction) {
    const select = document.getElementById(selectId);
    if (select) {
        select.addEventListener('change', renderFunction);
    }
}

// Navigation
function navigateTo(page) {
    currentPage = page;
    
    // Update sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Render page content
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'leads':
            renderShowLeads();
            renderIndustryLeads();
            break;
        case 'contacts':
            renderContacts();
            break;
        case 'accounts':
            renderAccounts();
            break;
        case 'deals':
            renderDeals();
            break;
        case 'tasks':
            renderTasks();
            break;
        case 'reports':
            renderReports();
            break;
        case 'automation':
            renderAutomation();
            break;
        case 'team':
            renderTeam();
            break;
    }
}

// Data Initialization
function initializeData() {
    if (!getData(STORAGE_KEYS.showLeads)) {
        setData(STORAGE_KEYS.showLeads, generateShowLeads());
    }
    if (!getData(STORAGE_KEYS.industryLeads)) {
        setData(STORAGE_KEYS.industryLeads, generateIndustryLeads());
    }
    if (!getData(STORAGE_KEYS.contacts)) {
        setData(STORAGE_KEYS.contacts, generateContacts());
    }
    if (!getData(STORAGE_KEYS.accounts)) {
        setData(STORAGE_KEYS.accounts, generateAccounts());
    }
    if (!getData(STORAGE_KEYS.deals)) {
        setData(STORAGE_KEYS.deals, generateDeals());
    }
    if (!getData(STORAGE_KEYS.tasks)) {
        setData(STORAGE_KEYS.tasks, generateTasks());
    }
}

// Data Generation Functions
function generateShowLeads() {
    const names = ['Amit Sharma', 'Priya Patel', 'Rahul Singh', 'Neha Gupta', 'Vikram Kumar', 'Anita Desai', 'Sanjay Mehta', 'Kavita Reddy', 'Arun Iyer', 'Deepika Joshi', 'Rajesh Verma', 'Sunita Nair', 'Manoj Agarwal', 'Pooja Kapoor', 'Suresh Rao'];
    const jobTitles = ['Event Manager', 'Marketing Director', 'HR Head', 'Operations Manager', 'Business Development Manager', 'Sales Director', 'Brand Manager', 'Corporate Communications Head'];
    const showNames = ['Tech Summit Mumbai 2025', 'Auto Expo Delhi', 'Pharma Conference Bangalore', 'Retail Convention Pune', 'Education Fair Chennai', 'Healthcare Expo Hyderabad', 'Manufacturing Summit Ahmedabad', 'Fintech Conference Kolkata', 'Real Estate Expo Gurgaon', 'Food & Beverage Show Mumbai', 'Fashion Week Delhi', 'Startup Summit Bangalore', 'E-commerce Expo Pune', 'Digital Marketing Conference Chennai', 'Logistics Summit Hyderabad'];
    const companies = ['Infosys', 'Wipro', 'TCS', 'Tech Mahindra', 'Reliance Industries', 'Tata Motors', 'Mahindra & Mahindra', 'Aditya Birla Group', 'HDFC Bank', 'ICICI Bank', 'Bharti Airtel', 'Asian Paints', 'Larsen & Toubro', 'Godrej Group', 'HUL'];
    const sources = ['Email', 'LinkedIn'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
    
    return names.map((name, i) => ({
        id: 'SL' + (1000 + i),
        clientEmail: name.toLowerCase().replace(' ', '.') + '@' + companies[i].toLowerCase().replace(/\s+/g, '') + '.com',
        contactName: name,
        jobTitle: jobTitles[i % jobTitles.length],
        showName: showNames[i],
        showWebsite: 'https://' + showNames[i].toLowerCase().replace(/\s+/g, '') + '.com',
        showDate: new Date(2025, Math.floor(i/3), (i % 28) + 1).toISOString().split('T')[0],
        attendeeCount: 100 + (i * 300),
        companyName: companies[i],
        companyWebsite: 'https://www.' + companies[i].toLowerCase().replace(/\s+/g, '') + '.com',
        companyCountry: 'India',
        phone: '+91 ' + (9000000000 + i * 11111),
        leadSource: sources[i % 2],
        emailMessage: 'Hello, we are organizing ' + showNames[i] + ' and would like to discuss exhibition opportunities.',
        keyPoints: 'Interested in premium booth space, requires AV equipment',
        status: statuses[i % 4],
        createdAt: new Date(2025, 0, i + 1).toISOString()
    }));
}

function generateIndustryLeads() {
    const names = ['Sunil Khanna', 'Ritu Saxena', 'Arjun Malhotra', 'Shreya Bose', 'Karan Chopra', 'Meena Raghavan', 'Vishal Pandey', 'Anjali Sinha', 'Rohit Bansal', 'Divya Menon', 'Prakash Jain', 'Nisha Sharma', 'Ashok Kumar', 'Rekha Pillai', 'Vijay Reddy'];
    const jobTitles = ['CEO', 'VP Sales', 'Director Operations', 'CFO', 'Head of Marketing', 'COO', 'General Manager', 'Business Head'];
    const companies = ['Flipkart', 'Paytm', 'Zomato', 'Ola Cabs', 'Swiggy', 'BigBasket', 'PolicyBazaar', 'Byju\'s', 'OYO Rooms', 'Freshworks', 'Zoho Corp', 'InMobi', 'Myntra', 'Urban Company', 'CRED'];
    const countries = ['India', 'USA', 'UK', 'UAE', 'Singapore'];
    const sources = ['Email', 'LinkedIn'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
    
    return names.map((name, i) => ({
        id: 'IL' + (2000 + i),
        clientEmail: name.toLowerCase().replace(' ', '.') + '@' + companies[i].toLowerCase().replace(/\s+/g, '') + '.com',
        contactName: name,
        jobTitle: jobTitles[i % jobTitles.length],
        companyName: companies[i],
        companyWebsite: 'https://www.' + companies[i].toLowerCase().replace(/\s+/g, '') + '.com',
        companyCountry: countries[i % countries.length],
        phone: '+91 ' + (8000000000 + i * 11111),
        leadSource: sources[i % 2],
        emailMessage: 'Exploring opportunities for corporate event management and exhibition services.',
        status: statuses[i % 4],
        createdAt: new Date(2025, 0, i + 1).toISOString()
    }));
}

function generateContacts() {
    const names = ['Amit Kumar', 'Priya Singh', 'Rajesh Patel', 'Sneha Sharma', 'Vikram Reddy', 'Anita Iyer', 'Sanjay Mehta', 'Kavita Desai', 'Arun Verma', 'Deepika Nair', 'Manoj Gupta', 'Pooja Joshi', 'Suresh Rao', 'Sunita Kapoor', 'Rahul Agarwal', 'Neha Chopra', 'Kiran Kumar', 'Ritu Malhotra', 'Vishal Saxena', 'Anjali Pandey'];
    const companies = ['Infosys', 'Wipro', 'TCS', 'Tech Mahindra', 'Reliance', 'Tata Motors', 'HDFC Bank', 'ICICI Bank', 'Flipkart', 'Paytm', 'Zomato', 'Ola', 'Swiggy', 'Byju\'s', 'OYO', 'Freshworks', 'Zoho', 'InMobi', 'Myntra', 'CRED'];
    const owners = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'];
    
    return names.map((name, i) => ({
        id: 'C' + (5000 + i),
        name: name,
        email: name.toLowerCase().replace(' ', '.') + '@example.com',
        phone: '+91 ' + (9100000000 + i * 11111),
        company: companies[i],
        owner: owners[i % owners.length],
        lastActivity: getRandomDate(-30, 0),
        tags: ['VIP', 'Decision Maker'][i % 2] || 'Contact'
    }));
}

function generateAccounts() {
    const accounts = ['Infosys Limited', 'Wipro Technologies', 'Tata Consultancy Services', 'Tech Mahindra', 'Reliance Industries', 'Tata Motors', 'Mahindra & Mahindra', 'HDFC Bank', 'ICICI Bank', 'Bharti Airtel', 'Asian Paints', 'Larsen & Toubro', 'Godrej Group', 'Hindustan Unilever', 'Flipkart'];
    const industries = ['IT Services', 'Manufacturing', 'Financial Services', 'Telecom', 'Retail', 'Healthcare', 'Real Estate'];
    const locations = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
    const owners = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'];
    const statuses = ['Active', 'Inactive'];
    
    return accounts.map((account, i) => ({
        id: 'A' + (7000 + i),
        name: account,
        industry: industries[i % industries.length],
        location: locations[i % locations.length],
        owner: owners[i % owners.length],
        revenue: (5000000 + i * 500000),
        employees: 100 + (i * 500),
        status: statuses[i % 2]
    }));
}

function generateDeals() {
    const dealNames = ['Office Furniture', 'Event Management', 'IT Infrastructure', 'Marketing Campaign', 'HR Software', 'CRM Implementation', 'Cloud Migration', 'Digital Transformation', 'Security Systems', 'Office Renovation'];
    const accounts = ['Infosys', 'Wipro', 'TCS', 'Tech Mahindra', 'Reliance', 'Tata Motors', 'HDFC Bank', 'ICICI Bank', 'Flipkart', 'Paytm'];
    const stages = ['Prospecting', 'Qualification', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const owners = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Meera Iyer'];
    
    const deals = [];
    const stageCounts = [15, 12, 8, 5, 3];
    
    stages.forEach((stage, stageIdx) => {
        for (let i = 0; i < stageCounts[stageIdx]; i++) {
            deals.push({
                id: 'D' + (3000 + deals.length),
                name: dealNames[deals.length % dealNames.length] + ' - ' + accounts[deals.length % accounts.length],
                account: accounts[deals.length % accounts.length],
                amount: 50000 + (deals.length * 50000),
                closeDate: getRandomDate(0, 90),
                stage: stage,
                owner: owners[deals.length % owners.length],
                leadSource: ['Email', 'LinkedIn', 'Website', 'Referral'][deals.length % 4]
            });
        }
    });
    
    return deals;
}

function generateTasks() {
    const tasks = [
        'Follow up with Infosys - Office Setup Deal',
        'Send proposal to TCS - Event Management',
        'Schedule demo with Reliance Industries',
        'Call back Wipro - IT Infrastructure inquiry',
        'Prepare presentation for HDFC Bank',
        'Review contract with Flipkart',
        'Send quote to Paytm',
        'Meeting with Tech Mahindra - Digital Transformation',
        'Follow up on proposal - Tata Motors',
        'Update CRM for ICICI Bank deal',
        'Prepare demo for Bharti Airtel',
        'Send revised quotation to Asian Paints',
        'Schedule call with L&T',
        'Follow up with Godrej Group',
        'Prepare contract for HUL'
    ];
    const relatedTo = ['Lead', 'Contact', 'Deal', 'Account'];
    const priorities = ['High', 'Medium', 'Low'];
    const statuses = ['Open', 'In Progress', 'Completed', 'Overdue'];
    const assignees = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy'];
    
    return tasks.map((task, i) => ({
        id: 'T' + (4000 + i),
        subject: task,
        relatedTo: relatedTo[i % relatedTo.length],
        dueDate: getRandomDate(-5, 30),
        priority: priorities[i % priorities.length],
        status: statuses[i % statuses.length],
        assignedTo: assignees[i % assignees.length]
    }));
}

function getRandomDate(startDaysAgo, endDaysFromNow) {
    const start = new Date();
    start.setDate(start.getDate() + startDaysAgo);
    const end = new Date();
    end.setDate(end.getDate() + endDaysFromNow);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

// Data Storage Functions (using in-memory objects instead of localStorage)
const dataStore = {};

function getData(key) {
    return dataStore[key] || null;
}

function setData(key, data) {
    dataStore[key] = data;
}

// Dashboard Rendering
function renderDashboard() {
    renderFunnelChart();
    renderTeamLeaderboard();
    renderActivityHeatmap();
}

function renderFunnelChart() {
    const container = document.getElementById('funnelChart');
    if (!container) return;
    
    const stages = [
        { name: 'Prospecting', count: 120, color: '#90CAF9' },
        { name: 'Qualification', count: 85, color: '#64B5F6' },
        { name: 'Negotiation', count: 45, color: '#42A5F5' },
        { name: 'Closed Won', count: 28, color: '#4CAF50' }
    ];
    
    container.innerHTML = stages.map((stage, i) => {
        const width = 100 - (i * 15);
        return `
            <div class="funnel-stage">
                <div class="funnel-label">${stage.name}</div>
                <div class="funnel-bar" style="width: ${width}%; background: ${stage.color};">
                    <span>${stage.count} deals</span>
                    <span>${Math.round((stage.count / 120) * 100)}%</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderTeamLeaderboard() {
    const container = document.getElementById('teamLeaderboard');
    if (!container) return;
    
    const team = [
        { name: 'Priya Sharma', deals: 32, achievement: 95 },
        { name: 'Amit Patel', deals: 28, achievement: 87 },
        { name: 'Sneha Reddy', deals: 25, achievement: 78 },
        { name: 'Vikram Singh', deals: 22, achievement: 69 },
        { name: 'Meera Iyer', deals: 20, achievement: 62 }
    ];
    
    container.innerHTML = team.map((member, i) => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">${i + 1}</div>
            <div class="avatar-small">${member.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${member.name}</div>
                <div class="leaderboard-deals">${member.deals} deals closed</div>
            </div>
            <div class="leaderboard-progress">
                <div class="leaderboard-bar">
                    <div class="leaderboard-bar-fill" style="width: ${member.achievement}%;"></div>
                </div>
            </div>
            <div class="leaderboard-percentage">${member.achievement}%</div>
        </div>
    `).join('');
}

function renderActivityHeatmap() {
    const container = document.getElementById('activityHeatmap');
    if (!container) return;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
    
    let html = '<div class="heatmap-container">';
    html += '<div class="heatmap-label"></div>';
    hours.forEach(hour => {
        html += `<div class="heatmap-label" style="justify-content: center; font-size: 10px;">${hour}</div>`;
    });
    
    days.forEach(day => {
        html += `<div class="heatmap-label">${day}</div>`;
        hours.forEach(() => {
            const intensity = Math.floor(Math.random() * 5) + 1;
            html += `<div class="heatmap-cell intensity-${intensity}" title="${day}"></div>`;
        });
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Leads Rendering
function renderShowLeads() {
    const tbody = document.getElementById('showLeadsTable');
    if (!tbody) return;
    
    let leads = getData(STORAGE_KEYS.showLeads) || [];
    
    // Apply filters
    const searchTerm = document.getElementById('showLeadsSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const sourceFilter = document.getElementById('sourceFilter')?.value || '';
    
    leads = leads.filter(lead => {
        const matchesSearch = !searchTerm || 
            lead.contactName.toLowerCase().includes(searchTerm) ||
            lead.companyName.toLowerCase().includes(searchTerm) ||
            lead.showName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || lead.status === statusFilter;
        const matchesSource = !sourceFilter || lead.leadSource === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });
    
    tbody.innerHTML = leads.map(lead => `
        <tr>
            <td><input type="checkbox" class="row-select" data-id="${lead.id}"></td>
            <td><strong>${lead.contactName}</strong></td>
            <td>${lead.jobTitle}</td>
            <td>${lead.showName}</td>
            <td>${lead.companyName}</td>
            <td>${formatDate(lead.showDate)}</td>
            <td>${lead.attendeeCount}</td>
            <td><span class="source-badge source-${lead.leadSource.toLowerCase()}">${lead.leadSource}</span></td>
            <td><span class="status-badge status-${lead.status.toLowerCase()}">${lead.status}</span></td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" onclick="viewLead('${lead.id}', 'show')" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-icon" onclick="editLead('${lead.id}', 'show')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-icon delete" onclick="confirmDelete('${lead.id}', 'show')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to checkboxes
    tbody.querySelectorAll('.row-select').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedRows.add(this.dataset.id);
            } else {
                selectedRows.delete(this.dataset.id);
            }
            updateBulkActionBar();
        });
    });
}

function renderIndustryLeads() {
    const tbody = document.getElementById('industryLeadsTable');
    if (!tbody) return;
    
    let leads = getData(STORAGE_KEYS.industryLeads) || [];
    
    // Apply filters
    const searchTerm = document.getElementById('industryLeadsSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('industryStatusFilter')?.value || '';
    const sourceFilter = document.getElementById('industrySourceFilter')?.value || '';
    
    leads = leads.filter(lead => {
        const matchesSearch = !searchTerm || 
            lead.contactName.toLowerCase().includes(searchTerm) ||
            lead.companyName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || lead.status === statusFilter;
        const matchesSource = !sourceFilter || lead.leadSource === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });
    
    tbody.innerHTML = leads.map(lead => `
        <tr>
            <td><input type="checkbox" class="row-select" data-id="${lead.id}"></td>
            <td><strong>${lead.contactName}</strong></td>
            <td>${lead.jobTitle}</td>
            <td>${lead.companyName}</td>
            <td>${lead.companyCountry}</td>
            <td><span class="source-badge source-${lead.leadSource.toLowerCase()}">${lead.leadSource}</span></td>
            <td><span class="status-badge status-${lead.status.toLowerCase()}">${lead.status}</span></td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" onclick="viewLead('${lead.id}', 'industry')" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-icon" onclick="editLead('${lead.id}', 'industry')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-icon delete" onclick="confirmDelete('${lead.id}', 'industry')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Contacts Rendering
function renderContacts() {
    const tbody = document.getElementById('contactsTable');
    if (!tbody) return;
    
    let contacts = getData(STORAGE_KEYS.contacts) || [];
    const searchTerm = document.getElementById('contactsSearch')?.value.toLowerCase() || '';
    
    if (searchTerm) {
        contacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.company.toLowerCase().includes(searchTerm) ||
            contact.email.toLowerCase().includes(searchTerm)
        );
    }
    
    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td><strong>${contact.name}</strong></td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.company}</td>
            <td>${contact.owner}</td>
            <td>${formatDate(contact.lastActivity)}</td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-icon" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-icon delete" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Accounts Rendering
function renderAccounts() {
    const tbody = document.getElementById('accountsTable');
    if (!tbody) return;
    
    let accounts = getData(STORAGE_KEYS.accounts) || [];
    const searchTerm = document.getElementById('accountsSearch')?.value.toLowerCase() || '';
    
    if (searchTerm) {
        accounts = accounts.filter(account => 
            account.name.toLowerCase().includes(searchTerm) ||
            account.industry.toLowerCase().includes(searchTerm)
        );
    }
    
    tbody.innerHTML = accounts.map(account => `
        <tr>
            <td><strong>${account.name}</strong></td>
            <td>${account.industry}</td>
            <td>${account.location}</td>
            <td>${account.owner}</td>
            <td>₹${formatNumber(account.revenue)}</td>
            <td>${formatNumber(account.employees)}</td>
            <td><span class="status-badge status-${account.status.toLowerCase()}">${account.status}</span></td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-icon" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-icon delete" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Deals Rendering (Kanban)
function renderDeals() {
    const container = document.getElementById('kanbanView');
    if (!container) return;
    
    const deals = getData(STORAGE_KEYS.deals) || [];
    const stages = ['Prospecting', 'Qualification', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const stageColors = {
        'Prospecting': '#90CAF9',
        'Qualification': '#64B5F6',
        'Negotiation': '#42A5F5',
        'Closed Won': '#4CAF50',
        'Closed Lost': '#F44336'
    };
    
    container.innerHTML = stages.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage);
        const totalValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);
        
        return `
            <div class="kanban-column" data-stage="${stage}">
                <div class="kanban-header" style="border-color: ${stageColors[stage]};">
                    <div>
                        <div class="kanban-title" style="color: ${stageColors[stage]};">${stage}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">₹${formatNumber(totalValue)}</div>
                    </div>
                    <div class="kanban-count">${stageDeals.length}</div>
                </div>
                <div class="kanban-cards" ondrop="drop(event)" ondragover="allowDrop(event)" data-stage="${stage}">
                    ${stageDeals.map(deal => `
                        <div class="deal-card" draggable="true" ondragstart="drag(event)" data-id="${deal.id}">
                            <div class="deal-name">${deal.name}</div>
                            <div class="deal-account">${deal.account}</div>
                            <div class="deal-value">₹${formatNumber(deal.amount)}</div>
                            <div class="deal-footer">
                                <div class="deal-owner">
                                    <div class="avatar" style="width: 24px; height: 24px; font-size: 10px;">${deal.owner.split(' ').map(n => n[0]).join('')}</div>
                                    <span>${deal.owner.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <button class="action-icon" onclick="viewDeal('${deal.id}')" title="View">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Drag and Drop for Kanban
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("dealId", ev.target.dataset.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    const dealId = ev.dataTransfer.getData("dealId");
    const newStage = ev.target.closest('.kanban-cards').dataset.stage;
    
    // Update deal stage
    const deals = getData(STORAGE_KEYS.deals);
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
        deal.stage = newStage;
        setData(STORAGE_KEYS.deals, deals);
        renderDeals();
        showToast(`Deal moved to ${newStage}`, 'success');
    }
    
    document.querySelectorAll('.deal-card').forEach(card => card.classList.remove('dragging'));
}

// Tasks Rendering
function renderTasks() {
    const tbody = document.getElementById('tasksTable');
    if (!tbody) return;
    
    let tasks = getData(STORAGE_KEYS.tasks) || [];
    const searchTerm = document.getElementById('tasksSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('taskStatusFilter')?.value || '';
    const priorityFilter = document.getElementById('taskPriorityFilter')?.value || '';
    
    tasks = tasks.filter(task => {
        const matchesSearch = !searchTerm || task.subject.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || task.status === statusFilter;
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td><input type="checkbox"></td>
            <td><strong>${task.subject}</strong></td>
            <td>${task.relatedTo}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td><span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
            <td><span class="status-badge status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
            <td>${task.assignedTo}</td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-icon" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-icon delete" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Reports Rendering
function renderReports() {
    const container = document.getElementById('reportsGrid');
    if (!container) return;
    
    const reports = [
        { title: 'Monthly Revenue Trend', type: 'Line Chart', lastUpdated: '2 hours ago' },
        { title: 'Deals by Stage', type: 'Funnel Chart', lastUpdated: '1 day ago' },
        { title: 'Team Performance', type: 'Bar Chart', lastUpdated: '3 hours ago' },
        { title: 'Lead Source Analysis', type: 'Pie Chart', lastUpdated: '1 day ago' },
        { title: 'Conversion Rate by Region', type: 'Bar Chart', lastUpdated: '2 days ago' },
        { title: 'Sales Pipeline Overview', type: 'Funnel Chart', lastUpdated: '5 hours ago' },
        { title: 'Activity Report', type: 'Heatmap', lastUpdated: '1 day ago' },
        { title: 'Revenue Forecast', type: 'Line Chart', lastUpdated: '3 days ago' }
    ];
    
    container.innerHTML = reports.map(report => `
        <div class="report-card">
            <div class="report-preview">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
            </div>
            <div class="report-title">${report.title}</div>
            <div class="report-meta">${report.type} • Updated ${report.lastUpdated}</div>
        </div>
    `).join('');
}

// Automation Rendering
function renderAutomation() {
    const container = document.getElementById('workflowsGrid');
    if (!container) return;
    
    const workflows = [
        { name: 'Auto-assign APAC Leads', status: 'active', trigger: 'When lead is created', action: 'Assign to Priya Sharma' },
        { name: 'Send welcome email to new leads', status: 'active', trigger: 'When lead is created', action: 'Send email template' },
        { name: 'Escalate overdue tasks', status: 'active', trigger: 'When task is overdue by 2 days', action: 'Notify manager' },
        { name: 'Update deal stage on activity', status: 'inactive', trigger: 'When activity is logged', action: 'Move to next stage' },
        { name: 'Notify manager on high-value deals', status: 'active', trigger: 'When deal value > ₹10L', action: 'Send notification' }
    ];
    
    container.innerHTML = workflows.map(workflow => `
        <div class="workflow-card">
            <div class="workflow-header">
                <div class="workflow-title">${workflow.name}</div>
                <span class="workflow-status ${workflow.status}">${workflow.status}</span>
            </div>
            <div class="workflow-desc">
                <strong>Trigger:</strong> ${workflow.trigger}<br>
                <strong>Action:</strong> ${workflow.action}
            </div>
            <div class="workflow-actions">
                <button class="btn btn-sm btn-secondary">Edit</button>
                <button class="btn btn-sm btn-secondary">Test</button>
            </div>
        </div>
    `).join('');
    
    // Render approvals
    const approvalsTable = document.getElementById('approvalsTable');
    if (approvalsTable) {
        const approvals = [
            { type: 'Discount Approval', requestedBy: 'Priya Sharma', value: '₹2,50,000', date: '2025-10-25', status: 'Pending' },
            { type: 'Contract Change', requestedBy: 'Amit Patel', value: '₹1,80,000', date: '2025-10-24', status: 'Pending' },
            { type: 'Discount Approval', requestedBy: 'Sneha Reddy', value: '₹3,20,000', date: '2025-10-23', status: 'Approved' },
            { type: 'Budget Override', requestedBy: 'Vikram Singh', value: '₹4,50,000', date: '2025-10-22', status: 'Rejected' }
        ];
        
        approvalsTable.innerHTML = approvals.map(approval => `
            <tr>
                <td>${approval.type}</td>
                <td>${approval.requestedBy}</td>
                <td><strong>${approval.value}</strong></td>
                <td>${formatDate(approval.date)}</td>
                <td><span class="status-badge status-${approval.status.toLowerCase()}">${approval.status}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="btn btn-sm btn-primary">Review</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Team Rendering
function renderTeam() {
    const tbody = document.getElementById('teamMembersTable');
    if (!tbody) return;
    
    const team = [
        { name: 'Priya Sharma', role: 'Sales Executive', territory: 'North India', quota: 3000000, achieved: 2850000, achievement: 95, lastLogin: '2025-10-27', status: 'Active' },
        { name: 'Amit Patel', role: 'Sales Executive', territory: 'West India', quota: 3000000, achieved: 2610000, achievement: 87, lastLogin: '2025-10-27', status: 'Active' },
        { name: 'Sneha Reddy', role: 'Sales Executive', territory: 'South India', quota: 3000000, achieved: 2340000, achievement: 78, lastLogin: '2025-10-26', status: 'Active' },
        { name: 'Vikram Singh', role: 'Sales Executive', territory: 'North India', quota: 3000000, achieved: 2070000, achievement: 69, lastLogin: '2025-10-26', status: 'Active' },
        { name: 'Meera Iyer', role: 'Sales Executive', territory: 'South India', quota: 3000000, achieved: 1860000, achievement: 62, lastLogin: '2025-10-25', status: 'Active' },
        { name: 'Karan Malhotra', role: 'Sales Analyst', territory: 'All India', quota: 0, achieved: 0, achievement: 0, lastLogin: '2025-10-27', status: 'Active' }
    ];
    
    tbody.innerHTML = team.map(member => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="avatar-small">${member.name.split(' ').map(n => n[0]).join('')}</div>
                    <strong>${member.name}</strong>
                </div>
            </td>
            <td>${member.role}</td>
            <td>${member.territory}</td>
            <td>${member.quota > 0 ? '₹' + formatNumber(member.quota) : '-'}</td>
            <td>${member.achieved > 0 ? '₹' + formatNumber(member.achieved) : '-'}</td>
            <td>
                ${member.achievement > 0 ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="flex: 1; height: 8px; background: rgba(30, 136, 229, 0.1); border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; width: ${member.achievement}%; background: var(--primary-color);"></div>
                        </div>
                        <span style="font-weight: 600; color: var(--primary-color);">${member.achievement}%</span>
                    </div>
                ` : '-'}
            </td>
            <td>${formatDate(member.lastLogin)}</td>
            <td><span class="status-badge status-${member.status.toLowerCase()}">${member.status}</span></td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Render permissions matrix
    renderPermissionsMatrix();
    
    // Render territories
    renderTerritories();
}

function renderPermissionsMatrix() {
    const container = document.getElementById('permissionsMatrix');
    if (!container) return;
    
    const entities = ['Leads', 'Contacts', 'Accounts', 'Deals', 'Tasks', 'Reports', 'Workflows', 'Team', 'Settings'];
    const roles = ['Manager', 'Sales Executive', 'Sales Analyst', 'Admin'];
    const permissions = ['View', 'Create', 'Edit', 'Delete'];
    
    let html = '<table class="permissions-table">';
    html += '<thead><tr><th>Entity</th>';
    roles.forEach(role => {
        html += `<th colspan="4">${role}</th>`;
    });
    html += '</tr><tr><th></th>';
    roles.forEach(() => {
        permissions.forEach(perm => {
            html += `<th>${perm}</th>`;
        });
    });
    html += '</tr></thead><tbody>';
    
    entities.forEach(entity => {
        html += `<tr><td><strong>${entity}</strong></td>`;
        roles.forEach(role => {
            permissions.forEach(perm => {
                const checked = (role === 'Manager' || role === 'Admin') || (role === 'Sales Executive' && perm !== 'Delete') || (role === 'Sales Analyst' && perm === 'View');
                html += `<td><input type="checkbox" class="permission-checkbox" ${checked ? 'checked' : ''}></td>`;
            });
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    html += '<div class="form-actions" style="margin-top: 24px;"><button class="btn btn-primary" onclick="showToast(\'Permissions saved\', \'success\')">Save Permissions</button></div>';
    container.innerHTML = html;
}

function renderTerritories() {
    const container = document.getElementById('territoriesGrid');
    if (!container) return;
    
    const territories = [
        { name: 'North India', regions: 'Delhi, Punjab, Haryana, Uttar Pradesh', reps: 3, leads: 45 },
        { name: 'South India', regions: 'Bangalore, Chennai, Hyderabad, Kerala', reps: 3, leads: 38 },
        { name: 'West India', regions: 'Mumbai, Pune, Ahmedabad, Goa', reps: 2, leads: 29 },
        { name: 'East India', regions: 'Kolkata, Bhubaneswar, Patna', reps: 1, leads: 15 }
    ];
    
    container.innerHTML = territories.map(territory => `
        <div class="territory-card">
            <div class="territory-name">${territory.name}</div>
            <div class="territory-regions">${territory.regions}</div>
            <div class="territory-stats">
                <div class="territory-stat">
                    <div class="stat-value">${territory.reps}</div>
                    <div class="stat-label">Reps</div>
                </div>
                <div class="territory-stat">
                    <div class="stat-value">${territory.leads}</div>
                    <div class="stat-label">Active Leads</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openLeadModal() {
    const modal = document.getElementById('leadModal');
    document.getElementById('leadModalTitle').textContent = 'Add Lead';
    document.getElementById('leadForm').reset();
    document.getElementById('leadId').value = '';
    document.getElementById('leadType').value = currentLeadType;
    
    // Show/hide fields based on lead type
    if (currentLeadType === 'show') {
        document.getElementById('showNameGroup').style.display = '';
        document.getElementById('showDetailsGroup').style.display = '';
        document.getElementById('attendeeGroup').style.display = '';
        document.getElementById('keyPointsGroup').style.display = '';
    } else {
        document.getElementById('showNameGroup').style.display = 'none';
        document.getElementById('showDetailsGroup').style.display = 'none';
        document.getElementById('attendeeGroup').querySelector('.form-group:first-child').style.display = 'none';
        document.getElementById('keyPointsGroup').style.display = 'none';
    }
    
    modal.classList.add('active');
}

function viewLead(id, type) {
    editLead(id, type, true);
}

function editLead(id, type, viewOnly = false) {
    const leads = type === 'show' ? getData(STORAGE_KEYS.showLeads) : getData(STORAGE_KEYS.industryLeads);
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    
    const modal = document.getElementById('leadModal');
    document.getElementById('leadModalTitle').textContent = viewOnly ? 'View Lead' : 'Edit Lead';
    document.getElementById('leadId').value = lead.id;
    document.getElementById('leadType').value = type;
    
    // Fill form
    document.getElementById('clientEmail').value = lead.clientEmail || '';
    document.getElementById('contactName').value = lead.contactName || '';
    document.getElementById('jobTitle').value = lead.jobTitle || '';
    document.getElementById('companyName').value = lead.companyName || '';
    document.getElementById('companyWebsite').value = lead.companyWebsite || '';
    document.getElementById('companyCountry').value = lead.companyCountry || '';
    document.getElementById('phone').value = lead.phone || '';
    document.getElementById('leadSource').value = lead.leadSource || '';
    document.getElementById('emailMessage').value = lead.emailMessage || '';
    document.getElementById('status').value = lead.status || '';
    
    if (type === 'show') {
        document.getElementById('showName').value = lead.showName || '';
        document.getElementById('showWebsite').value = lead.showWebsite || '';
        document.getElementById('showDate').value = lead.showDate || '';
        document.getElementById('attendeeCount').value = lead.attendeeCount || '';
        document.getElementById('keyPoints').value = lead.keyPoints || '';
        
        document.getElementById('showNameGroup').style.display = '';
        document.getElementById('showDetailsGroup').style.display = '';
        document.getElementById('attendeeGroup').style.display = '';
        document.getElementById('keyPointsGroup').style.display = '';
    } else {
        document.getElementById('showNameGroup').style.display = 'none';
        document.getElementById('showDetailsGroup').style.display = 'none';
        document.getElementById('attendeeGroup').querySelector('.form-group:first-child').style.display = 'none';
        document.getElementById('keyPointsGroup').style.display = 'none';
    }
    
    if (viewOnly) {
        document.querySelectorAll('#leadForm input, #leadForm select, #leadForm textarea').forEach(el => {
            el.disabled = true;
        });
    } else {
        document.querySelectorAll('#leadForm input, #leadForm select, #leadForm textarea').forEach(el => {
            el.disabled = false;
        });
    }
    
    modal.classList.add('active');
}

function saveLead() {
    const form = document.getElementById('leadForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const id = document.getElementById('leadId').value;
    const type = document.getElementById('leadType').value;
    const storageKey = type === 'show' ? STORAGE_KEYS.showLeads : STORAGE_KEYS.industryLeads;
    
    const leadData = {
        clientEmail: document.getElementById('clientEmail').value,
        contactName: document.getElementById('contactName').value,
        jobTitle: document.getElementById('jobTitle').value,
        companyName: document.getElementById('companyName').value,
        companyWebsite: document.getElementById('companyWebsite').value,
        companyCountry: document.getElementById('companyCountry').value,
        phone: document.getElementById('phone').value,
        leadSource: document.getElementById('leadSource').value,
        emailMessage: document.getElementById('emailMessage').value,
        status: document.getElementById('status').value
    };
    
    if (type === 'show') {
        leadData.showName = document.getElementById('showName').value;
        leadData.showWebsite = document.getElementById('showWebsite').value;
        leadData.showDate = document.getElementById('showDate').value;
        leadData.attendeeCount = document.getElementById('attendeeCount').value;
        leadData.keyPoints = document.getElementById('keyPoints').value;
    }
    
    let leads = getData(storageKey);
    
    if (id) {
        // Update existing
        const index = leads.findIndex(l => l.id === id);
        if (index !== -1) {
            leads[index] = { ...leads[index], ...leadData };
            showToast('Lead updated successfully', 'success');
        }
    } else {
        // Create new
        const newLead = {
            id: (type === 'show' ? 'SL' : 'IL') + Date.now(),
            ...leadData,
            createdAt: new Date().toISOString()
        };
        leads.push(newLead);
        showToast('Lead created successfully', 'success');
    }
    
    setData(storageKey, leads);
    closeModal('leadModal');
    
    if (type === 'show') {
        renderShowLeads();
    } else {
        renderIndustryLeads();
    }
}

function confirmDelete(id, type) {
    const modal = document.getElementById('deleteModal');
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this lead? This action cannot be undone.';
    
    deleteCallback = () => {
        const storageKey = type === 'show' ? STORAGE_KEYS.showLeads : STORAGE_KEYS.industryLeads;
        let leads = getData(storageKey);
        leads = leads.filter(l => l.id !== id);
        setData(storageKey, leads);
        
        showToast('Lead deleted successfully', 'success');
        closeModal('deleteModal');
        
        if (type === 'show') {
            renderShowLeads();
        } else {
            renderIndustryLeads();
        }
    };
    
    document.getElementById('confirmDeleteBtn').onclick = deleteCallback;
    modal.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'leadModal') {
        document.querySelectorAll('#leadForm input, #leadForm select, #leadForm textarea').forEach(el => {
            el.disabled = false;
        });
    }
}

function openDealModal() {
    const modal = document.getElementById('dealModal');
    document.getElementById('dealForm').reset();
    document.getElementById('dealId').value = '';
    modal.classList.add('active');
}

function saveDeal() {
    const form = document.getElementById('dealForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const id = document.getElementById('dealId').value;
    const dealData = {
        name: document.getElementById('dealName').value,
        account: document.getElementById('dealAccount').value,
        amount: parseInt(document.getElementById('dealAmount').value),
        closeDate: document.getElementById('closeDate').value,
        stage: document.getElementById('dealStage').value,
        owner: document.getElementById('dealOwner').value,
        leadSource: document.getElementById('dealLeadSource').value,
        description: document.getElementById('dealDescription').value
    };
    
    let deals = getData(STORAGE_KEYS.deals);
    
    if (id) {
        const index = deals.findIndex(d => d.id === id);
        if (index !== -1) {
            deals[index] = { ...deals[index], ...dealData };
            showToast('Deal updated successfully', 'success');
        }
    } else {
        const newDeal = {
            id: 'D' + Date.now(),
            ...dealData
        };
        deals.push(newDeal);
        showToast('Deal created successfully', 'success');
    }
    
    setData(STORAGE_KEYS.deals, deals);
    closeModal('dealModal');
    renderDeals();
}

function openTaskModal() {
    const modal = document.getElementById('taskModal');
    document.getElementById('taskForm').reset();
    modal.classList.add('active');
}

function saveTask() {
    const form = document.getElementById('taskForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const taskData = {
        id: 'T' + Date.now(),
        subject: document.getElementById('taskSubject').value,
        relatedTo: document.getElementById('taskRelatedTo').value,
        dueDate: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        assignedTo: document.getElementById('taskAssignedTo').value,
        description: document.getElementById('taskDescription').value
    };
    
    let tasks = getData(STORAGE_KEYS.tasks);
    tasks.push(taskData);
    setData(STORAGE_KEYS.tasks, tasks);
    
    showToast('Task created successfully', 'success');
    closeModal('taskModal');
    renderTasks();
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' active';
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function handleGlobalSearch() {
    // Implement global search functionality
    console.log('Global search triggered');
}

function selectAll(type, checked) {
    // Implement select all functionality
    console.log('Select all:', type, checked);
}

function updateBulkActionBar() {
    const bar = document.getElementById('bulkActionBar');
    const count = document.getElementById('selectedCount');
    if (selectedRows.size > 0) {
        bar.style.display = 'flex';
        count.textContent = selectedRows.size + ' selected';
    } else {
        bar.style.display = 'none';
    }
}

function bulkChangeStatus() {
    showToast('Status changed for ' + selectedRows.size + ' records', 'success');
    selectedRows.clear();
    updateBulkActionBar();
}

function bulkAssign() {
    showToast('Owner assigned for ' + selectedRows.size + ' records', 'success');
    selectedRows.clear();
    updateBulkActionBar();
}

function bulkDelete() {
    if (confirm('Are you sure you want to delete ' + selectedRows.size + ' records?')) {
        showToast('Deleted ' + selectedRows.size + ' records', 'success');
        selectedRows.clear();
        updateBulkActionBar();
    }
}

function exportTableData() {
    showToast('Exporting data...', 'success');
}

function refreshDashboard() {
    renderDashboard();
    showToast('Dashboard refreshed', 'success');
}

function exportDashboard() {
    showToast('Exporting dashboard...', 'success');
}

function toggleDealsView() {
    showToast('Switching to list view...', 'success');
}

function viewDeal(id) {
    showToast('View deal: ' + id, 'success');
}

function openContactModal() {
    showToast('Contact modal - coming soon', 'success');
}

function openAccountModal() {
    showToast('Account modal - coming soon', 'success');
}

function openReportBuilder() {
    showToast('Report builder - coming soon', 'success');
}

function openWorkflowBuilder() {
    showToast('Workflow builder - coming soon', 'success');
}

function openTeamMemberModal() {
    showToast('Team member modal - coming soon', 'success');
}

function saveProfile(e) {
    e.preventDefault();
    showToast('Profile saved successfully', 'success');
}

function changePassword(e) {
    e.preventDefault();
    showToast('Password changed successfully', 'success');
}

function saveNotificationPreferences() {
    showToast('Notification preferences saved', 'success');
}

function saveCompanySettings(e) {
    e.preventDefault();
    showToast('Company settings saved', 'success');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}