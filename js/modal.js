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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2270%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%2F%3E%0A%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%224%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3Cline%20x1%3D%22300%22%20y1%3D%22200%22%20x2%3D%22300%22%20y2%3D%22145%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Cline%20x1%3D%22300%22%20y1%3D%22200%22%20x2%3D%22338%22%20y2%3D%22217%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Cline%20x1%3D%22300%22%20y1%3D%22128%22%20x2%3D%22300%22%20y2%3D%22116%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%2F%3E%0A%3Cline%20x1%3D%22372%22%20y1%3D%22200%22%20x2%3D%22384%22%20y2%3D%22200%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%2F%3E%0A%3Cline%20x1%3D%22300%22%20y1%3D%22272%22%20x2%3D%22300%22%20y2%3D%22284%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%2F%3E%0A%3Cline%20x1%3D%22228%22%20y1%3D%22200%22%20x2%3D%22216%22%20y2%3D%22200%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%2F%3E%0A%3C%2Fsvg%3E',
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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Ccircle%20cx%3D%22255%22%20cy%3D%22235%22%20r%3D%226%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3Cpath%20d%3D%22M%20278%20235%20A%2038%2038%200%200%201%20278%20197%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M%20296%20250%20A%2062%2062%200%200%201%20296%20182%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.65%22%2F%3E%0A%3Cpath%20d%3D%22M%20314%20265%20A%2086%2086%200%200%201%20314%20167%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.4%22%2F%3E%0A%3C%2Fsvg%3E',
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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2275%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20opacity%3D%220.45%22%2F%3E%0A%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2250%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20opacity%3D%220.65%22%2F%3E%0A%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2225%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%222%22%20fill%3D%22none%22%2F%3E%0A%3Cline%20x1%3D%22300%22%20y1%3D%22200%22%20x2%3D%22300%22%20y2%3D%22125%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Ccircle%20cx%3D%22344%22%20cy%3D%22158%22%20r%3D%224%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3Ccircle%20cx%3D%22248%22%20cy%3D%22228%22%20r%3D%224%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3C%2Fsvg%3E',
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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Crect%20x%3D%22248%22%20y%3D%22174%22%20width%3D%2262%22%20height%3D%2252%22%20rx%3D%2226%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%224%22%20fill%3D%22none%22%2F%3E%0A%3Crect%20x%3D%22300%22%20y%3D%22174%22%20width%3D%2262%22%20height%3D%2252%22%20rx%3D%2226%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%224%22%20fill%3D%22none%22%2F%3E%0A%3C%2Fsvg%3E',
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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Cpolyline%20points%3D%22228%2C252%20264%2C222%20300%2C236%20336%2C190%20372%2C206%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpolyline%20points%3D%22372%2C206%20406%2C168%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-dasharray%3D%226%207%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Ccircle%20cx%3D%22372%22%20cy%3D%22206%22%20r%3D%224.5%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3C%2Fsvg%3E',
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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Cpolyline%20points%3D%22228%2C252%20264%2C222%20300%2C236%20336%2C190%20372%2C206%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpolyline%20points%3D%22372%2C206%20406%2C168%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-dasharray%3D%226%207%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Ccircle%20cx%3D%22372%22%20cy%3D%22206%22%20r%3D%224.5%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3C%2Fsvg%3E',
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
            image: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23161820%22%2F%3E%0A%3Cdefs%3E%3Cpattern%20id%3D%22dots%22%20width%3D%2228%22%20height%3D%2228%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%221.4%22%20fill%3D%22%23FF8A33%22%20opacity%3D%220.16%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%0A%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23dots)%22%2F%3E%0A%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%22599%22%20height%3D%22399%22%20fill%3D%22none%22%20stroke%3D%22%23FF8A33%22%20stroke-opacity%3D%220.3%22%20stroke-width%3D%221%22%2F%3E%0A%3Cpolyline%20points%3D%22228%2C252%20264%2C222%20300%2C236%20336%2C190%20372%2C206%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpolyline%20points%3D%22372%2C206%20406%2C168%22%20stroke%3D%22%23FF8A33%22%20stroke-width%3D%223%22%20fill%3D%22none%22%20stroke-dasharray%3D%226%207%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Ccircle%20cx%3D%22372%22%20cy%3D%22206%22%20r%3D%224.5%22%20fill%3D%22%23FF8A33%22%2F%3E%0A%3C%2Fsvg%3E',
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