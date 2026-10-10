// Concise case studies drawn from the existing project notes.
export const projectStories = {
  'Prompt Injection Lab': {
    concept: true,
    problem: 'AI assistants can encounter untrusted text in retrieved documents, creating a need for repeatable tests of instruction boundaries.',
    approach: 'Build a controlled test harness with synthetic documents, configurable assistant policies, and explicit evaluation criteria.',
    result: 'A proposed report comparing test outcomes and response traces across assistant configurations.',
    diagramTitle: 'Proposed evaluation flow',
    stages: [
      ['Test cases', 'Create versioned synthetic documents that mix ordinary content with attempted instruction overrides.'],
      ['Isolated assistant', 'Run each case against a configured assistant using mocked tools and no production credentials.'],
      ['Evaluate behavior', 'Check responses against explicit policy criteria, with human review for ambiguous cases.'],
      ['Compare results', 'Present input and response traces alongside before-and-after results for each tested configuration.']
    ]
  },
  'SOC Alert Triage': {
    concept: true,
    problem: 'Security analysts need to connect related events and understand the evidence behind a possible incident.',
    approach: 'Normalize events, correlate related alerts, and use an AI layer to draft summaries with links to source records.',
    result: 'A proposed review queue that helps an analyst investigate and prioritize activity without taking automatic response actions.',
    diagramTitle: 'Proposed triage flow',
    stages: [
      ['Event ingestion', 'Load synthetic or sanitized authentication, endpoint, and network events into a common schema.'],
      ['Correlation', 'Group events by host, user, and time window while preserving the original record identifiers.'],
      ['Evidence summary', 'Draft a concise explanation of observed activity, explicitly separating evidence from inference.'],
      ['Analyst review', 'An analyst checks the cited records, edits the summary, and decides the incident priority.']
    ]
  },
  'Enrollment App': {
    problem: 'Schools need to plan around changing enrollment, using historical data that can be inconsistent.',
    approach: 'Prepare the data with Pandas, forecast with Prophet, and serve the results through Flask to interactive charts.',
    result: 'An application for comparing historical enrollment with projected trends.',
    stages: [
      ['Enrollment data', 'Pandas prepares historical enrollment records for time-series modeling.'],
      ['Prophet forecast', 'The model captures seasonal patterns and generates future enrollment estimates.'],
      ['Flask API', 'A REST API connects the Python forecasting backend to the browser.'],
      ['Interactive charts', 'Chart.js displays historical and predicted trends for exploration.']
    ]
  },
  'openGBW': {
    problem: 'A timed coffee grinder controls duration, while the desired output is a specific weight of coffee.',
    approach: 'Combine a load cell, ESP32 firmware, a touchscreen, and a custom 3D-printed base.',
    result: 'Weight-based grinding with live measurement and automatic shut-off at the target dose.',
    stages: [
      ['Target dose', 'The touchscreen lets the user set the desired weight before grinding.'],
      ['Load cell', 'The sensor measures weight as coffee collects in the custom base.'],
      ['ESP32 control', 'Firmware filters measurement noise, including vibration from the grinder motor.'],
      ['Automatic stop', 'The controller stops grinding when the target weight is reached.']
    ]
  },
  'AI Forecast Pipeline': {
    problem: 'Numeric forecasts need context before people can use them to make planning decisions.',
    approach: 'Connect a Prophet forecasting pipeline to an OpenAI layer, grounding recommendations in the forecast output.',
    result: 'Historical trends, future projections, and plain-language recommendations in one dashboard.',
    stages: [
      ['Historical data', 'The Python pipeline ingests and prepares historical time-series data.'],
      ['Prophet model', 'A tuned forecasting model produces projections for a configurable planning horizon.'],
      ['OpenAI summary', 'Forecast values provide context for structured decision summaries and recommendations.'],
      ['API & dashboard', 'Flask serves forecast data and recommendations to interactive charts.']
    ]
  },
  'OpenMasjidSolutions': {
    problem: 'Community spaces need practical software and hardware that a volunteer-driven team can maintain.',
    approach: 'Contribute full-stack development, a security audit, and custom 3D-printed hardware parts.',
    result: 'Contributions across the OpenMasjidOS codebase, platform security, and on-site hardware.',
    diagramTitle: 'How the contributions fit together',
    stages: [
      ['Community tools', 'OpenMasjidOS brings open-source software and hardware to day-to-day masjid operations.'],
      ['Software', 'Full-stack contributions support the shared platform and its community workflows.'],
      ['Security', 'A cybersecurity audit helps identify ways to harden the platform for real-world use.'],
      ['Hardware', 'Custom CAD designs provide 3D-printed parts for on-site devices.']
    ]
  },
  'n8n AI Engine': {
    problem: 'Reporting involves repeatedly moving data between sources, models, and communication tools.',
    approach: 'Use n8n to orchestrate data ingestion, Python inference, OpenAI summaries, and report delivery.',
    result: 'An automated reporting workflow with error-handling branches and alerts.',
    stages: [
      ['Data sources', 'APIs and spreadsheets feed data into the n8n workflow.'],
      ['Python inference', 'A persistent Python service runs model inference without loading models for each request.'],
      ['OpenAI summary', 'Model outputs become plain-language report summaries.'],
      ['Report delivery', 'Formatted reports go to Slack or email, with error branches surfacing failures.']
    ]
  },
  'Healthcare Forecaster': {
    problem: 'Planning staffing and supplies requires anticipating demand from noisy and incomplete historical data.',
    approach: 'Clean the data, combine forecasting models, and translate numeric output into allocation guidance.',
    result: 'Demand forecasts with confidence intervals and plain-language staffing and supply recommendations.',
    stages: [
      ['Data preparation', 'Cleaning and imputation address missing records and outliers while preserving useful signals.'],
      ['Ensemble forecast', 'Random Forest and Prophet model future demand, including seasonal patterns.'],
      ['Uncertainty', 'Confidence intervals accompany point predictions to communicate the range of possible demand.'],
      ['Planning guidance', 'An OpenAI layer translates the forecasts into staffing and supply recommendations.']
    ]
  },
  'RasPi Adhan': {
    problem: 'Daily prayer-time playback needs to stay reliable as schedules change and the device restarts.',
    approach: 'Combine Python prayer-time calculations with cron scheduling and a systemd service on a Raspberry Pi.',
    result: 'A daily prayer-time player designed for continuous, unattended operation.',
    stages: [
      ['Prayer times', 'Python determines daily prayer times based on location.'],
      ['Daily schedule', 'Cron jobs schedule playback at the calculated times.'],
      ['Raspberry Pi', 'The device runs the player continuously, with systemd supporting startup after a reboot.'],
      ['Audio playback', 'The Adhan plays at the scheduled prayer times.']
    ]
  },
  'FIT': {
    problem: 'Checking file integrity requires a reference that can be verified independently of the file itself.',
    approach: 'Connect a React and Web3.js interface to a Solidity smart contract on the Ethereum testnet.',
    result: 'A web application for registering file hashes and comparing files against an on-chain record.',
    stages: [
      ['File hash', 'A file is represented by a unique hash for integrity checking.'],
      ['Web3 interface', 'React and Web3.js connect the user interface to wallet and contract interactions.'],
      ['Testnet record', 'A Solidity smart contract stores the registered hash on the Ethereum testnet.'],
      ['Verification', 'The current file hash is checked against the registered on-chain reference.']
    ]
  }
};

