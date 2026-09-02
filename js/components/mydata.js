/**
 * Akked My Data Vault & Exposure Monitor Component
 */

window.AkkedMyData = {
  render() {
    const isAr = I18N.currentLang === 'ar';
    const categories = [
      {
        id: 'cat_identity',
        name: I18N.t('categoryIdentity'),
        icon: '🪪',
        items: ['رقم الهوية الوطنية', 'الاسم الكامل', 'تاريخ الميلاد', 'الصورة الشخصية'],
        exposureLevel: 'safe',
        activeSharesCount: 1,
        descAr: 'تم حجب كافة التفاصيل وتوليد إثبات عمري مجرد فقط.',
        descEn: 'All raw PII masked; only abstract boolean age claim disclosed.'
      },
      {
        id: 'cat_financial',
        name: I18N.t('categoryFinancial'),
        icon: '💳',
        items: ['رقم الآيبان البنكي', 'تفاصيل الراتب الدقيق', 'البطاقة الائتمانية'],
        exposureLevel: 'moderate',
        activeSharesCount: 1,
        descAr: 'مشارك بنطاق مالي عام لإثبات الملاءمة دون كشف تفاصيل الحساب.',
        descEn: 'Disclosed as eligibility threshold range without exposing IBAN.'
      },
      {
        id: 'cat_residency',
        name: I18N.t('categoryResidency'),
        icon: '🏠',
        items: ['العنوان الوطني', 'عقد الإيجار السكني', 'رقم المبنى'],
        exposureLevel: 'safe',
        activeSharesCount: 0,
        descAr: 'لا توجد أي مشاركات نشطة تكشف عنوان السكن حالياً.',
        descEn: 'Zero active shares exposing your residential address.'
      },
      {
        id: 'cat_assets',
        name: I18N.t('categoryAssets'),
        icon: '💻',
        items: ['الرقم التسلسلي للجهاز', 'فواتير الشراء والضمان'],
        exposureLevel: 'safe',
        activeSharesCount: 0,
        descAr: 'المشاركة السابقة انتهت صلاحيتها ولم تعد قابلة للفحص.',
        descEn: 'Previous warranty share has expired.'
      }
    ];

    return `
      <div class="mydata-view animate-fade-in">
        <!-- Page Header & Purge Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">${I18N.t('myDataPageTitle')}</h1>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">${I18N.t('myDataPageSubtitle')}</p>
          </div>
          <button class="btn btn-outline-danger" onclick="AkkedMyData.confirmPurgeCache()">
            <span>🗑️</span>
            <span>${I18N.t('btnClearCache')}</span>
          </button>
        </div>

        <!-- Privacy Shield Guarantee Banner -->
        <div class="card" style="background: linear-gradient(135deg, rgba(80, 190, 155, 0.15) 0%, rgba(90, 24, 84, 0.08) 100%); border: 1.5px solid var(--brand-accent); margin-bottom: 28px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background-color: var(--brand-accent); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0;">
              🛡️
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.05rem; color: var(--brand-primary); margin-bottom: 2px;">
                ${I18N.t('localVaultBadge')}
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
                ${isAr ? 'منصة أكد لا تحتفظ بأي نسخ من وثائقك الأصلية على خوادم سحابية. كافة المعالجات والتقطيع البصري والتجزئة المشفرة تحدث في الذاكرة المحلية لمتصفحك فقط.' : 'Akked never retains copies of your unredacted documents on cloud servers. All OCR parsing and masking execute inside your local browser sandbox.'}
              </p>
            </div>
          </div>
        </div>

        <!-- Categories Exposure Grid -->
        <div class="grid-container grid-cols-2">
          ${categories.map(cat => `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.6rem;">${cat.icon}</span>
                    <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">${cat.name}</span>
                  </div>
                  <span class="badge ${cat.exposureLevel === 'safe' ? 'badge-active' : 'badge-warning'}">
                    ${cat.exposureLevel === 'safe' ? I18N.t('exposureSafe') : I18N.t('exposureModerate')}
                  </span>
                </div>

                <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 14px;">
                  ${isAr ? cat.descAr : cat.descEn}
                </div>

                <!-- Sub items chips -->
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${cat.items.map(it => `
                    <span style="background: var(--brand-surface-subtle); border: 1px solid var(--border-light); font-size: 0.76rem; padding: 4px 10px; border-radius: var(--radius-sm); color: var(--text-muted);">
                      🔒 ${it}
                    </span>
                  `).join('')}
                </div>
              </div>

              <div style="border-top: 1px solid var(--border-light); padding-top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
                <span>${isAr ? 'المشاركات النشطة المرتبطة:' : 'Active Shares Linked:'} <strong>${cat.activeSharesCount}</strong></span>
                <span style="color: var(--brand-accent); font-weight: 700;">100% Zero Storage</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  confirmPurgeCache() {
    const isAr = I18N.currentLang === 'ar';
    AkkedApp.openModal(`
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 3rem; margin-bottom: 14px;">🗑️</div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--status-danger); margin-bottom: 8px;">
          ${isAr ? 'مسح كافة الآثار والذاكرة المؤقتة؟' : 'Purge All Local Cache & Vault Artifacts?'}
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 24px; line-height: 1.5;">
          ${isAr ? 'سيتم حذف جميع سجلات المشاركات والإثباتات الصادرة والتنبيهات المخزنة محلياً على هذا الجهاز بالكامل (Zero-Trace Purge).' : 'This will wipe all locally stored proof records and active credentials from this browser instance.'}
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="btn btn-secondary" onclick="AkkedApp.closeModal()">${I18N.t('btnCancel')}</button>
          <button class="btn btn-primary" style="background-color: var(--status-danger);" onclick="AkkedMyData.executePurge()">
            ${isAr ? 'نعم، امسح كل شيء' : 'Yes, Purge Everything'}
          </button>
        </div>
      </div>
    `);
  },

  executePurge() {
    AkkedState.purgeAllCache();
    AkkedApp.closeModal();
    AkkedApp.showToast(I18N.t('cacheClearedToast'), 'info');
    AkkedApp.renderView();
  }
};
