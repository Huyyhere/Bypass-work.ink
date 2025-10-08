
(function() {
    "use strict";
    function initGUI() {
        if (document.getElementById("hh-corner-notice")) return;
        const DISCORD_URL = "https://discord.gg/EtMvdPhmCP";
        let currentLang = (navigator.language || "en").toLowerCase().includes("vi") ? "vi" : "en";
        const apiContent = {
            vi: [
                "**Hiện tại chức năng đã tạm tắt** do update hoặc gặp sự cố kỹ thuật.",
                "Chúng tôi đang khắc phục để sớm đưa hệ thống trở lại trạng thái hoạt động bình thường.",
                "Nếu bạn muốn nhận thông báo mới nhất, hãy tham gia Discord của chúng tôi! 😊"
            ],
            en: [
                "**Currently, this feature has been temporarily disabled** due to updates or technical issues.",
                "We are working to fix the issues so the system will be back to normal operation soon.",
                "Join Our Discord to get the latest notifications! 😊😊"
            ]
        };
        const notice = document.createElement("div");
        notice.id = "hh-corner-notice";
        notice.innerHTML = `
            <div id="hh-corner-card">
                <header id="hh-corner-header">
                    <span id="hh-corner-title">Notice</span>
                    <div id="hh-lang-toggle">
                        <button id="hh-lang-en" class="${currentLang==='en'?'active':''}">EN</button>
                        <button id="hh-lang-vi" class="${currentLang==='vi'?'active':''}">VI</button>
                    </div>
                    <button id="hh-corner-close">×</button>
                </header>
                <main id="hh-corner-body">
                    <div id="hh-line1" class="line"></div>
                    <div id="hh-line2" class="line"></div>
                    <div id="hh-line3" class="line"></div>
                    <a id="hh-discord-btn" href="${DISCORD_URL}" target="_blank">Join Our Discord</a>
                </main>
            </div>
        `;
        document.body.appendChild(notice);
        GM_addStyle(`
            #hh-corner-notice {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999999;
                font-family: system-ui, sans-serif;
                cursor: grab;
                width: 350px;
            }
            #hh-corner-card {
                background: linear-gradient(145deg, #1f1f1f, #2a2a2a);
                border-radius: 18px;
                border: 1px solid rgba(255,255,255,0.1);
                box-shadow: 0 8px 30px rgba(0,0,0,0.7);
                overflow:hidden;
                animation: slideIn 0.4s ease-out;
                color: #eee;
            }
            #hh-corner-header {
                display:flex; justify-content:space-between; align-items:center;
                padding:16px 20px; background: rgba(0,0,0,0.3);
            }
            #hh-corner-title { font-weight:700; font-size:18px; color:#ffd700; }
            #hh-lang-toggle { display:flex; gap:6px; }
            #hh-lang-toggle button { background: rgba(255,255,255,0.1); border:none; border-radius:10px; padding:6px 10px; color:#fff; cursor:pointer; font-weight:600; font-size:13px; }
            #hh-lang-toggle button.active { background:#5865f2; }
            #hh-corner-close { background: rgba(255,255,255,0.1); border:none; width:32px; height:32px; border-radius:50%; font-weight:bold; cursor:pointer; color:#fff; font-size:18px; }
            #hh-corner-body { padding:16px 20px; font-size:15px; line-height:1.6; min-height:100px; }
            #hh-corner-body .line { margin-bottom:6px; }
            #hh-discord-btn {
                display:block; text-align:center; margin-top:12px; padding:10px 0;
                background:#fff; color:#1f1f1f; border-radius:10px; font-weight:700; font-size:14px; text-decoration:none;
                transition: all 0.3s ease;
            }
            #hh-discord-btn:hover { background:#e5e5e5; }
            @keyframes slideIn { from{opacity:0; transform:translateX(100%);} to{opacity:1; transform:translateX(0);} }
        `);
        function renderContent(lang){
            for(let i=1;i<=3;i++){
                const el=document.getElementById(`hh-line${i}`);
                el.innerHTML = apiContent[lang][i-1]
                    .replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
                    .replace(/\*(.*?)\*/g,"<i>$1</i>")
                    .replace(/\[([^\]]*)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>');
            }
        }
        renderContent(currentLang);
        document.getElementById("hh-lang-en").addEventListener("click",()=>{
            currentLang="en";
            document.getElementById("hh-lang-en").classList.add("active");
            document.getElementById("hh-lang-vi").classList.remove("active");
            renderContent(currentLang);
        });
        document.getElementById("hh-lang-vi").addEventListener("click",()=>{
            currentLang="vi";
            document.getElementById("hh-lang-vi").classList.add("active");
            document.getElementById("hh-lang-en").classList.remove("active");
            renderContent(currentLang);
        });
        document.getElementById("hh-corner-close").addEventListener("click",()=>notice.remove());
        let isDragging=false, offsetX=0, offsetY=0;
        notice.addEventListener("mousedown", e=>{
            isDragging=true;
            offsetX=e.clientX-notice.getBoundingClientRect().left;
            offsetY=e.clientY-notice.getBoundingClientRect().top;
            notice.style.cursor="grabbing";
        });
        document.addEventListener("mousemove", e=>{
            if(isDragging){
                notice.style.top=(e.clientY-offsetY)+"px";
                notice.style.left=(e.clientX-offsetX)+"px";
                notice.style.right="auto";
            }
        });
        document.addEventListener("mouseup", ()=>{ isDragging=false; notice.style.cursor="grab"; });
    }
    if (document.readyState !== "loading") {
        initGUI();
    } else {
        window.addEventListener("DOMContentLoaded", initGUI);
    }
})();
