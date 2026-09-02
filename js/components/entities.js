/**
 * Akked Trusted Entities Component
 */

window.AkkedEntities = {
  render() {
    const isAr = I18N.currentLang === 'ar';
    const entities = AkkedState.entities || [];

    return `
      <div class="entities-view animate-fade-in">
        <!-- Header -->
        <div style="margin-bottom: 24px;">
          <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">${I18N.t('entitiesPageTitle')}</h1>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">${I18N.t('entitiesPageSubtitle')}</p>
        </div>

        <!-- Entity Cards Grid -->
        <div class="grid-container grid-cols-2">
          ${entities.map(ent => `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
              <div>
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--brand-surface-tint); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">
                      ${ent.icon}
                    </div>
                    <div>
                      <div style="font-weight: 800; font-size: 1.1rem; color: var(--brand-primary);">
                        ${isAr ? ent.nameAr : ent.nameEn}
                      </div>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">
                        ${isAr ? ent.categoryAr : ent.categoryEn}
                      </div>
                    </div>
                  </div>

                  <span class="badge badge-active" style="padding: 4px 10px;">
                    ⭐ ${ent.trustScore}% ${isAr ? 'موثوق' : 'Verified'}
                  </span>
                </div>

                <div style="background-color: var(--brand-surface-subtle); border-radius: var(--radius-md); padding: 12px; border: 1px solid var(--border-light); font-size: 0.82rem; margin-bottom: 14px;">
                  <div style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">
                    ${I18N.t('entityPermittedScopes')}:
                  </div>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    ${ent.verifiedScopes.map(scope => `
                      <span class="badge" style="background: var(--brand-primary-light); color: var(--brand-primary);">
                        ${scope.replace('_', ' ')}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted);">
                  <span>${I18N.t('entityTotalShares')}: <strong>${ent.totalShares}</strong></span>
                  <span style="color: #0d825b; font-weight: 700;">✅ ${isAr ? 'ممتثل لنظام حماية البيانات (PDPL)' : 'PDPL Compliant'}</span>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border-light); padding-top: 14px;">
                <button class="btn btn-secondary" style="width: 100%;" onclick="AkkedWizard.init(); AkkedWizard.selectedRecipientId = '${ent.id}'; AkkedApp.navigate('wizard');">
                  ➕ ${I18N.t('btnQuickShareToEntity')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};
