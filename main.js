import { questions } from './data.js';




const cardGrid = document.getElementById('cardGrid');

// Generate cards dynamically based on questions array
questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `السؤال ${index + 1}`);
    card.setAttribute('data-index', index);

    card.innerHTML = `
        <div class="card-number">${index + 1}</div>
        <div class="card-category">${q.category}</div>
    `;

    // Add click and keyboard event listeners
    card.addEventListener('click', () => openModal(index));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(index);
        }
    });

    cardGrid.appendChild(card);
});






const modalOverlay = document.querySelector('.modal-overlay');
const modalQuestion = document.getElementById('modal-question');
const modalAnswer = document.getElementById('modal-answer');
const revealAnswerBtn = document.getElementById('revealAnswerBtn');
const randomBtn = document.getElementById('randomBtn');
const closeBtn = document.querySelector('.close-btn');
const questionCategory = document.getElementById('question-category');
let currentIndex = null;


// Open modal with selected question
function openModal(index) {
    currentIndex = index;
    const q = questions[index];
    modalQuestion.textContent = q.question;
    questionCategory.textContent = q.category;
    modalAnswer.textContent = '';
    modalAnswer.classList.remove('show');
    revealAnswerBtn.setAttribute('aria-expanded', 'false');
    revealAnswerBtn.disabled = false;
    modalOverlay.classList.add('active');
    revealAnswerBtn.focus();
    trapFocus(modalOverlay);
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
    currentIndex = null;
}

// Reveal answer
revealAnswerBtn.addEventListener('click', () => {
    modalAnswer.textContent = questions[currentIndex].answer;
    modalAnswer.classList.add('show');
    revealAnswerBtn.setAttribute('aria-expanded', 'true');
    revealAnswerBtn.disabled = true;
    modalAnswer.focus();
});

// Close modal on close button or outside click
closeBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Keyboard: close modal with Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});


// Random button picks a random question
randomBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    openModal(randomIndex);
});

// Focus trap helper
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;

    let firstFocusable = focusableElements[0];
    let lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function trap(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}