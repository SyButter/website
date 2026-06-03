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
        'AI Forecast Pipeline': {
            title: 'AI Forecast Intelligence Pipeline',
            description: 'An end-to-end AI deployment pipeline that combines Meta\'s Prophet for time-series forecasting with OpenAI\'s GPT models to automatically convert raw predictions into clear, human-readable decision recommendations for stakeholders in education and resource allocation.',
            image: 'https://placehold.co/800x400/312e81/a5b4fc?text=AI+Forecast+Pipeline',
            link: '#',
            techStack: ['Python', 'Prophet (Meta)', 'OpenAI API', 'Pandas', 'Flask', 'Chart.js'],
            features: [
                'Ingests historical time-series data and trains a tuned Prophet forecasting model.',
                'Passes forecast output to GPT to generate plain-language decision summaries.',
                'REST API serves both raw forecast data and AI-generated recommendations.',
                'Interactive dashboard visualises historical trends alongside future projections.',
                'Configurable horizon windows for short, medium, and long-range planning.'
            ],
            challenges: 'The core challenge was prompt-engineering the OpenAI layer to produce consistently structured, domain-appropriate recommendations rather than generic summaries. Ensuring the LLM output remained grounded in the actual forecast numbers — without hallucinating trends — required careful context injection and output validation logic.'
        },
        'n8n AI Engine': {
            title: 'n8n AI Automation Engine',
            description: 'A production-grade, low-code automation platform built on n8n that wires together data ingestion from APIs and spreadsheets, Python-based ML inference, and OpenAI summarisation — delivering fully automated, AI-written reports to Slack or email with zero manual intervention.',
            image: 'https://placehold.co/800x400/312e81/a5b4fc?text=n8n+AI+Engine',
            link: '#',
            techStack: ['n8n', 'OpenAI API', 'Python', 'REST APIs', 'Slack API', 'SQL'],
            features: [
                'Visual workflow orchestration with n8n connecting 10+ data sources.',
                'Python ML nodes run inference and scoring inside the pipeline.',
                'OpenAI node generates plain-language summaries of model outputs.',
                'Delivers formatted reports to Slack channels and email recipients automatically.',
                'Error-handling branches with alerting to ensure zero silent failures.'
            ],
            challenges: 'Keeping ML inference fast enough to fit within workflow timeouts required pre-loading models into a persistent Python service rather than cold-starting per run. Designing reliable error-handling branches that surface failures clearly — without spamming alerts — was equally critical for a production-ready setup.'
        },
        'Healthcare Forecaster': {
            title: 'Healthcare Demand Forecaster',
            description: 'A machine learning pipeline that predicts patient volume and healthcare resource demand weeks in advance using scikit-learn ensemble models and Prophet. OpenAI then transforms model output into clear, actionable allocation guidance written in plain language for clinical and operations staff.',
            image: 'https://placehold.co/800x400/312e81/a5b4fc?text=Healthcare+Forecaster',
            link: '#',
            techStack: ['Python', 'scikit-learn', 'Prophet (Meta)', 'OpenAI API', 'Pandas', 'NumPy'],
            features: [
                'Ensemble model (Random Forest + Prophet) for robust demand prediction.',
                'Handles seasonality, holidays, and irregular demand spikes automatically.',
                'OpenAI layer converts numeric forecasts into staffing and supply recommendations.',
                'Confidence intervals surfaced alongside point predictions for risk-aware planning.',
                'Modular pipeline design allows swapping datasets for different resource types.'
            ],
            challenges: 'Healthcare demand data is noisy, irregular, and often incomplete. Building a robust data cleaning and imputation layer that preserved meaningful signals while removing outliers was the primary challenge. Tuning the ensemble to avoid over-fitting on short historical windows, while still capturing seasonal patterns, required extensive cross-validation.'
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

    const modalContent = document.getElementById('project-modal-content');
    let lastFocusedElement = null;

    function getFocusable() {
        return Array.from(
            modalContent.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        );
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    function openModal(projectName) {
        const details = projectDetails[projectName];
        if (!details) return;

        lastFocusedElement = document.activeElement;

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

        // Move focus into modal and enable trap
        requestAnimationFrame(() => modalCloseButton.focus());
        modalBackdrop.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        document.body.classList.remove('modal-open');
        modalBackdrop.classList.add('hidden');
        modalBackdrop.removeEventListener('keydown', trapFocus);

        // Return focus to the element that triggered the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
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