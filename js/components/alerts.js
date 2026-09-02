/**
 * Akked Security Alerts & Activity Timeline Component
 */

window.AkkedAlerts = {
  render() {
    const isAr = I18N.currentLang === 'ar';
    const alerts = AkkedState.alerts || [];

    return `
      <div class="alerts-view animate-fade-in" style="max-width: 860px; margin: 0 auto;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">${I18N.t('alertsPageTitle')}</h1>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">${I18N.t('alertsPageSubtitle')}</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="AkkedAlerts.markAllRead()">
            <span>✓</span>
            <span>${I18N.t('btnMarkAllRead')}</span>
          </button>
        </div>

        <!-- Timeline Card -->
        <div class="card" style="padding: 24px;">
          <div class="activity-timeline">
            ${alerts.length === 0 ? `
              <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <div style="font-size: 2.5rem; margin-bottom: 8px;">🔔</div>
                <div style="font-weight: 700;">${isAr ? 'لا توجد تنبيهات جديدة' : 'No alerts recorded'}</div>
              </div>
            ` : alerts.map(alt => {
              let icon = '🔔';
              let iconBg = 'var(--brand-surface-tint)';
              let iconColor = 'var(--brand-primary)';

              if (alt.type === 'verification') {
                icon = '✅';
                iconBg = 'var(--brand-accent-light)';
                iconColor = 'var(--brand-accent)';
              } else if (alt.type === 'expiry') {
                icon = '⏳';
                iconBg = 'var(--status-warning-bg)';
                iconColor = 'var(--status-warning)';
              } else if (alt.type === 'revoked') {
                icon = '🚫';
                iconBg = 'var(--status-danger-bg)';
                iconColor = 'var(--status-danger)';
              } else if (alt.type === 'security') {
                icon = '🛡️';
                iconBg = 'var(--brand-primary-light)';
                iconColor = 'var(--brand-primary)';
              }

              return `
                <div class="timeline-item" style="opacity: ${alt.read ? '0.75' : '1'};">
                  <div class="timeline-icon-wrap" style="background-color: ${iconBg}; color: ${iconColor};">
                    ${icon}
                  </div>
                  <div class="timeline-content">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                      <div class="timeline-title">${isAr ? alt.titleAr : alt.titleEn}</div>
                      <span class="timeline-meta">${alt.timestamp}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
                      ${isAr ? alt.descAr : alt.descEn}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  markAllRead() {
    AkkedState.alerts.forEach(a => a.read = true);
    AkkedState.save();
    AkkedApp.renderView();
    AkkedApp.updateNotificationBadge();
  }
};
