(function() {
    "use strict";

    const DEBUG = false;
    const VERSION = "2.1.0";
    const WAIT_TIME = 30; // Thời gian chờ tối thiểu (giây)

    // Cache console methods
    const console = window.console;
    const oldLog = console.log;
    const oldWarn = console.warn;
    const oldError = console.error;

    function log(...args) { if (DEBUG) oldLog("[WorkInk]", ...args); }
    function warn(...args) { if (DEBUG) oldWarn("[WorkInk]", ...args); }
    function error(...args) { if (DEBUG) oldError("[WorkInk]", ...args); }

    if (DEBUG) console.clear = () => {};

    log(`🚀 Work.ink Bypass v${VERSION}`);

    // ===== Enhanced UI with Progress Circle =====
    const container = document.createElement("div");
    Object.assign(container.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "999999",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    });

    const shadow = container.attachShadow({ mode: "closed" });

    shadow.innerHTML = `
        <style>
            .bypass-card {
                background: linear-gradient(145deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
                min-width: 320px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .bypass-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
            }

            .header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .logo {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .title {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
                letter-spacing: -0.02em;
            }

            .status-container {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .progress-circle {
                position: relative;
                width: 80px;
                height: 80px;
                flex-shrink: 0;
            }

            .progress-ring {
                transform: rotate(-90deg);
            }

            .progress-ring-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.1);
                stroke-width: 6;
            }

            .progress-ring-fill {
                fill: none;
                stroke: #667eea;
                stroke-width: 6;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
            }

            .countdown-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
                font-weight: 700;
                color: #fff;
                text-align: center;
                line-height: 1;
            }

            .countdown-label {
                font-size: 10px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 4px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .status-content {
                flex: 1;
            }

            .status-text {
                color: #fff;
                font-size: 15px;
                font-weight: 500;
                margin-bottom: 8px;
                line-height: 1.4;
            }

            .status-detail {
                color: rgba(255, 255, 255, 0.6);
                font-size: 13px;
                line-height: 1.4;
            }

            .icon {
                display: inline-block;
                margin-right: 6px;
            }

            .pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .spinner {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.6s linear infinite;
                margin-right: 8px;
                vertical-align: middle;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .success-checkmark {
                display: inline-block;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #10b981;
                position: relative;
                margin-right: 8px;
                vertical-align: middle;
            }

            .success-checkmark::after {
                content: '';
                position: absolute;
                top: 3px;
                left: 6px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            /* State colors */
            .state-waiting .progress-ring-fill { stroke: #fbbf24; }
            .state-bypassing .progress-ring-fill { stroke: #f59e0b; }
            .state-redirecting .progress-ring-fill { stroke: #3b82f6; }
            .state-success .progress-ring-fill { stroke: #10b981; }
        </style>

        <div class="bypass-card state-waiting">
            <div class="header">
                <div class="logo">🔓</div>
                <div class="title">Work.ink Bypass</div>
            </div>
            <div class="status-container">
                <div class="progress-circle" style="display: none;">
                    <svg class="progress-ring" width="80" height="80">
                        <circle class="progress-ring-bg" cx="40" cy="40" r="34"/>
                        <circle class="progress-ring-fill" cx="40" cy="40" r="34"
                                stroke-dasharray="213.628" stroke-dashoffset="0"/>
                    </svg>
                    <div class="countdown-text">
                        <div class="countdown-number">--</div>
                        <div class="countdown-label">sec</div>
                    </div>
                </div>
                <div class="status-content">
                    <div class="status-text">
                        <span class="icon pulse">🔒</span>
                        <span class="status-message">Waiting for captcha</span>
                    </div>
                    <div class="status-detail">Please solve the captcha to continue</div>
                </div>
            </div>
        </div>
    `;

    document.documentElement.appendChild(container);

    const card = shadow.querySelector('.bypass-card');
    const statusText = shadow.querySelector('.status-message');
    const statusDetail = shadow.querySelector('.status-detail');
    const progressCircle = shadow.querySelector('.progress-circle');
    const countdownNumber = shadow.querySelector('.countdown-number');
    const progressRingFill = shadow.querySelector('.progress-ring-fill');
    const circleCircumference = 213.628;

    function updateUI(state, message, detail = '', showCountdown = false, progress = 0) {
        card.className = `bypass-card state-${state}`;
        
        const icons = {
            waiting: '🔒',
            bypassing: '⚡',
            redirecting: '🚀',
            success: ''
        };

        const iconHTML = state === 'success' 
            ? '<span class="success-checkmark"></span>'
            : state === 'bypassing' 
                ? '<span class="spinner"></span>'
                : `<span class="icon pulse">${icons[state]}</span>`;

        statusText.innerHTML = `${iconHTML}<span class="status-message">${message}</span>`;
        statusDetail.textContent = detail;

        progressCircle.style.display = showCountdown ? 'block' : 'none';
        
        if (showCountdown) {
            countdownNumber.textContent = Math.ceil(progress);
            const offset = circleCircumference * (1 - (progress / WAIT_TIME));
            progressRingFill.style.strokeDashoffset = offset;
        }
    }

    // ===== Name Resolution (Optimized) =====
    const NAME_MAP = {
        sendMessage: ["sendMessage", "sendMsg", "writeMessage", "writeMsg", "send"],
        onLinkInfo: ["onLinkInfo", "handleLinkInfo", "linkInfo"],
        onLinkDestination: ["onLinkDestination", "handleDestination", "destination"]
    };

    const resolveName = (obj, candidates) => {
        for (const name of candidates) {
            if (typeof obj[name] === "function") {
                log(`✓ ${name}`);
                return { fn: obj[name], name };
            }
        }
        warn(`✗ Missing:`, candidates);
        return { fn: null, name: null };
    };

    // ===== State =====
    let _sessionController, _sendMessage, _onLinkInfo, _onLinkDestination;
    const startTime = Date.now();
    let countdownInterval;

    // ===== Packet Types =====
    const PKT = {
        MONETIZATION: "c_monetization",
        SOCIAL_STARTED: "c_social_started",
        TURNSTILE_RESPONSE: "c_turnstile_response",
        ADBLOCKER_DETECTED: "c_adblocker_detected",
        PING: "c_ping"
    };

    // ===== Monetization Handlers (Optimized) =====
    const monetizationHandlers = {
        22: (send) => { // readArticles2
            send(PKT.MONETIZATION, { type: "readArticles2", payload: { event: "read" }});
        },
        25: (send) => { // operaGX
            send(PKT.MONETIZATION, { type: "operaGX", payload: { event: "start" }});
            send(PKT.MONETIZATION, { type: "operaGX", payload: { event: "installClicked" }});
            fetch('https://work.ink/_api/v2/callback/operaGX', {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteligible: true })
            }).catch(() => {});
        },
        34: (send) => { // norton
            send(PKT.MONETIZATION, { type: "norton", payload: { event: "start" }});
            send(PKT.MONETIZATION, { type: "norton", payload: { event: "installClicked" }});
        },
        71: (send) => { // externalArticles
            send(PKT.MONETIZATION, { type: "externalArticles", payload: { event: "start" }});
            send(PKT.MONETIZATION, { type: "externalArticles", payload: { event: "installClicked" }});
        },
        45: (send) => { // pdfeditor
            send(PKT.MONETIZATION, { type: "pdfeditor", payload: { event: "installed" }});
        },
        57: (send) => { // betterdeals
            send(PKT.MONETIZATION, { type: "betterdeals", payload: { event: "installed" }});
        }
    };

    // ===== Send Message Proxy =====
    function createSendMessageProxy() {
        return function(...args) {
            const [type, data] = args;

            if (type !== PKT.PING) log("📤", type, data);

            // Block adblock detection
            if (type === PKT.ADBLOCKER_DETECTED) {
                warn("🛡️ Blocked adblock detection");
                return;
            }

            // Main bypass logic
            if (_sessionController.linkInfo && type === PKT.TURNSTILE_RESPONSE) {
                const ret = _sendMessage.apply(this, args);
                
                updateUI('bypassing', 'Bypassing restrictions', 'Processing monetization layers...', false);
                log("🔓 Bypass started");

                // Send socials
                _sessionController.linkInfo.socials?.forEach(s => {
                    _sendMessage.call(this, PKT.SOCIAL_STARTED, { url: s.url });
                });

                // Send monetizations
                _sessionController.linkInfo.monetizations?.forEach(m => {
                    const handler = monetizationHandlers[m];
                    if (handler) {
                        handler((type, data) => _sendMessage.call(this, type, data));
                        log(`✓ Bypassed: ${m}`);
                    } else {
                        warn(`⚠️ Unknown: ${m}`);
                    }
                });

                log("✅ Bypass complete");
                return ret;
            }

            return _sendMessage.apply(this, args);
        };
    }

    // ===== Link Info Proxy =====
    function createOnLinkInfoProxy() {
        return function(...args) {
            const linkInfo = args[0];
            log("📋 Link info");

            Object.defineProperty(linkInfo, "isAdblockEnabled", {
                get: () => false,
                set: () => {},
                configurable: false,
                enumerable: true
            });

            return _onLinkInfo.apply(this, args);
        };
    }

    // ===== Countdown & Redirect =====
    function startCountdown(url, remainingTime) {
        updateUI('redirecting', 'Destination found!', 'Redirecting to your link...', true, remainingTime);
        
        const startCountdownTime = Date.now();
        
        countdownInterval = setInterval(() => {
            const elapsed = (Date.now() - startCountdownTime) / 1000;
            const remaining = Math.max(0, remainingTime - elapsed);
            
            if (remaining > 0) {
                updateUI('redirecting', 'Destination found!', 'Redirecting to your link...', true, remaining);
            } else {
                clearInterval(countdownInterval);
                redirect(url);
            }
        }, 50); // Update every 50ms for smooth animation
    }

    function redirect(url) {
        updateUI('success', 'Redirecting now!', 'Taking you to your destination...', false);
        log("🚀 Redirecting:", url);
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // ===== Destination Proxy =====
    function createOnLinkDestinationProxy() {
        return function(...args) {
            const payload = args[0];
            log("🎯 Destination:", payload.url);

            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, WAIT_TIME - elapsed);

            if (remaining <= 0) {
                redirect(payload.url);
            } else {
                startCountdown(payload.url, remaining);
            }

            return _onLinkDestination.apply(this, args);
        };
    }

    // ===== Setup Proxies =====
    function setupSessionControllerProxy() {
        const sm = resolveName(_sessionController, NAME_MAP.sendMessage);
        const li = resolveName(_sessionController, NAME_MAP.onLinkInfo);
        const ld = resolveName(_sessionController, NAME_MAP.onLinkDestination);

        if (!sm.fn || !li.fn || !ld.fn) {
            error("❌ Setup failed");
            return;
        }

        _sendMessage = sm.fn;
        _onLinkInfo = li.fn;
        _onLinkDestination = ld.fn;

        const smProxy = createSendMessageProxy();
        const liProxy = createOnLinkInfoProxy();
        const ldProxy = createOnLinkDestinationProxy();

        Object.defineProperty(_sessionController, sm.name, {
            get: () => smProxy,
            set: (v) => { _sendMessage = v; },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(_sessionController, li.name, {
            get: () => liProxy,
            set: (v) => { _onLinkInfo = v; },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(_sessionController, ld.name, {
            get: () => ldProxy,
            set: (v) => { _onLinkDestination = v; },
            configurable: false,
            enumerable: true
        });

        log(`✅ Proxies: ${sm.name}, ${li.name}, ${ld.name}`);
    }

    // ===== Session Controller Detection =====
    const checkForSessionController = (target, prop, value, receiver) => {
        if (value && typeof value === "object" &&
            resolveName(value, NAME_MAP.sendMessage).fn &&
            resolveName(value, NAME_MAP.onLinkInfo).fn &&
            resolveName(value, NAME_MAP.onLinkDestination).fn &&
            !_sessionController) {
            
            _sessionController = value;
            log("🎯 Session controller found");
            setupSessionControllerProxy();
        }
        return Reflect.set(target, prop, value, receiver);
    };

    // ===== SvelteKit Interception =====
    const createComponentProxy = (component) => new Proxy(component, {
        construct(target, args) {
            const result = Reflect.construct(target, args);
            if (result.$$ && result.$$.ctx) {
                result.$$.ctx = new Proxy(result.$$.ctx, {
                    set: checkForSessionController
                });
            }
            return result;
        }
    });

    const createNodeResultProxy = (result) => new Proxy(result, {
        get(target, prop, receiver) {
            return prop === "component" ? createComponentProxy(target.component) : Reflect.get(target, prop, receiver);
        }
    });

    const createNodeProxy = (oldNode) => async (...args) => createNodeResultProxy(await oldNode(...args));

    const createKitProxy = (kit) => {
        if (typeof kit !== "object" || !kit || !kit.start) return [false, kit];

        return [true, new Proxy(kit, {
            get(target, prop, receiver) {
                if (prop === "start") {
                    return function(...args) {
                        const [appModule, , options] = args;
                        if (appModule?.nodes && options?.node_ids) {
                            const oldNode = appModule.nodes[options.node_ids[1]];
                            if (oldNode) appModule.nodes[options.node_ids[1]] = createNodeProxy(oldNode);
                        }
                        return kit.start.apply(this, args);
                    };
                }
                return Reflect.get(target, prop, receiver);
            }
        })];
    };

    function setupSvelteKitInterception() {
        const originalPromiseAll = Promise.all;
        let intercepted = false;

        Promise.all = async function(promises) {
            const result = originalPromiseAll.call(this, promises);

            if (!intercepted) {
                intercepted = true;
                return new Promise((resolve) => {
                    result.then(([kit, app, ...args]) => {
                        const [success, wrappedKit] = createKitProxy(kit);
                        if (success) {
                            Promise.all = originalPromiseAll;
                            log("✅ Interception complete");
                        }
                        resolve([wrappedKit, app, ...args]);
                    }).catch(() => resolve(result));
                });
            }
            return result;
        };
    }

    // ===== Ad Removal (Optimized) =====
    const AD_SELECTORS = [".adsbygoogle", "[class*='ad-']", "[id*='google_ads']", "ins.adsbygoogle"];

    new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    AD_SELECTORS.forEach(selector => {
                        if (node.matches?.(selector)) {
                            node.remove();
                            log("🗑️ Ad removed");
                        }
                        node.querySelectorAll?.(selector).forEach(el => {
                            el.remove();
                            log("🗑️ Nested ad removed");
                        });
                    });
                }
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true });

    // ===== Initialize =====
    setupSvelteKitInterception();
    log("✅ Initialized");
})();
