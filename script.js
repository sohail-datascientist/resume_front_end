const jdUpload = document.getElementById('jdUpload');
const resumeUpload = document.getElementById('resumeUpload');
const step2 = document.getElementById('step2');
const filters = document.getElementById('filters');
const resultsSection = document.getElementById('resultsSection');
const chartsSection = document.getElementById('chartsSection');
const resultsTable = document.getElementById('resultsTable');

// Mock data (replace with your backend integration)
let candidates = [];
let universities = [];
let skills = [];

// Initialize upload handlers
function initializeUpload(element, multiple = false) {
    const input = element.querySelector('.file-input');

    element.addEventListener('click', () => input.click());
    
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('dragover');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('dragover');
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files, element === jdUpload);
    });

    input.addEventListener('change', (e) => {
        handleFiles(e.target.files, element === jdUpload);
    });
}

// Handle file uploads
function handleFiles(files, isJD) {
    if (isJD) {
        // Process JD file
        console.log('Processing JD:', files[0].name);
        step2.style.display = 'block';
    } else {
        // Process resume files
        console.log('Processing resumes:', Array.from(files).map(f => f.name));
        showProcessingOverlay();
        setTimeout(() => {
            // Mock processing - replace with actual backend call
            loadMockData();
            hideProcessingOverlay();
            showResults();
        }, 2000);
    }
}

// Show processing overlay
function showProcessingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'processing-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
}

// Hide processing overlay
function hideProcessingOverlay() {
    const overlay = document.querySelector('.processing-overlay');
    if (overlay) overlay.remove();
}

// Load mock data
function loadMockData() {
    candidates = [
        {
            name: "John Doe",
            university: "MIT",
            skills: ["Python", "Machine Learning", "Data Science"],
            experience: 5,
            match: 95
        },
        {
            name: "Jane Smith",
            university: "Stanford",
            skills: ["Java", "React", "Node.js"],
            experience: 3,
            match: 85
        }
    ];

    universities = ["MIT", "Stanford", "Harvard"];
    skills = ["Python", "Java", "Machine Learning", "React", "Node.js"];

    updateFilters();
    updateStats();
}

// Update filters
function updateFilters() {
    const universityFilter = document.getElementById('universityFilter');
    const skillsFilter = document.getElementById('skillsFilter');

    universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni;
        option.textContent = uni;
        universityFilter.appendChild(option);
    });

    skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        skillsFilter.appendChild(option);
    });
}

// Update statistics
function updateStats() {
    document.getElementById('totalCandidates').textContent = candidates.length;
    document.getElementById('totalUniversities').textContent = universities.length;
    document.getElementById('uniqueSkills').textContent = skills.length;
    document.getElementById('avgExperience').textContent = 
        (candidates.reduce((acc, curr) => acc + curr.experience, 0) / candidates.length).toFixed(1) + ' yrs';
}

// Show results
function showResults() {
    filters.style.display = 'block';
    resultsSection.style.display = 'block';
    chartsSection.style.display = 'block';
    
    updateTable(candidates);
    createCharts();
}

// Update results table
function updateTable(data) {
    resultsTable.innerHTML = '';
    data.forEach(candidate => {
        // Determine shortlisting status based on match % 
        const status = candidate.match >= 90 ? 'Accepted' : 'Rejected';  // Change 90 to your desired threshold
        const subject = encodeURIComponent(`Shortlisting Status: ${status}`);
        const body = encodeURIComponent(`Dear ${candidate.name},\n\nWe are pleased to inform you that your application has been ${status}. Your match percentage is ${candidate.match}%.`);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${candidate.name}</td>
            <td>${candidate.university}</td>
            <td>${candidate.skills.join(', ')}</td>
            <td>${candidate.experience} years</td>
            <td>${candidate.match}%</td>
            <td>
                <a href="mailto:?subject=${subject}&body=${body}" class="btn btn-${status === 'Accepted' ? 'success' : 'danger'}">Email</a>
            </td>
        `;
        resultsTable.appendChild(row);
    });
}

// Create charts for universities and skills distribution
function createCharts() {
    const universityChart = new Chart(document.getElementById('universityChart'), {
        type: 'pie',
        data: {
            labels: universities,
            datasets: [{
                data: universities.map(() => Math.floor(Math.random() * 100)),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        }
    });

    const skillsChart = new Chart(document.getElementById('skillsChart'), {
        type: 'bar',
        data: {
            labels: skills,
            datasets: [{
                label: 'Skills Distribution',
                data: skills.map(() => Math.floor(Math.random() * 100)),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        }
    });
}

// Initialize the upload handlers
initializeUpload(jdUpload, false);
initializeUpload(resumeUpload, true);
