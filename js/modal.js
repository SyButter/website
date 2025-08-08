export default function initModal() {
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalLink = document.getElementById('modal-link');


    const projectDetails = {
        'openGBW': {
            title: 'openGBW - Open-Source Grind by Weight',
            description: 'An open-source 3d printed base which turns a timed coffee grinder into a weight-based grinder using an ESP32 microcontroller, providing precision and consistency for coffee enthusiasts.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=openGBW',
            link: 'https://github.com/SyButter/openGBW'
        },
        'RasPi Adhan': {
            title: 'Raspberry Pi Adhan Player',
            description: 'A Raspberry Pi-powered system that automatically plays the Adhan (Islamic call to prayer) by fetching daily prayer times from an API using a Python script.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=RasPi+Adhan',
            link: 'https://github.com/SyButter/rasppi-adhan'
        },
        'AVAT': {
            title: 'Automated Vulnerability Assessment Tool',
            description: 'A Python-driven security scanner that orchestrates Nmap and OpenVAS to perform nightly vulnerability checks and send real-time Slack alerts to the security team.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=A.V.A.T',
            link: 'https://github.com/SyButter'
        },
        'FIT': {
            title: 'Blockchain-Based File Integrity Tracker',
            description: 'A Solidity smart contract and React/Web3.js UI to log and verify file integrity on the Ethereum testnet, ensuring real-time, tamper-proof validation against unauthorized changes.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=F.I.T',
            link: 'https://github.com/SyButter'
        },
        'Enrollment App': {
            title: 'Enrollment Forecasting App',
            description: 'A full-stack web app to forecast student enrollment data for public schools using Python (Flask, Prophet) and Chart.js for dynamic, interactive visualizations.',
            image: 'images/enrollmentapp.png',
            link: '#'
        }
    };

    function openModal(projectName) {
        const details = projectDetails[projectName];
        if (!details) return;

        modalTitle.textContent = details.title;
        modalDescription.textContent = details.description;
        modalImage.src = details.image;
        modalLink.href = details.link;

        if (details.link === '#') {
            modalLink.style.display = 'none';
        } else {
            modalLink.style.display = 'inline-block';
        }
        
        document.body.classList.add('modal-open');  
        modalBackdrop.classList.remove('hidden');
    }
    
    function closeModal() {
        document.body.classList.remove('modal-open');
        modalBackdrop.classList.add('hidden');
    }

    modalCloseButton.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
            closeModal();
        }
    });

    return openModal;
}