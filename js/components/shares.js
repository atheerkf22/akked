/**
 * Akked Shares & Proofs Registry Component
 */

window.AkkedShares = {
  currentFilter: 'all',
  searchQuery: '',

  render() {
    const isAr = I18N.currentLang === 'ar';
    let list = [...AkkedState.shares];

    // Filter by status
    if (this.currentFilter !== 'all') {
      list = list.filter(s => s.status === this.currentFilter);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(s => 
        (s.recipientNameAr && s.recipientNameAr.toLowerCase().includes(q)) ||
        (s.recipientNameEn && s.recipientNameEn.toLowerCase().includes(q)) ||
        (s.purposeNameAr && s.purposeNameAr.toLowerCase().includes(q)) ||
        (s.purposeNameEn && s.purposeNameEn.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q))
      );
    }

    return `
      <div class="shares-view animate-fade-in">
        <!-- Page Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">${I18N.t('sharesPageTitle')}</h1>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">${I18N.t('sharesPageSubtitle')}</p>
          </div>
          <button class="btn btn-primary" onclick="AkkedApp.navigate('wizard')">
            <span>➕</span>
            <span>${I18N.t('createSecureShare')}</span>
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="filter-bar card" style="padding: 16px; margin-bottom: 24px;">
          <!-- Status Filter Tabs -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="AkkedShares.setFilter('all')">
              ${I18N.t('filterAll')} (${AkkedState.shares.length})
            </button>
            <button class="btn ${this.currentFilter === 'active' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="AkkedShares.setFilter('active')">
              ${I18N.t('filterActive')} (${AkkedState.shares.filter(s=>s.status==='active').length})
            </button>
            <button class="btn ${this.currentFilter === 'expired' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="AkkedShares.setFilter('expired')">
              ${I18N.t('filterExpired')} (${AkkedState.shares.filter(s=>s.status==='expired').length})
            </button>
            <button class="btn ${this.currentFilter === 'revoked' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="AkkedShares.setFilter('revoked')">
              ${I18N.t('filterRevoked')} (${AkkedState.shares.filter(s=>s.status==='revoked').length})
            </button>
          </div>

          <!-- Search Input -->
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="${I18N.t('searchPlaceholder')}" value="${this.searchQuery}" oninput="AkkedShares.handleSearch(this.value)">
          </div>
        </div>

        <!-- Table Card -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>${I18N.t('colRecipient')}</th>
                  <th>${I18N.t('colPurpose')}</th>
                  <th>${I18N.t('colSharedData')}</th>
                  <th>${I18N.t('colCreatedDate')}</th>
                  <th>${I18N.t('colExpiryDate')}</th>
                  <th>${I18N.t('colStatus')}</th>
                  <th>${I18N.t('colActions')}</th>
                </tr>
              </thead>
              <tbody>
                ${list.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
                      <div style="font-size: 2.5rem; margin-bottom: 12px;">📁</div>
                      <div style="font-weight: 700; font-size: 1.1rem;">${I18N.t('noSharesFound')}</div>
                    </td>
                  </tr>
                ` : list.map(s => `
                  <tr>
                    <td>
                      <div style="font-weight: 800; color: var(--brand-primary); font-size: 0.95rem;">
                        ${isAr ? s.recipientNameAr : s.recipientNameEn}
                      </div>
                      <div style="font-family: monospace; font-size: 0.76rem; color: var(--text-subtle);">
                        ID: ${s.id}
                      </div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-main); font-size: 0.88rem;">
                        ${isAr ? s.purposeNameAr : s.purposeNameEn}
                      </div>
                    </td>
                    <td>
                      <span class="field-status-chip chip-hidden">
                        ${isAr ? s.sharedClaimsAr : s.sharedClaimsEn}
                      </span>
                    </td>
                    <td style="font-size: 0.82rem; color: var(--text-muted);">
                      ${s.createdDate}
                    </td>
                    <td style="font-size: 0.82rem; color: var(--text-muted);">
                      ${s.expiryDate}
                    </td>
                    <td>
                      <span class="badge ${s.status === 'active' ? 'badge-active' : (s.status === 'expired' ? 'badge-expired' : 'badge-revoked')}">
                        ${s.status === 'active' ? I18N.t('statusActive') : (s.status === 'expired' ? I18N.t('statusExpired') : I18N.t('statusRevoked'))}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn btn-secondary btn-sm" title="${I18N.t('actionViewDetails')}" onclick="AkkedShares.openProofModal('${s.id}')">
                          👁️
                        </button>
                        <button class="btn btn-secondary btn-sm" title="${I18N.t('actionCopyLink')}" onclick="AkkedShares.copyShareLink('${s.id}')">
                          🔗
                        </button>
                        ${s.status === 'active' ? `
                          <button class="btn btn-outline-danger btn-sm" title="${I18N.t('actionRevoke')}" onclick="AkkedShares.confirmRevoke('${s.id}')">
                            🚫
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    AkkedApp.renderView();
  },

  handleSearch(val) {
    this.searchQuery = val;
    AkkedApp.renderView();
  },

  copyShareLink(id) {
    const isAr = I18N.currentLang === 'ar';
    const share = AkkedState.shares.find(s => s.id === id);
    if (!share) return;

    const token = AkkedCrypto.createProofToken(share);
    const origin = window.location.origin;
    const path = window.location.pathname;
    const directUrl = `${origin}${path}?verify=${encodeURIComponent(share.id)}&token=${token}`;
    
    // Check if on localhost to provide LAN IP alternative
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const lanUrl = isLocalhost ? `http://192.168.8.34:8000${path}?verify=${encodeURIComponent(share.id)}&token=${token}` : directUrl;

    const qrSvg = AkkedCrypto.generateQRCodeSVG(lanUrl, 150);

    // Auto copy primary link
    navigator.clipboard.writeText(lanUrl).then(() => {
      AkkedApp.showToast(I18N.t('copiedToClipboard'), 'success');
    }).catch(() => {});

    AkkedApp.openModal(`
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🔗</div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--brand-primary); margin-bottom: 6px;">
          ${isAr ? 'مشاركة رابط التحقق الذاتي المشفر' : 'Share Self-Contained Verification Link'}
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.4;">
          ${isAr ? 'تم تضمين البصمة المشفرة في الرابط؛ يمكن لأي جهة أو هاتف جوال فحص الإثبات فوراً دون الحاجة لتثبيت أي تطبيق.' : 'The cryptographic claim is embedded in the link. Anyone opening this link can verify the proof instantly.'}
        </p>

        <!-- QR Code for Mobile Scanning -->
        <div style="margin-bottom: 20px; display: flex; flex-direction: column; align-items: center;">
          <div style="padding: 10px; background: #FFF; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border-light);">
            ${qrSvg}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 8px;">
            📱 ${isAr ? 'امسح الرمز بكاميرا الجوال للتحقق الفوري' : 'Scan QR with phone camera for instant verification'}
          </div>
        </div>

        <!-- Copyable Link Input -->
        <div style="margin-bottom: 20px; text-align: start;">
          <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: block;">
            ${isAr ? 'رابط المشاركة المشفر:' : 'Verifiable Link:'}
          </label>
          <div style="display: flex; gap: 8px;">
            <input type="text" readonly value="${lanUrl}" id="shareable-link-input" style="flex: 1; padding: 10px 14px; border: 1px solid var(--border-card); border-radius: var(--radius-md); font-size: 0.82rem; background-color: var(--brand-surface-subtle); color: var(--text-main); outline: none;">
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('shareable-link-input').select(); navigator.clipboard.writeText('${lanUrl}'); AkkedApp.showToast('${I18N.t('copiedToClipboard')}', 'success');">
              📋 ${isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-secondary" onclick="AkkedApp.closeModal()">
            ${isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    `);
  },

  confirmRevoke(id) {
    const share = AkkedState.shares.find(s => s.id === id);
    if (!share) return;
    
    AkkedApp.openModal(`
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 3rem; margin-bottom: 14px;">⚠️</div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--status-danger); margin-bottom: 8px;">
          ${I18N.t('confirmRevokeTitle')}
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 24px; line-height: 1.5;">
          ${I18N.t('confirmRevokeDesc')}
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="btn btn-secondary" onclick="AkkedApp.closeModal()">${I18N.t('btnCancel')}</button>
          <button class="btn btn-primary" style="background-color: var(--status-danger);" onclick="AkkedShares.executeRevoke('${id}')">
            ${I18N.t('btnConfirmRevoke')}
          </button>
        </div>
      </div>
    `);
  },

  executeRevoke(id) {
    AkkedState.revokeShare(id);
    AkkedApp.closeModal();
    AkkedApp.showToast(I18N.t('proofRevokedToast'), 'info');
    AkkedApp.renderView();
  },

  openProofModal(id) {
    const isAr = I18N.currentLang === 'ar';
    const share = AkkedState.shares.find(s => s.id === id);
    if (!share) return;

    const qrSvg = AkkedCrypto.generateQRCodeSVG(share.id, 140);
    const docTemplate = AkkedSampleDocs.find(d => d.id === share.docType) || AkkedSampleDocs[0];
    const previewSvg = docTemplate.renderSVG(true, share.allowedFieldIds || ['age_calc'], share.watermark);

    AkkedApp.openModal(`
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <!-- Card Replicating Visual Identity -->
        <div class="proof-mobile-mockup">
          <div class="proof-brand-header">
            <span class="proof-brand-logo">أكد</span>
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--brand-slate);">
              ${share.status === 'active' ? '🟢 نشط' : (share.status === 'expired' ? '🔴 منتهي' : '⚪ ملغي')}
            </span>
          </div>

          <div class="proof-main-icon">
            <span style="font-size: 2.2rem;">🛡️</span>
          </div>

          <div class="proof-title">
            ${isAr ? (share.id === 'DEMO-018' ? 'تم إثبات الأهلية' : 'إثبات معتمد وموثق') : 'Eligibility Proven'}
          </div>
          <div class="proof-subtitle">
            ${isAr ? share.sharedClaimsAr : share.sharedClaimsEn}
          </div>

          <div class="proof-badge-safe">
            <span>🛡️</span>
            <span>${I18N.t('noExtraData')}</span>
          </div>

          <div class="proof-id-pill">
            ${I18N.t('proofIdLabel')} ${share.id}
          </div>

          <div style="margin-bottom: 16px;">
            ${qrSvg}
          </div>

          <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; border-top: 1px solid var(--border-light); padding-top: 12px; width: 100%;">
            <div><strong>${isAr ? 'الجهة المستلمة:' : 'Recipient:'}</strong> ${isAr ? share.recipientNameAr : share.recipientNameEn}</div>
            <div><strong>${isAr ? 'الغرض:' : 'Purpose:'}</strong> ${isAr ? share.purposeNameAr : share.purposeNameEn}</div>
            <div><strong>${isAr ? 'ينتهي في:' : 'Expires:'}</strong> ${share.expiryDate}</div>
          </div>
        </div>

        <!-- Watermarked Document Preview Dropdown / Accordion -->
        <div style="width: 100%;">
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
            ${isAr ? 'معاينة الوثيقة المحمية بالعلامة المائية:' : 'Watermarked Document Preview:'}
          </div>
          <div style="max-height: 280px; overflow: hidden; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            ${previewSvg}
          </div>
        </div>

        <!-- Tamper Hash -->
        <div style="width: 100%; background-color: var(--brand-surface-subtle); padding: 12px; border-radius: var(--radius-md); font-size: 0.75rem;">
          <div style="font-weight: 700; color: var(--brand-primary); margin-bottom: 2px;">${I18N.t('tamperHashLabel')}</div>
          <div style="font-family: monospace; word-break: break-all; color: var(--text-muted);">${share.sha256Hash}</div>
        </div>

        <div style="display: flex; gap: 12px; width: 100%; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="AkkedShares.copyShareLink('${share.id}')">
            🔗 ${I18N.t('btnCopyProofLink')}
          </button>
          <button class="btn btn-primary" onclick="AkkedApp.navigate('verify', { proofId: '${share.id}' }); AkkedApp.closeModal();">
            🔍 ${I18N.t('btnVerifyNow')}
          </button>
        </div>
      </div>
    `);
  }
};
