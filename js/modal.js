export default function initModal() {
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalLink = document.getElementById('modal-link');
    const modalTechStack = document.getElementById('modal-tech-stack');
    const modalFeatures = document.getElementById('modal-features');
    const modalChallenges = document.getElementById('modal-challenges');

    const projectDetails = {
        'openGBW': {
            title: 'openGBW - Open-Source Grind by Weight',
            description: 'An open-source 3d printed base which turns a timed coffee grinder into a weight-based grinder using an ESP32 microcontroller, providing precision and consistency for coffee enthusiasts.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=openGBW',
            link: 'https://github.com/SyButter/openGBW',
            techStack: ['C++', 'PlatformIO', 'ESP32', 'Nextion HMI', '3D Printing (CAD)'],
            features: [
                'Real-time weight measurement with a precision load cell.',
                'Automatic shut-off when the target weight is reached.',
                'Intuitive touchscreen interface for setting target weights.',
                'Open-source hardware and software for community collaboration.'
            ],
            challenges: 'A key challenge was calibrating the load cell for consistent accuracy and filtering out motor vibrations to prevent measurement noise. This required both hardware decoupling and implementing a software-based moving average filter.'


        },
        'RasPi Adhan': {
            title: 'Raspberry Pi Adhan Player',
            description: 'A Raspberry Pi-powered system that automatically plays the Adhan (Islamic call to prayer) at the correct times each day. The system is designed to be a reliable, set-and-forget solution for homes and community spaces.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=RasPi+Adhan',
            link: 'https://github.com/SyButter/rasppi-adhan',
            techStack: ['Python', 'Raspberry Pi OS', 'Systemd', 'Cron Jobs', 'REST APIs'],
            features: [
                'Fetches daily prayer times locally with calculations based on location.',
                'Automatically schedules playback using system cron jobs.',
                'Uses systemd to ensure the script runs reliably on boot.',
                'Designed for low power consumption and continuous operation.'
            ],
            challenges: 'The main challenge was ensuring reliability. This involved writing a robust Python script with error handling for API failures and using Linux services like cron and systemd to guarantee the schedule updates and plays daily without any manual intervention.'
        },
        'AVAT': {
            title: 'Automated Vulnerability Assessment Tool',
            description: 'A Python-driven security scanner that orchestrates Nmap and OpenVAS to perform nightly vulnerability checks and send real-time Slack alerts.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=A.V.A.T',
            link: '#', // Private repository
            techStack: ['Python', 'Nmap', 'OpenVAS API', 'Slack API', 'Cron Jobs', 'Shell Scripting'],
            features: [
                'Orchestrates multiple industry-standard security tools into a single workflow.',
                'Automates regularly scheduled (nightly) network and vulnerability scans.',
                'Parses complex XML scan results into a concise, human-readable format.',
                'Delivers instant, actionable security alerts to a dedicated Slack channel.'
            ],
            challenges: 'A key challenge was parsing the inconsistent and verbose XML output from different scanning tools. Creating a unified data structure and writing a reliable error-handling system to manage long-running scans without failure were critical to the project\'s success.'
        },
        'FIT': {
            title: 'Blockchain-Based File Integrity Tracker',
            description: 'A Solidity smart contract and React/Web3.js UI to log and verify file integrity on the Ethereum testnet, ensuring real-time, tamper-proof validation.',
            image: 'https://placehold.co/800x400/1f2937/ffffff?text=F.I.T',
            link: '#', // Private repository
            techStack: ['Solidity', 'Hardhat', 'React', 'Web3.js', 'Ethereum (Testnet)', 'IPFS'],
            features: [
                'Allows users to register a file\'s unique hash on the Ethereum blockchain.',
                'Provides a tamper-proof, decentralized ledger for file integrity verification.',
                'Web interface allows for easy file upload to check its hash against the on-chain record.',
                'Connects a user-friendly front end to a complex Web3 smart contract backend.'
            ],
            challenges: 'Writing a gas-efficient and secure Solidity smart contract was the primary challenge. On the front end, managing the asynchronous nature of blockchain transactions and creating a smooth user experience for wallet connections and transaction signing required careful state management.'
        },
        'Enrollment App': {
            title: 'Enrollment Forecasting App',
            description: 'A full-stack web app to forecast student enrollment data for public schools using Python (Flask, Prophet) and Chart.js for dynamic, interactive visualizations.',
            image: 'images/enrollmentapp.png',
            link: '#',
            techStack: ['Python', 'Flask', 'Pandas', 'Prophet (by Meta)', 'Chart.js', 'HTML/CSS'],
            features: [
                'Time-series forecasting of student enrollment data.',
                'Interactive and responsive charts to visualize historical and predicted trends.',
                'Data processing backend to clean and prepare raw enrollment data.',
                'REST API built with Flask to serve forecast data to the front end.'
            ],
            challenges: 'The main challenge was tuning Meta\'s Prophet model to accurately capture complex seasonalities and holiday effects within the school year. Ensuring the data processing pipeline could handle inconsistencies in historical data was also a key focus.'
        }
    };

    function openModal(projectName) {
        const details = projectDetails[projectName];
        if (!details) return;

        modalTitle.textContent = details.title;
        modalDescription.textContent = details.description;
        modalImage.src = details.image;
        modalLink.href = details.link;
        modalTechStack.innerHTML = '';
        modalFeatures.innerHTML = '';

        if (details.techStack && details.techStack.length > 0) {
            details.techStack.forEach(tech => {
                const badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.textContent = tech;
                modalTechStack.appendChild(badge);
            });
        }
        if (details.features && details.features.length > 0) {
            details.features.forEach(featureText => {
                const li = document.createElement('li');
                li.textContent = featureText;
                modalFeatures.appendChild(li);
            });
        }

        modalChallenges.textContent = details.challenges || '';
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