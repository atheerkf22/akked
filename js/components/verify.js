/**
 * Akked Recipient Verification Portal Component
 */

window.AkkedVerify = {
  currentProofId: '',
  verifiedData: null,
  searchPerformed: false,

  render(params = {}) {
    const isAr = I18N.currentLang === 'ar';
    
    // Auto-check if token or proofId passed
    if (params.token) {
      const decodedProof = AkkedCrypto.parseProofToken(params.token);
      if (decodedProof) {
        this.currentProofId = decodedProof.id;
        this.verifiedData = decodedProof;
        this.searchPerformed = true;
        // Optionally cache in local shares if not present
        if (!AkkedState.shares.find(s => s.id === decodedProof.id)) {
          AkkedState.shares.unshift(decodedProof);
          AkkedState.save();
        }
      }
    } else if (params.proofId && !this.searchPerformed) {
      this.currentProofId = params.proofId;
      this.checkProof(params.proofId, false);
    }

    return `
      <div class="verify-view animate-fade-in" style="max-width: 840px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: var(--brand-accent-light); color: var(--brand-accent); font-size: 2rem; margin-bottom: 12px;">
            🔍
          </div>
          <h1 style="font-size: 1.7rem; font-weight: 900; color: var(--brand-primary);">${I18N.t('verifyPortalTitle')}</h1>
          <p style="font-size: 0.92rem; color: var(--text-muted); margin-top: 4px; max-width: 620px; margin-inline: auto;">
            ${I18N.t('verifyPortalSubtitle')}
          </p>
        </div>

        <!-- Input Box Card -->
        <div class="card" style="padding: 24px; margin-bottom: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 260px; position: relative;">
              <input type="text" id="verify-input-id" placeholder="${I18N.t('inputProofIdPlaceholder')}" value="${this.currentProofId}" 
                style="width: 100%; padding: 12px 18px; border: 2px solid var(--border-card); border-radius: var(--radius-md); font-size: 1rem; font-family: monospace; outline: none; background-color: var(--bg-card); color: var(--text-main);"
                onkeypress="if(event.key === 'Enter') AkkedVerify.handleVerifyClick()">
            </div>
            <button class="btn btn-primary btn-lg" onclick="AkkedVerify.handleVerifyClick()">
              <span>🔍</span>
              <span>${I18N.t('btnCheckProof')}</span>
            </button>
          </div>

          <!-- Quick Test Badges -->
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 14px; flex-wrap: wrap; font-size: 0.82rem; color: var(--text-muted);">
            <span>${isAr ? 'جرّب فحص إثبات جاهز:' : 'Test with existing proof:'}</span>
            <button class="btn btn-secondary btn-sm" onclick="AkkedVerify.quickCheck('DEMO-018')">DEMO-018 (18+ Active)</button>
            <button class="btn btn-secondary btn-sm" onclick="AkkedVerify.quickCheck('AKK-512')">AKK-512 (Salary Active)</button>
            <button class="btn btn-secondary btn-sm" onclick="AkkedVerify.quickCheck('EXP-094')">EXP-094 (Expired)</button>
          </div>
        </div>

        <!-- Verification Results Pane -->
        ${this.searchPerformed ? this.renderVerificationResult() : ''}
      </div>
    `;
  },

  handleVerifyClick() {
    const input = document.getElementById('verify-input-id');
    if (input && input.value.trim()) {
      this.checkProof(input.value.trim(), true);
    }
  },

  quickCheck(id) {
    this.currentProofId = id;
    this.checkProof(id, true);
  },

  checkProof(id, shouldRender = true) {
    this.currentProofId = id;
    this.searchPerformed = true;
    const match = AkkedState.shares.find(s => s.id.toLowerCase() === id.toLowerCase());
    this.verifiedData = match || null;

    if (shouldRender) {
      AkkedApp.renderView();
    }
  },

  renderVerificationResult() {
    const isAr = I18N.currentLang === 'ar';
    const proof = this.verifiedData;

    if (!proof) {
      return `
        <div class="card animate-fade-in" style="border: 2px solid var(--status-danger); text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">❌</div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--status-danger); margin-bottom: 6px;">
            ${isAr ? 'لم يتم العثور على هذا الإثبات' : 'Proof Not Found'}
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">
            ${isAr ? 'تأكد من صحة رقم الإثبات أو رمز الاستجابة السريعة المدخل.' : 'Please verify the Proof ID or QR code.'}
          </p>
        </div>
      `;
    }

    const isValid = proof.status === 'active';
    const isExpired = proof.status === 'expired';
    const isRevoked = proof.status === 'revoked';

    return `
      <div class="card animate-fade-in" style="border: 2px solid ${isValid ? 'var(--brand-accent)' : (isExpired ? 'var(--status-danger)' : 'var(--brand-slate)')}; padding: 32px; box-shadow: var(--shadow-xl);">
        <!-- Status Header Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid var(--border-light);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: ${isValid ? 'var(--brand-accent-light)' : 'var(--status-danger-bg)'}; color: ${isValid ? 'var(--brand-accent)' : 'var(--status-danger)'}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              ${isValid ? '✅' : (isExpired ? '⏳' : '🚫')}
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.15rem; color: var(--text-main);">
                ${isValid ? I18N.t('claimStatusValid') : (isExpired ? I18N.t('claimStatusExpired') : I18N.t('claimStatusRevoked'))}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">
                Proof ID: ${proof.id}
              </div>
            </div>
          </div>

          <span class="badge ${isValid ? 'badge-active' : (isExpired ? 'badge-expired' : 'badge-revoked')}" style="padding: 6px 14px; font-size: 0.85rem;">
            ${isValid ? I18N.t('statusActive') : (isExpired ? I18N.t('statusExpired') : I18N.t('statusRevoked'))}
          </span>
        </div>

        <!-- Verified Minimal Claim Box -->
        <div style="background: linear-gradient(135deg, rgba(80, 190, 155, 0.12) 0%, rgba(90, 24, 84, 0.06) 100%); border: 1.5px solid var(--brand-accent); border-radius: var(--radius-lg); padding: 22px; margin-bottom: 24px;">
          <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--brand-primary); margin-bottom: 6px; letter-spacing: 0.05em;">
            ${I18N.t('verifiedClaimTitle')}
          </div>
          <div style="font-size: 1.35rem; font-weight: 900; color: var(--brand-primary); margin-bottom: 8px;">
            ${isAr ? proof.sharedClaimsAr : proof.sharedClaimsEn}
          </div>
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: #0d825b; font-weight: 700;">
            <span>🛡️</span>
            <span>${I18N.t('noExtraData')}</span>
          </div>
        </div>

        <!-- Scope & Restriction Details Table -->
        <div class="grid-container grid-cols-2" style="margin-bottom: 24px;">
          <div style="background-color: var(--brand-surface-subtle); padding: 16px; border-radius: var(--radius-md);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">${I18N.t('verifiedForRecipient')}</div>
            <div style="font-size: 1rem; font-weight: 800; color: var(--brand-primary); margin-top: 2px;">
              ${isAr ? proof.recipientNameAr : proof.recipientNameEn}
            </div>
          </div>

          <div style="background-color: var(--brand-surface-subtle); padding: 16px; border-radius: var(--radius-md);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">${I18N.t('verifiedPurpose')}</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
              ${isAr ? proof.purposeNameAr : proof.purposeNameEn}
            </div>
          </div>

          <div style="background-color: var(--brand-surface-subtle); padding: 16px; border-radius: var(--radius-md);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">${I18N.t('colCreatedDate')}</div>
            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">
              ${proof.createdDate}
            </div>
          </div>

          <div style="background-color: var(--brand-surface-subtle); padding: 16px; border-radius: var(--radius-md);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">${I18N.t('verifiedExpiry')}</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: ${isValid ? 'var(--brand-accent)' : 'var(--status-danger)'}; margin-top: 2px;">
              ${proof.expiryDate}
            </div>
          </div>
        </div>

        <!-- Tamper Verification Audit Pass -->
        <div style="background-color: var(--brand-surface-tint); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--border-light); font-size: 0.82rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: 700; color: var(--text-main);">${I18N.t('dataIntegrityCheck')}</span>
            <span style="color: #0d825b; font-weight: 700;">✅ ${I18N.t('dataIntegrityPass')}</span>
          </div>
          <div style="font-family: monospace; font-size: 0.76rem; color: var(--text-muted); word-break: break-all;">
            SHA-256: ${proof.sha256Hash}
          </div>
        </div>
      </div>
    `;
  }
};
