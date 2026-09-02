/**
 * Akked Dashboard Component
 */

window.AkkedDashboard = {
  render() {
    const isAr = I18N.currentLang === 'ar';
    const shares = AkkedState.shares || [];
    const activeShares = shares.filter(s => s.status === 'active');
    const expiredShares = shares.filter(s => s.status === 'expired');
    const totalShieldedFields = shares.reduce((acc, s) => acc + (s.shieldedFieldsCount || 0), 0);
    const avgPrivacyScore = shares.length > 0 ? 94 : 100;
    const recentShares = shares.slice(0, 4);

    return `
      <div class="dashboard-view animate-fade-in">
        <!-- Hero Action Banner -->
        <div class="card" style="background: linear-gradient(135deg, var(--brand-primary) 0%, #2f0b2c 100%); color: #FFFFFF; border: none; margin-bottom: 28px; position: relative; overflow: hidden;">
          <div style="position: absolute; right: -40px; bottom: -40px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(80, 190, 155, 0.25) 0%, transparent 70%); pointer-events: none;"></div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; position: relative; z-index: 2;">
            <div style="max-width: 620px;">
              <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(80, 190, 155, 0.2); border: 1px solid rgba(80, 190, 155, 0.4); padding: 4px 14px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; color: #50BE9B; margin-bottom: 12px;">
                <span>🛡️</span>
                <span>${I18N.t('privacyFirst')} — ${I18N.t('minNecessary')}</span>
              </div>
              <h1 style="font-size: 1.85rem; font-weight: 900; line-height: 1.25; margin-bottom: 8px; color: #FFFFFF;">
                ${I18N.t('quickActionHeroTitle')}
              </h1>
              <p style="font-size: 0.95rem; color: #E7E8EF; opacity: 0.9; margin-bottom: 20px; line-height: 1.5;">
                ${I18N.t('quickActionHeroDesc')}
              </p>
              <button class="btn btn-accent btn-lg" onclick="AkkedApp.navigate('wizard')">
                <span>➕</span>
                <span>${I18N.t('startNewProofBtn')}</span>
              </button>
            </div>

            <!-- Quick Identity Badge Widget -->
            <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-xl); padding: 20px 24px; text-align: center; min-width: 240px;">
              <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: #E7E8EF; margin-bottom: 6px;">
                ${I18N.t('localProcessingNotice')}
              </div>
              <div style="font-size: 2.2rem; font-weight: 900; color: #50BE9B; line-height: 1.1;">
                100%
              </div>
              <div style="font-size: 0.85rem; font-weight: 600; color: #FFFFFF; margin-top: 4px;">
                ${isAr ? 'سيادة بيانات محلية' : 'Local Data Sovereignty'}
              </div>
            </div>
          </div>
        </div>

        <!-- 4 KPI Stat Cards -->
        <div class="grid-container grid-cols-4" style="margin-bottom: 28px;">
          <!-- Active Shares -->
          <div class="card" style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background-color: var(--status-success-bg); color: var(--status-success); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              ⚡
            </div>
            <div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">${I18N.t('statActiveShares')}</div>
              <div style="font-size: 1.7rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">${activeShares.length}</div>
            </div>
          </div>

          <!-- Expired Shares -->
          <div class="card" style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background-color: var(--status-danger-bg); color: var(--status-danger); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              ⏳
            </div>
            <div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">${I18N.t('statExpiredShares')}</div>
              <div style="font-size: 1.7rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">${expiredShares.length}</div>
            </div>
          </div>

          <!-- Protected Fields -->
          <div class="card" style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background-color: var(--brand-accent-light); color: var(--brand-accent); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              🛡️
            </div>
            <div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">${I18N.t('statProtectedFields')}</div>
              <div style="font-size: 1.7rem; font-weight: 800; color: var(--text-main); line-height: 1.2;">${totalShieldedFields}</div>
            </div>
          </div>

          <!-- Privacy Health Score -->
          <div class="card" style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background-color: var(--brand-primary-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              💎
            </div>
            <div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">${I18N.t('statPrivacyHealth')}</div>
              <div style="font-size: 1.7rem; font-weight: 800; color: var(--brand-accent); line-height: 1.2;">${avgPrivacyScore}%</div>
            </div>
          </div>
        </div>

        <!-- 2 Column Layout: Recent Shares + Live Privacy Health Gauge -->
        <div class="grid-container grid-cols-12">
          <!-- Recent Shares (8 Cols) -->
          <div class="card" style="grid-column: span 8;">
            <div class="card-header">
              <div>
                <h2 class="card-title">
                  <span>📂</span>
                  <span>${I18N.t('recentActivityTitle')}</span>
                </h2>
                <p class="card-subtitle">${isAr ? 'أحدث الوثائق والإثباتات المصدرة' : 'Latest issued proofs and consent records'}</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="AkkedApp.navigate('shares')">
                ${I18N.t('viewAllShares')} →
              </button>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${I18N.t('colRecipient')}</th>
                    <th>${I18N.t('colPurpose')}</th>
                    <th>${I18N.t('colSharedData')}</th>
                    <th>${I18N.t('colStatus')}</th>
                    <th>${I18N.t('colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentShares.map(s => `
                    <tr>
                      <td style="font-weight: 700; color: var(--brand-primary);">
                        ${isAr ? s.recipientNameAr : s.recipientNameEn}
                      </td>
                      <td style="font-size: 0.85rem; color: var(--text-muted);">
                        ${isAr ? s.purposeNameAr : s.purposeNameEn}
                      </td>
                      <td>
                        <span class="field-status-chip chip-hidden">
                          ${isAr ? s.sharedClaimsAr : s.sharedClaimsEn}
                        </span>
                      </td>
                      <td>
                        <span class="badge ${s.status === 'active' ? 'badge-active' : (s.status === 'expired' ? 'badge-expired' : 'badge-revoked')}">
                          ${s.status === 'active' ? I18N.t('statusActive') : (s.status === 'expired' ? I18N.t('statusExpired') : I18N.t('statusRevoked'))}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="AkkedShares.openProofModal('${s.id}')">
                          👁️ ${I18N.t('actionViewDetails')}
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Privacy Health & PDPL Compliance Card (4 Cols) -->
          <div class="card" style="grid-column: span 4; display: flex; flex-direction: column; justify-content: space-between;">
            <div class="card-header">
              <h2 class="card-title">
                <span>🛡️</span>
                <span>${isAr ? 'مؤشر الامتثال للخصوصية' : 'Privacy Compliance'}</span>
              </h2>
            </div>

            <div class="privacy-gauge-container">
              <div class="gauge-svg-wrap">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle class="gauge-bg" cx="70" cy="70" r="58" stroke-width="12" fill="none" />
                  <circle class="gauge-progress" cx="70" cy="70" r="58" stroke-width="12" fill="none" 
                    stroke-dasharray="364.4" stroke-dashoffset="21.8" />
                </svg>
                <div class="gauge-value-text">94%</div>
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-top: 14px;">
                ${isAr ? 'مستوى حماية فائق وممتثل' : 'Excellent Protection Level'}
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                ${isAr ? 'تطبيق صارم لمبدأ تقليص البيانات ونظام حماية البيانات الشخصية السعودي (PDPL)' : 'Strict adherence to Saudi PDPL and Data Minimization Principle'}
              </p>
            </div>

            <div style="background-color: var(--brand-surface-subtle); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-light); font-size: 0.82rem; color: var(--text-muted);">
              <div style="font-weight: 700; color: var(--brand-primary); margin-bottom: 4px;">
                ${I18N.t('legalDisclaimer')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
