(function() {
    'use strict';

    if (document.getElementById('hh-status-modal')) return;

    const DISCORD_URL = 'https://discord.gg/EtMvdPhmCP';
    const DISCORD_ICON = 'https://cdn-icons-png.flaticon.com/512/2111/2111370.png';
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
      <div id="hh-modal-backdrop">
        <div id="hh-modal-card">
          <header id="hh-modal-header">
            <h1 id="hh-modal-title">[Bypass Link] Notice</h1>
            <div id="hh-lang-toggle">
              <button id="hh-lang-en" class="${currentLang === 'en' ? 'active' : ''}">EN</button>
              <button id="hh-lang-vi" class="${currentLang === 'vi' ? 'active' : ''}">VI</button>
            </div>
            <button id="hh-modal-close" title="Close">×</button>
          </header>
          <main id="hh-modal-body">
            <div id="hh-line1"></div>
            <div id="hh-line2"></div>
            <div id="hh-line3"></div>
            <a id="hh-discord-btn" href="${DISCORD_URL}" target="_blank">
              <img src="${DISCORD_ICON}" alt="Discord Icon">
            </a>
          </main>
        </div>
      </div>
    `;
    document.documentElement.appendChild(modal);

    GM_addStyle(`
      #hh-modal-backdrop {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(8px);
        z-index: 2147483647;
        -webkit-font-smoothing: antialiased;
        animation: fadeIn 0.5s ease;
      }
      #hh-modal-card {
        width: 85vw;
        max-width: 640px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.25);
        overflow: hidden;
        animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      #hh-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 20px 24px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      }
      #hh-modal-title {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 26px;
        font-weight: 800;
        color: #ffd700;
        line-height: 1.3;
        margin: 0;
      }
      #hh-lang-toggle {
        display: flex;
        gap: 8px;
      }
      #hh-lang-toggle button {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        padding: 6px 12px;
        border-radius: 12px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      #hh-lang-toggle button.active {
        background: #5865f2;
        color: #fff;
      }
      #hh-lang-toggle button:hover {
        background: #7289da;
        transform: translateY(-1px);
      }
      #hh-modal-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      #hh-modal-close:hover {
        background: rgba(255, 255, 255, 0.4);
        color: #ff4757;
        transform: rotate(90deg);
      }
      #hh-modal-body {
        padding: 24px 28px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 16px;
        line-height: 1.8;
        text-align: justify;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      #hh-modal-body a#hh-discord-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px auto 0;
        background: none;
        transition: all 0.3s ease;
      }
      #hh-modal-body a#hh-discord-btn img {
        width: 40px;
        height: 40px;
        display: block;
        margin: auto;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
      #hh-modal-body a#hh-discord-btn:hover img {
        transform: scale(1.1);
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes scaleOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
      @media (max-width: 520px) {
        #hh-modal-card {
          width: 92vw;
          border-radius: 16px;
        }
        #hh-modal-header {
          font-size: 16px;
          padding: 16px 20px;
        }
        #hh-modal-title {
          font-size: 22px;
        }
        #hh-modal-body {
          font-size: 14px;
          padding: 20px 24px;
        }
        #hh-modal-body a#hh-discord-btn img {
          width: 36px;
          height: 36px;
        }
        #hh-lang-toggle button {
          padding: 5px 10px;
          font-size: 12px;
        }
      }
    `);
    function renderContent(lang) {
        for (let i = 1; i <= 3; i++) {
            const el = document.getElementById(`hh-line${i}`);
            el.innerHTML = apiContent[lang][i - 1]
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/\*(.*?)\*/g, '<i>$1</i>')
                .replace(/\[([^\]]*)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        }
    }
    renderContent(currentLang);
    document.getElementById('hh-lang-en').addEventListener('click', () => {
        currentLang = 'en';
        document.getElementById('hh-lang-en').classList.add('active');
        document.getElementById('hh-lang-vi').classList.remove('active');
        renderContent(currentLang);
    });
    document.getElementById('hh-lang-vi').addEventListener('click', () => {
        currentLang = 'vi';
        document.getElementById('hh-lang-vi').classList.add('active');
        document.getElementById('hh-lang-en').classList.remove('active');
        renderContent(currentLang);
    });
    document.getElementById('hh-modal-close').addEventListener('click', () => {
        modal.style.animation = 'scaleOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
})();
