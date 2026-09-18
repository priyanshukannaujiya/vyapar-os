'use client';

import { Joyride, EventData, STATUS, Step } from 'react-joyride';

interface SimulationAssistantProps {
  run: boolean;
  onFinish: () => void;
}

export default function SimulationAssistant({ run, onFinish }: SimulationAssistantProps) {
  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
            Welcome to VyaparOS!
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            This simulation assistant will guide you through the key features of your new merchant intelligence platform. Let&apos;s get started!
          </p>
        </div>
      ),
      placement: 'center',
      skipBeacon: true,
    },
    {
      target: '.main-nav',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            Main Navigation
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Use this sidebar to access all your workspace tools. You can easily switch between modules like VyaparDost, Inventory, and Finance. You can also scroll down to see more options!
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '.tour-step-run-scenario',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            Run Full AI Scenario
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Click here to simulate a real-world scenario where VyaparOS detects issues and automatically generates recommendations.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.tour-step-briefing-card',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            VyaparOS AI Briefing
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            This is your daily briefing. The AI highlights the most critical things needing your attention and suggests the next best action.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.tour-step-quick-actions',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            Quick Actions
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access your most frequently used tools here, like receiving payments, creating QRs, or chatting with your AI assistant.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.tour-step-kpis',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            Key Performance Indicators
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitor your live sales, estimated contributions, customer footfall, and UPI performance at a glance.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.tour-step-vyapardost',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            VyaparDost Assistant
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your 24/7 AI merchant assistant. Ask questions about your business, stock, or payments and get immediate, actionable answers.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '.tour-step-action-center',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            Action Center
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            When the AI generates a recommendation, it appears here for your review. Approve actions to automatically trigger WhatsApp campaigns, Soundbox alerts, and more.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.tour-step-trusted-ledger',
      content: (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
            Trusted Execution Ledger
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Every action, recommendation, and approval is securely logged here, providing a transparent audit trail.
          </p>
        </div>
      ),
      placement: 'right',
    },
  ];

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem('vyaparos_tour_completed', 'true');
      onFinish();
    }
  };

  return (
    <Joyride
      onEvent={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      steps={steps}
      options={{
        zIndex: 10000,
        primaryColor: 'var(--blue, #0878d1)',
        textColor: 'var(--navy, #1a364d)',
        backgroundColor: '#ffffff',
        arrowColor: '#ffffff',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        showProgress: true,
        buttons: ['back', 'skip', 'primary'],
      }}
      styles={{
        buttonPrimary: {
          backgroundColor: 'var(--blue, #0878d1)',
          borderRadius: '6px',
          fontWeight: 500,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'var(--text-secondary, #4a6375)',
        },
        buttonSkip: {
          color: 'var(--text-secondary, #4a6375)',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
      }}
    />
  );
}
