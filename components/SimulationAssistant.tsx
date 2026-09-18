'use client';

import { Joyride, EventData, STATUS, Step } from 'react-joyride';
import { translations, type Language } from '../lib/translations';

interface SimulationAssistantProps {
  run: boolean;
  onFinish: () => void;
  language: Language;
}

export default function SimulationAssistant({ run, onFinish, language }: SimulationAssistantProps) {
  const t = translations[language];
  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
            {t.welcomeTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.tourIntro}
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
            {t.mainNavigationTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.mainNavigationTourText}
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
            {t.runScenarioTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.runScenarioTourText}
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
            {t.briefingTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.briefingTourText}
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
            {t.quickActionsTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.quickActionsTourText}
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
            {t.kpisTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.kpisTourText}
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
            {t.assistantTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.assistantTourText}
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
            {t.actionCenterTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.actionCenterTourText}
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
            {t.ledgerTour}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.ledgerTourText}
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
      locale={{
        back: t.prev,
        close: t.close,
        last: t.finish,
        next: t.next,
        skip: t.close,
        nextWithProgress: [t.next, '({step} of {steps})'].join(' '),
      }}
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