export function renderProjectStory(projectName) {
  const story = projectStories[projectName];
  const container = document.getElementById('modal-case-study');
  const architecture = document.getElementById('modal-architecture');
  container.replaceChildren();
  architecture.replaceChildren();
  if (!story) return;

  for (const [label, text] of [['The problem', story.problem], [story.concept ? 'Proposed approach' : 'The approach', story.approach], [story.concept ? 'Intended outcome' : 'The result', story.result]]) {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    const paragraph = document.createElement('p');
    heading.textContent = label;
    paragraph.textContent = text;
    section.append(heading, paragraph);
    container.append(section);
  }

  const heading = document.createElement('h3');
  heading.textContent = story.diagramTitle || 'How it works';
  const hint = document.createElement('p');
  hint.className = 'architecture-hint';
  hint.textContent = 'Select a step to explore the system.';
  const steps = document.createElement('div');
  steps.className = 'architecture-steps';
  steps.setAttribute('role', 'group');
  steps.setAttribute('aria-label', heading.textContent);
  const detail = document.createElement('div');
  detail.className = 'architecture-detail';
  detail.id = 'architecture-detail';
  detail.setAttribute('aria-live', 'polite');
  detail.setAttribute('aria-atomic', 'true');
  const title = document.createElement('h4');
  const description = document.createElement('p');
  detail.append(title, description);
  story.stages.forEach(([name, text], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-controls', detail.id);
    const number = document.createElement('span');
    number.className = 'architecture-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.textContent = name;
    button.append(number, label);
    button.addEventListener('click', () => {
      steps.querySelectorAll('button').forEach(step => step.setAttribute('aria-pressed', String(step === button)));
      title.textContent = name;
      description.textContent = text;
    });
    steps.append(button);
  });
  title.textContent = story.stages[0][0];
  description.textContent = story.stages[0][1];
  architecture.append(heading, hint, steps, detail);
}
