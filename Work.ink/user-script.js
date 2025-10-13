// ==UserScript==
// @name         Bypass Work.ink
// @namespace    https://github.com/Huyyhere/Bypass-link
// @version      2.0.2
// @description  Auto bypass Work.ink.
// @author       huyyhere
// @icon         https://cdn-media.sforum.vn/storage/app/media/anhthem/meme-tinh-yeu-61.jpg
// @match        https://work.ink/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=work.ink
// @run-at       document-start
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/Huyyhere/Bypass-link/refs/heads/main/Work.ink/script.js
// @downloadURL  https://raw.githubusercontent.com/Huyyhere/Bypass-link/refs/heads/main/Work.ink/script.js
// @require      https://raw.githubusercontent.com/Huyyhere/Bypass-link/refs/heads/main/Work.ink/script.js
// ==/UserScript==
(function() {
'use strict';
const version = "2.0.2";
const storageKey = 'autoBypassSettings';
let settings = JSON.parse(localStorage.getItem(storageKey)) || { redirectTime: 20 };
const mode = {
    wait: () => Math.floor(Math.random() * 16) + 15,
    retry: 600,
    redirect: 500,
    interval: 500
};
const container = document.createElement('div');
container.style.cssText = 'position:fixed;top:12px;right:12px;z-index:999999';
const shadow = container.attachShadow({ mode: 'closed' });
const css = document.createElement('style');
css.textContent = `
@keyframes slideIn{0%{transform:scale(0.95);opacity:0}100%{transform:scale(1);opacity:1}}
*{margin:0;padding:0;box-sizing:border-box}
.panel{background:linear-gradient(135deg,#1e1e3a,#2c2c54);border-radius:20px;padding:12px 16px;width:320px;max-width:90vw;font-family:"Inter","Segoe UI",Arial,sans-serif;color:#f3f4f6;animation:slideIn .25s ease-out;box-shadow:0 8px 20px rgba(0,0,0,.2);transition:transform .12s ease-in-out}
.header{font-size:16px;font-weight:800;margin-bottom:8px;color:#60a5fa;display:flex;align-items:center;justify-content:space-between}
.versionBadge{font-size:11px;padding:4px 8px;background:#3b3b5e;border-radius:6px;font-weight:600}
.statusContainer{font-size:13px;text-align:center;color:#a1b2c8;margin-bottom:8px}
.settingsButton{cursor:pointer;font-size:16px;color:#a1b2c8}
.settingsPanel{display:none;background:#2c2c54;padding:10px;border-radius:10px;margin-top:10px}
.settingsPanel.show{display:block}
.settingsLabel{font-size:13px;color:#cbd5e1;margin-bottom:6px;display:block}
.settingsSlider{width:100%;margin-bottom:8px}
.settingsValue{font-size:13px;color:#f3f4f6;text-align:center;margin-bottom:6px}
.footer{font-size:12px;text-align:center;color:#b0b8cc;border-top:1px solid #3b3b5e;padding-top:8px;margin-top:8px}
.footer a{color:#22d3ee;text-decoration:underline}
`;
shadow.appendChild(css);
const content = document.createElement('div');
content.className = 'panel';
content.innerHTML = `
<div class="header"><div style="display:flex;align-items:center;gap:8px"><span>Auto-Bypass Work.ink</span><span class="versionBadge">v${version}</span></div><span class="settingsButton" id="settingsBtn">⚙️</span></div>
<div class="statusContainer" id="statusText">🔐 Please Solve Captcha to Proceed</div>
<div class="settingsPanel" id="settingsPanel">
  <label class="settingsLabel">Redirect Time (seconds):</label>
  <input type="range" class="settingsSlider" id="redirectTimeSlider" min="5" max="120" value="${settings.redirectTime}">
  <div class="settingsValue" id="redirectTimeValue">${settings.redirectTime}</div>
</div>
<div class="footer"><a href="https://discord.gg/EtMvdPhmCP" target="_blank">Join Our Discord</a></div>`;
shadow.appendChild(content);
document.documentElement.appendChild(container);
const ui = {
    statusText: shadow.getElementById('statusText'),
    settingsPanel: shadow.getElementById('settingsPanel'),
    redirectTimeSlider: shadow.getElementById('redirectTimeSlider'),
    redirectTimeValue: shadow.getElementById('redirectTimeValue'),
    updateStatus(text) { this.statusText.textContent = text; },
    showLink(url, redirectSeconds = settings.redirectTime) {
        safeClear(window.AutoBypass._redirectInterval);
        safeClear(window.AutoBypass._redirectTimeout);
        let remaining = Math.max(0, Math.floor(redirectSeconds));
        this.updateStatus(`✅ Bypass Successful! Redirecting in ${remaining}s`);
        const tick = () => {
            remaining -= 1;
            if (remaining > 0) this.updateStatus(`✅ Bypass Successful! Redirecting in ${remaining}s`);
            if (remaining <= 0) window.AutoBypass._doRedirect(url);
        };
        window.AutoBypass._redirectInterval = setInterval(tick, 1000);
        window.AutoBypass._redirectTimeout = setTimeout(() => window.AutoBypass._doRedirect(url), (remaining) * 1000);
    },
    toggleSettings() { this.settingsPanel.classList.toggle('show'); }
};
function safeClear(id) {
    try { clearInterval(id); } catch(e){}
    try { clearTimeout(id); } catch(e){}
}
window.AutoBypass = window.AutoBypass || {};
window.AutoBypass._doRedirect = function(url) {
    safeClear(window.AutoBypass._redirectInterval);
    safeClear(window.AutoBypass._redirectTimeout);
    try { window.location.href = url; } catch(e){ window.open(url, '_blank'); }
};
window.AutoBypass._cancelRedirect = function() {
    safeClear(window.AutoBypass._redirectInterval);
    safeClear(window.AutoBypass._redirectTimeout);
    ui.updateStatus('Redirect cancelled');
};
window.AutoBypass.showLink = function(url, redirectSeconds) {
    ui.showLink(url, typeof redirectSeconds === 'number' ? redirectSeconds : settings.redirectTime);
};
window.AutoBypass.setRedirectTime = function(sec) {
    settings.redirectTime = Math.max(1, Math.floor(sec));
    persistSettings();
    ui.redirectTimeValue.textContent = settings.redirectTime;
    ui.redirectTimeSlider.value = settings.redirectTime;
};
window.AutoBypass.cancelRedirect = function() {
    window.AutoBypass._cancelRedirect();
};

function persistSettings() {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch(e){}
}
ui.redirectTimeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value, 10) || settings.redirectTime;
    settings.redirectTime = Math.max(1, value);
    ui.redirectTimeValue.textContent = settings.redirectTime;
    persistSettings();
});
shadow.getElementById('settingsBtn').addEventListener('click', () => ui.toggleSettings());
ui.redirectTimeValue.textContent = settings.redirectTime;
const methodMap = {
    sendMethods: ["sendMessage", "sendMsg", "writeMessage", "writeMsg", "writMessage"],
    linkInfoMethods: ["onLinkInfo"],
    linkDestMethods: ["onLinkDestination"]
};
const findMethod = (obj, methods) => {
    for (const name of methods) if (typeof obj[name] === 'function') return { fn: obj[name], name };
    return { fn: null, name: null };
};
let controller, sendMessageFunc, linkInfoFunc, linkDestFunc;
const messageTypes = () => ({
    monetization: 'c_monetization',
    socialStarted: 'c_social_started',
    turnstileResponse: 'c_turnstile_response',
    adblockDetected: 'c_adblocker_detected'
});
const startTime = Date.now();
function wrapSendMessage() {
    const types = messageTypes();
    return function(...args) {
        const [messageType] = args;
        if (messageType === types.adblockDetected) return;
        if (controller?.linkInfo && messageType === types.turnstileResponse) {
            ui.updateStatus('🔓 Captcha Solved, Bypassing...');
            for (const social of controller.linkInfo.socials) {
                sendMessageFunc.call(this, types.socialStarted, { url: social.url });
            }
            for (const key in controller.linkInfo.monetizations) {
                const monetizationType = controller.linkInfo.monetizations[key];
                switch (monetizationType) {
                    case 22:
                        sendMessageFunc.call(this, types.monetization, { type: 'readArticles2', payload: { event: 'read' } });
                        break;
                    case 25:
                        sendMessageFunc.call(this, types.monetization, { type: 'operaGX', payload: { event: 'start' } });
                        sendMessageFunc.call(this, types.monetization, { type: 'operaGX', payload: { event: 'installClicked' } });
                        fetch('https://work.ink/_api/v2/callback/operaGX', {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ noteligible: true })
                        }).catch(() => {});
                        break;
                    case 34:
                        sendMessageFunc.call(this, types.monetization, { type: 'norton', payload: { event: 'start' } });
                        sendMessageFunc.call(this, types.monetization, { type: 'norton', payload: { event: 'installClicked' } });
                        break;
                    case 71:
                        sendMessageFunc.call(this, types.monetization, { type: 'externalArticles', payload: { event: 'start' } });
                        sendMessageFunc.call(this, types.monetization, { type: 'externalArticles', payload: { event: 'installClicked' } });
                        break;
                    case 45:
                        sendMessageFunc.call(this, types.monetization, { type: 'pdfeditor', payload: { event: 'installed' } });
                        break;
                    case 57:
                        sendMessageFunc.call(this, types.monetization, { type: 'betterdeals', payload: { event: 'installed' } });
                        break;
                }
            }
            return sendMessageFunc.apply(this, args);
        }
        return sendMessageFunc.apply(this, args);
    };
}
function wrapLinkInfo() {
    return function(...args) {
        const [info] = args;
        Object.defineProperty(info, 'isAdblockEnabled', {
            get: () => false,
            set: () => {},
            configurable: false,
            enumerable: true
        });
        return linkInfoFunc.apply(this, args);
    };
}
function countdown(url, seconds) {
    let remaining = Math.ceil(seconds);
    ui.updateStatus(`⏳ Waiting ${remaining} seconds...`);
    const intervalId = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
            ui.updateStatus(`⏳ Waiting ${remaining} seconds...`);
        } else {
            clearInterval(intervalId);
            ui.showLink(url);
        }
    }, mode.interval);
}
function wrapLinkDestination() {
    return function(...args) {
        const [destination] = args;
        const waitTime = mode.wait();
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= waitTime) {
            ui.showLink(destination.url);
        } else {
            countdown(destination.url, waitTime - elapsed);
        }
        return linkDestFunc.apply(this, args);
    };
}

