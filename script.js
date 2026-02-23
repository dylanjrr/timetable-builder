const API_BASE_URL = 'http://localhost:8080/api';

let courses = [];
let lecturers = [];
let rooms = [];
let timeSlots = [];
let timetableEntries = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupEventListeners();
});

function setupEventListeners() {
    // Course form
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCourse();
    });

    // Lecturer form
    document.getElementById('lecturerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addLecturer();
    });

    // Room form
    document.getElementById('roomForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addRoom();
    });

    // Time slot form
    document.getElementById('timeslotForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTimeSlot();
    });

    // Timetable form
    document.getElementById('timetableForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTimetableEntry();
    });
}

async function loadAllData() {
    await Promise.all([
        loadCourses(),
        loadLecturers(),
        loadRooms(),
        loadTimeSlots(),
        loadTimetable()
    ]);
    updateTimetableDropdowns();
}

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.text();
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Failed to connect to backend server. Make sure it\'s running on port 8080.', 'error');
        throw error;
    }
}

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Courses
async function loadCourses() {
    try {
        const response = await apiCall('/courses');
        courses = JSON.parse(response);
        displayCourses();
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}

function displayCourses() {
    const container = document.getElementById('coursesList');
    container.innerHTML = '';

    courses.forEach(course => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${course.code}</h4>
                <p>${course.name}</p>
                <p>Credits: ${course.credits}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

async function addCourse() {
    const code = document.getElementById('courseCode').value;
    const name = document.getElementById('courseName').value;
    const credits = parseInt(document.getElementById('courseCredits').value);

    try {
        await apiCall('/courses', 'POST', { code, name, credits });
        showNotification('Course added successfully!', 'success');
        document.getElementById('courseForm').reset();
        await loadCourses();
        updateTimetableDropdowns();
    } catch (error) {
        showNotification('Failed to add course', 'error');
    }
}

// Lecturers
async function loadLecturers() {
    try {
        const response = await apiCall('/lecturers');
        lecturers = JSON.parse(response);
        displayLecturers();
    } catch (error) {
        console.error('Failed to load lecturers:', error);
    }
}

function displayLecturers() {
    const container = document.getElementById('lecturersList');
    container.innerHTML = '';

    lecturers.forEach(lecturer => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${lecturer.name}</h4>
                <p>ID: ${lecturer.id}</p>
                <p>Department: ${lecturer.department || 'Not specified'}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

async function addLecturer() {
    const id = document.getElementById('lecturerId').value;
    const name = document.getElementById('lecturerName').value;
    const department = document.getElementById('lecturerDepartment').value;

    try {
        await apiCall('/lecturers', 'POST', { id, name, department });
        showNotification('Lecturer added successfully!', 'success');
        document.getElementById('lecturerForm').reset();
        await loadLecturers();
        updateTimetableDropdowns();
    } catch (error) {
        showNotification('Failed to add lecturer', 'error');
    }
}

// Rooms
async function loadRooms() {
    try {
        const response = await apiCall('/rooms');
        rooms = JSON.parse(response);
        displayRooms();
    } catch (error) {
        console.error('Failed to load rooms:', error);
    }
}

function displayRooms() {
    const container = document.getElementById('roomsList');
    container.innerHTML = '';

    rooms.forEach(room => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${room.name}</h4>
                <p>Capacity: ${room.capacity}</p>
                <p>Type: ${room.type || 'Not specified'}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

async function addRoom() {
    const name = document.getElementById('roomName').value;
    const capacity = parseInt(document.getElementById('roomCapacity').value);
    const type = document.getElementById('roomType').value;

    try {
        await apiCall('/rooms', 'POST', { name, capacity, type });
        showNotification('Room added successfully!', 'success');
        document.getElementById('roomForm').reset();
        await loadRooms();
        updateTimetableDropdowns();
    } catch (error) {
        showNotification('Failed to add room', 'error');
    }
}

// Time Slots
async function loadTimeSlots() {
    try {
        const response = await apiCall('/timeslots');
        timeSlots = JSON.parse(response);
        displayTimeSlots();
    } catch (error) {
        console.error('Failed to load time slots:', error);
    }
}

function displayTimeSlots() {
    const container = document.getElementById('timeslotsList');
    container.innerHTML = '';

    timeSlots.forEach(slot => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${slot.day}</h4>
                <p>${slot.startTime} - ${slot.endTime}</p>
                <p>ID: ${slot.id}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

async function addTimeSlot() {
    const id = document.getElementById('timeslotId').value;
    const day = document.getElementById('timeslotDay').value;
    const startTime = document.getElementById('timeslotStartTime').value;
    const endTime = document.getElementById('timeslotEndTime').value;

    try {
        await apiCall('/timeslots', 'POST', { id, day, startTime, endTime });
        showNotification('Time slot added successfully!', 'success');
        document.getElementById('timeslotForm').reset();
        await loadTimeSlots();
        updateTimetableDropdowns();
    } catch (error) {
        showNotification('Failed to add time slot', 'error');
    }
}

// Timetable
async function loadTimetable() {
    try {
        const response = await apiCall('/timetable');
        timetableEntries = JSON.parse(response);
        displayTimetable();
    } catch (error) {
        console.error('Failed to load timetable:', error);
    }
}

function displayTimetable() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    days.forEach(day => {
        const container = document.getElementById(`${day}Schedule`).querySelector('.schedule-items');
        container.innerHTML = '';
        
        const dayEntries = timetableEntries.filter(entry => entry.day.toLowerCase() === day);
        
        dayEntries.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        dayEntries.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            item.innerHTML = `
                <div class="time">${entry.startTime} - ${entry.endTime}</div>
                <div class="course">${entry.courseCode}: ${entry.courseName}</div>
                <div class="room">Room: ${entry.roomName}</div>
                <div class="lecturer">${entry.lecturerName}</div>
            `;
            container.appendChild(item);
        });
        
        if (dayEntries.length === 0) {
            container.innerHTML = '<p style="color: #7f8c8d; text-align: center;">No classes scheduled</p>';
        }
    });
}

function updateTimetableDropdowns() {
    // Update course dropdown
    const courseSelect = document.getElementById('timetableCourse');
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(course => {
        courseSelect.innerHTML += `<option value="${course.code}">${course.code} - ${course.name}</option>`;
    });

    // Update lecturer dropdown
    const lecturerSelect = document.getElementById('timetableLecturer');
    lecturerSelect.innerHTML = '<option value="">Select Lecturer</option>';
    lecturers.forEach(lecturer => {
        lecturerSelect.innerHTML += `<option value="${lecturer.id}">${lecturer.name}</option>`;
    });

    // Update room dropdown
    const roomSelect = document.getElementById('timetableRoom');
    roomSelect.innerHTML = '<option value="">Select Room</option>';
    rooms.forEach(room => {
        roomSelect.innerHTML += `<option value="${room.name}">${room.name}</option>`;
    });

    // Update time slot dropdown
    const timeslotSelect = document.getElementById('timetableTimeslot');
    timeslotSelect.innerHTML = '<option value="">Select Time Slot</option>';
    timeSlots.forEach(slot => {
        timeslotSelect.innerHTML += `<option value="${slot.id}">${slot.day} ${slot.startTime}-${slot.endTime}</option>`;
    });
}

async function addTimetableEntry() {
    const id = document.getElementById('timetableId').value;
    const courseCode = document.getElementById('timetableCourse').value;
    const lecturerId = document.getElementById('timetableLecturer').value;
    const roomName = document.getElementById('timetableRoom').value;
    const timeSlotId = document.getElementById('timetableTimeslot').value;

    try {
        await apiCall('/timetable', 'POST', { id, courseCode, lecturerId, roomName, timeSlotId });
        showNotification('Timetable entry added successfully!', 'success');
        document.getElementById('timetableForm').reset();
        await loadTimetable();
    } catch (error) {
        showNotification('Failed to add timetable entry. Check for conflicts or missing data.', 'error');
    }
}

// Export functions
function exportTimetable(format) {
    if (timetableEntries.length === 0) {
        showNotification('No timetable entries to export', 'error');
        return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'text') {
        content = exportToText();
        filename = 'timetable.txt';
        mimeType = 'text/plain';
    } else if (format === 'csv') {
        content = exportToCSV();
        filename = 'timetable.csv';
        mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`Timetable exported as ${format.toUpperCase()} successfully!`, 'success');
}

function exportToText() {
    let content = 'DEPARTMENT TIMETABLE\n';
    content += '====================\n\n';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    days.forEach(day => {
        content += `${day}:\n`;
        content += '-'.repeat(60) + '\n';
        
        const dayEntries = timetableEntries.filter(entry => entry.day === day);
        
        if (dayEntries.length === 0) {
            content += 'No classes scheduled.\n\n';
        } else {
            dayEntries.sort((a, b) => a.startTime.localeCompare(b.startTime));
            dayEntries.forEach(entry => {
                content += `${entry.startTime} - ${entry.endTime} | `;
                content += `${entry.courseCode} - ${entry.courseName} | `;
                content += `Room: ${entry.roomName} | `;
                content += `${entry.lecturerName}\n`;
            });
            content += '\n';
        }
    });

    return content;
}

function exportToCSV() {
    let content = 'Day,Time,Course Code,Course Name,Room,Lecturer\n';
    
    timetableEntries.forEach(entry => {
        content += `${entry.day},`;
        content += `${entry.startTime} - ${entry.endTime},`;
        content += `${entry.courseCode},`;
        content += `${entry.courseName},`;
        content += `${entry.roomName},`;
        content += `${entry.lecturerName}\n`;
    });

    return content;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
