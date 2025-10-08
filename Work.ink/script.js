(function() {
    'use strict';

    if (document.getElementById('hh-status-modal')) return;

    const DISCORD_URL = 'https://discord.gg/EtMvdPhmCP';
    let currentLang = (navigator.language || 'en').toLowerCase().includes('vi') ? 'vi' : 'en';
    const apiContent = {
        vi: [
            "**Hiện tại chức năng đã tạm tắt** do update hoặc gặp sự cố kỹ thuật.",
            "Chúng tôi đang tiến hành khắc phục để sớm đưa hệ thống trở lại trạng thái hoạt động bình thường.",
            "Nếu bạn muốn nhận thông báo mới nhất, hãy tham gia Discord của chúng tôi! 😊"
        ],
        en: [
            "**Currently, this feature has been temporarily disabled** due to updates or technical issues.",
            "We are working to fix the issues so the system will be back to normal operation soon.",
            "If you want to receive the latest notifications, please join our Discord! 😊"
        ]
    };

    const modal = document.createElement('div');
    modal.id = 'hh-status-modal';
    modal.innerHTML = `
      <div id="hh-modal-card">
        <header id="hh-modal-header">
          <h1 id="hh-modal-title">[Bypass Link]</h1>
          <div id="hh-lang-toggle">
            <button id="hh-lang-en" class="${currentLang === 'en' ? 'active' : ''}">EN</button>
            <button id="hh-lang-vi" class="${currentLang === 'vi' ? 'active' : ''}">VI</button>
          </div>
          <button id="hh-modal-close">×</button>
        </header>
        <main id="hh-modal-body">
          <div id="hh-line1"></div>
          <div id="hh-line2"></div>
          <div id="hh-line3"></div>
          <a id="hh-discord-btn" href="${DISCORD_URL}" target="_blank">Join our Discord</a>
        </main>
      </div>
    `;
    document.documentElement.appendChild(modal);

    GM_addStyle(`
      #hh-status-modal { position: fixed; bottom: 20px; right: 20px; width: 300px; z-index:2147483647; font-family: 'Inter', sans-serif; }
      #hh-modal-card { background: rgba(0,0,0,0.8); border-radius: 16px; color: #fff; overflow: hidden; box-shadow:0 4px 12px rgba(0,0,0,0.5); }
      #hh-modal-header { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; font-weight:bold; }
      #hh-modal-title { font-size:16px; color:#ffd700; margin:0; }
      #hh-lang-toggle { display:flex; gap:5px; }
      #hh-lang-toggle button { background: rgba(255,255,255,0.2); border:none; padding:3px 6px; border-radius:8px; color:#fff; font-size:12px; cursor:pointer; }
      #hh-lang-toggle button.active { background:#5865f2; }
      #hh-modal-close { background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }
      #hh-modal-body { padding:10px 12px; font-size:13px; line-height:1.4; }
      #hh-modal-body a#hh-discord-btn { display:block; text-align:center; margin-top:8px; padding:6px 0; background:#5865f2; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold; transition:0.3s; }
      #hh-modal-body a#hh-discord-btn:hover { background:#4752c4; }
    `);

    function renderContent(lang) {
        for (let i = 1; i <= 3; i++) {
            const el = document.getElementById(`hh-line${i}`);
            el.innerHTML = apiContent[lang][i-1]
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/\*(.*?)\*/g, '<i>$1</i>')
                .replace(/\[([^\]]*)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        }
    }

    renderContent(currentLang);

    document.getElementById('hh-lang-en').addEventListener('click', () => {
        currentLang='en';
        document.getElementById('hh-lang-en').classList.add('active');
        document.getElementById('hh-lang-vi').classList.remove('active');
        renderContent(currentLang);
    });

    document.getElementById('hh-lang-vi').addEventListener('click', () => {
        currentLang='vi';
        document.getElementById('hh-lang-vi').classList.add('active');
        document.getElementById('hh-lang-en').classList.remove('active');
        renderContent(currentLang);
    });

    document.getElementById('hh-modal-close').addEventListener('click', () => modal.remove());
})();