function installHooks() {
    const sendMethod = findMethod(controller, methodMap.sendMethods);
    const linkInfoMethod = findMethod(controller, methodMap.linkInfoMethods);
    const linkDestMethod = findMethod(controller, methodMap.linkDestMethods);

    if (!sendMethod.fn || !linkInfoMethod.fn || !linkDestMethod.fn) return;

    sendMessageFunc = sendMethod.fn;
    linkInfoFunc = linkInfoMethod.fn;
    linkDestFunc = linkDestMethod.fn;

    Object.defineProperty(controller, sendMethod.name, {
        get: () => wrapSendMessage(),
        set: value => { sendMessageFunc = value; },
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(controller, linkInfoMethod.name, {
        get: () => wrapLinkInfo(),
        set: value => { linkInfoFunc = value; },
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(controller, linkDestMethod.name, {
        get: () => wrapLinkDestination(),
        set: value => { linkDestFunc = value; },
        configurable: false,
        enumerable: true
    });}
function handleContextSet(target, property, value, receiver) {
    if (value && typeof value === 'object' &&
        findMethod(value, methodMap.sendMethods).fn &&
        findMethod(value, methodMap.linkInfoMethods).fn &&
        findMethod(value, methodMap.linkDestMethods).fn &&
        !controller) {
        controller = value;
        installHooks();
    }
    return Reflect.set(target, property, value, receiver);}
function wrapComponent(component) {
    return new Proxy(component, {
        construct(target, args) {
            const instance = Reflect.construct(target, args);
            if (instance.$$.ctx) {
                instance.$$.ctx = new Proxy(instance.$$.ctx, { set: handleContextSet });
            }
            return instance;
        }
    });}
function wrapNodeFunction(nodeFunction) {
    return async (...args) => {
        const result = await nodeFunction(...args);
        return new Proxy(result, {
            get(target, property, receiver) {
                return property === 'component' ? wrapComponent(target.component) : Reflect.get(target, property, receiver);
            }
        });
    };}
function wrapSvelteKit(kit) {
    if (typeof kit !== 'object' || !kit || !kit.start) return [false, kit];
    const wrappedKit = new Proxy(kit, {
        get(target, property, receiver) {
            if (property === 'start') {
                return function(...args) {
                    const [nodes, , options] = args;
                    if (typeof nodes === 'object' && typeof nodes.nodes === 'object' &&
                        typeof options === 'object' && typeof options.node_ids === 'object') {
                        const nodeIndex = options.node_ids[1];
                        if (nodes.nodes[nodeIndex]) {
                            nodes.nodes[nodeIndex] = wrapNodeFunction(nodes.nodes[nodeIndex]);
                        }
                    }
                    return kit.start.apply(this, args);
                };
            }
            return Reflect.get(target, property, receiver);
        }
    });
    return [true, wrappedKit];}
function interceptPromise() {
    const originalPromiseAll = Promise.all;
    let flag = false;
    Promise.all = async function(promises) {
        const result = originalPromiseAll.call(this, promises);
        if (!flag) {
            flag = true;
            return await new Promise(resolve => {
                result.then(([kit, obj, ...rest]) => {
                    const [wrapped, wrappedKit] = wrapSvelteKit(kit);
                    if (wrapped) Promise.all = originalPromiseAll;
                    resolve([wrappedKit, obj, ...rest]);
                }).catch(() => originalPromiseAll.call(this, promises));
            });
        }
        return await result;
    };
}
interceptPromise();
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
                if (node.classList?.contains('adsbygoogle') ||
                    node.id === 'container-4a25032' ||
                    node.id === 'ad-container') {
                    node.remove();
                }
                node.querySelectorAll?.('.adsbygoogle, #container-4a25032, #ad-container').forEach(ad => ad.remove());
            }
        }
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true });
const navigatorProperties = {
    webdriver: undefined,
    plugins: [1, 2, 3, 4, 5],
    languages: ['en-US', 'en'],
    hardwareConcurrency: 8,
    deviceMemory: 8,
    maxTouchPoints: 0,
    permissions: { query: () => Promise.resolve({ state: 'prompt' }) }};
Object.keys(navigatorProperties).forEach(key => {
    Object.defineProperty(navigator, key, {
        get: () => navigatorProperties[key],
        configurable: true
    });
});
delete navigator.__proto__.webdriver;
window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {}, app: {} };
window.navigator.chrome = window.chrome;
const originalUserAgent = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent');
Object.defineProperty(navigator, 'userAgent', {
    get() {
        return originalUserAgent.get.call(this)
            .replace(/HeadlessChrome/g, 'Chrome')
            .replace(/Automation/g, '');
    },
    configurable: true});
const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function(param) {
    if (param === 37445) return 'Intel Inc.';
    if (param === 37446) return 'Intel Iris OpenGL Engine';
    return originalGetParameter.call(this, param);};
const originalToString = Function.prototype.toString;
Function.prototype.toString = function() {
    if (this === wrapSendMessage || this === wrapLinkInfo || this === wrapLinkDestination) {
        return 'function() { [native code] }';}
    return originalToString.call(this);};
Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
})();
