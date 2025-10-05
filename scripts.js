(function() {
    "use strict";

    const DEBUG = false;

    const oldLog = unsafeWindow.console.log;
    const oldWarn = unsafeWindow.console.warn;
    const oldError = unsafeWindow.console.error;

    function log(...args) { if (DEBUG) oldLog("[UnShortener Pro]", ...args); }
    function warn(...args) { if (DEBUG) oldWarn("[UnShortener Pro]", ...args); }
    function error(...args) { if (DEBUG) oldError("[UnShortener Pro]", ...args); }

    if (DEBUG) unsafeWindow.console.clear = function() {};

    // ===== ENHANCED GUI SYSTEM =====
    const container = unsafeWindow.document.createElement("div");
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    const shadow = container.attachShadow({ mode: "closed" });

    // Add styles
    const style = unsafeWindow.document.createElement("style");
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
        }

        .gui-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 20px;
            min-width: 320px;
            max-width: 380px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideIn 0.5s ease-out;
            color: white;
        }

        .gui-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid rgba(255,255,255,0.2);
        }

        .gui-title {
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gui-logo {
            font-size: 24px;
            animation: pulse 2s ease-in-out infinite;
        }

        .gui-status {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
        }

        .status-text {
            font-size: 15px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-icon {
            font-size: 20px;
        }

        .spinner {
            display: inline-block;
            animation: spin 1s linear infinite;
        }

        .progress-container {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
            margin-top: 12px;
        }

        .progress-bar {
            background: linear-gradient(90deg, #00f260, #0575e6);
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
        }

        .progress-bar.animated {
            animation: progressBar 30s linear;
        }

        .gui-info {
            background: rgba(255,255,255,0.1);
            padding: 12px;
            border-radius: 10px;
            font-size: 13px;
            margin-bottom: 12px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
        }

        .info-label {
            opacity: 0.8;
        }

        .info-value {
            font-weight: bold;
        }

        .gui-footer {
            text-align: center;
            padding-top: 12px;
            border-top: 2px solid rgba(255,255,255,0.2);
            font-size: 12px;
        }

        .credit-text {
            margin: 4px 0;
            opacity: 0.9;
        }

        .discord-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #5865F2;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .discord-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(88,101,242,0.4);
        }

        .success-checkmark {
            font-size: 48px;
            text-align: center;
            margin: 12px 0;
            animation: pulse 1s ease-in-out;
        }

        .countdown-number {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin: 12px 0;
        }
    `;
    shadow.appendChild(style);

    // Create GUI
    const gui = unsafeWindow.document.createElement("div");
    gui.className = "gui-container";
    gui.innerHTML = `
        <div class="gui-header">
            <div class="gui-title">
                <span class="gui-logo">🚀</span>
                <span>UnShortener Pro</span>
            </div>
            <div style="font-size: 12px; opacity: 0.8;">v2.0</div>
        </div>
        <div class="gui-status">
            <div class="status-text">
                <span class="status-icon">🔒</span>
                <span id="status-message">Please solve the captcha</span>
            </div>
            <div class="progress-container" id="progress-container" style="display: none;">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
        </div>
        <div class="gui-info" id="info-panel" style="display: none;">
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value" id="info-status">Waiting</span>
            </div>
            <div class="info-row">
                <span class="info-label">Socials bypassed:</span>
                <span class="info-value" id="info-socials">0</span>
            </div>
            <div class="info-row">
                <span class="info-label">Monetizations:</span>
                <span class="info-value" id="info-monetizations">0</span>
            </div>
        </div>
        <div class="gui-footer">
            <div class="credit-text">✨ Made by <strong>Huyyhere</strong></div>
            <a href="https://discord.gg/WxFMRXNUuC" target="_blank" class="discord-link">
                <svg width="20" height="20" viewBox="0 0 71 55" fill="none">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                </svg>
                Join Discord Server
            </a>
        </div>
    `;

    shadow.appendChild(gui);
    unsafeWindow.document.documentElement.appendChild(container);

    // GUI Helper functions
    const statusMessage = shadow.getElementById("status-message");
    const progressContainer = shadow.getElementById("progress-container");
    const progressBar = shadow.getElementById("progress-bar");
    const infoPanel = shadow.getElementById("info-panel");
    const infoStatus = shadow.getElementById("info-status");
    const infoSocials = shadow.getElementById("info-socials");
    const infoMonetizations = shadow.getElementById("info-monetizations");

    function updateStatus(icon, message, showProgress = false) {
        statusMessage.innerHTML = `<span class="status-icon">${icon}</span><span>${message}</span>`;
        progressContainer.style.display = showProgress ? "block" : "none";
    }

    function showBypassInfo(socials, monetizations) {
        infoPanel.style.display = "block";
        infoStatus.textContent = "Bypassing...";
        infoSocials.textContent = socials;
        infoMonetizations.textContent = monetizations;
    }

    function updateBypassProgress() {
        progressBar.style.width = "100%";
        infoStatus.textContent = "Complete ✓";
    }

    function showCountdown(seconds) {
        const statusDiv = shadow.querySelector(".gui-status");
        statusDiv.innerHTML = `
            <div class="success-checkmark">✅</div>
            <div class="status-text" style="justify-content: center;">
                <span>Redirecting in</span>
            </div>
            <div class="countdown-number" id="countdown">${Math.ceil(seconds)}</div>
        `;
    }

    function updateCountdown(seconds) {
        const countdown = shadow.getElementById("countdown");
        if (countdown) {
            countdown.textContent = Math.ceil(seconds);
        }
    }

    // ===== ORIGINAL BYPASS LOGIC =====
    const NAME_MAP = {
        sendMessage: ["sendMessage", "sendMsg", "writeMessage", "writeMsg"],
        onLinkInfo: ["onLinkInfo"],
        onLinkDestination: ["onLinkDestination"]
    };

    function resolveName(obj, candidates) {
        for (let i = 0; i < candidates.length; i++) {
            const name = candidates[i];
            if (typeof obj[name] === "function") {
                return { fn: obj[name], index: i, name };
            }
        }
        return { fn: null, index: -1, name: null };
    }

    let _sessionController = undefined;
    let _sendMessage = undefined;
    let _onLinkInfo = undefined;
    let _onLinkDestination = undefined;

    function getClientPacketTypes() {
        return {
            ANNOUNCE: "c_announce",
            MONETIZATION: "c_monetization",
            SOCIAL_STARTED: "c_social_started",
            RECAPTCHA_RESPONSE: "c_recaptcha_response",
            HCAPTCHA_RESPONSE: "c_hcaptcha_response",
            TURNSTILE_RESPONSE: "c_turnstile_response",
            ADBLOCKER_DETECTED: "c_adblocker_detected",
            FOCUS_LOST: "c_focus_lost",
            OFFERS_SKIPPED: "c_offers_skipped",
            FOCUS: "c_focus",
            WORKINK_PASS_AVAILABLE: "c_workink_pass_available",
            WORKINK_PASS_USE: "c_workink_pass_use",
            PING: "c_ping"
        };
    }

    const startTime = Date.now();

    function createSendMessageProxy() {
        const clientPacketTypes = getClientPacketTypes();

        return function(...args) {
            const packet_type = args[0];
            const packet_data = args[1];

            if (packet_type !== clientPacketTypes.PING) {
                log("Sent message:", packet_type, packet_data);
            }

            if (packet_type === clientPacketTypes.ADBLOCKER_DETECTED) {
                warn("Blocked adblocker detected message");
                return;
            }

            if (_sessionController.linkInfo && packet_type === clientPacketTypes.TURNSTILE_RESPONSE) {
                const ret = _sendMessage.apply(this, args);

                updateStatus("⚡", "Captcha solved! Bypassing...", true);
                progressBar.classList.add("animated");

                const socialsCount = _sessionController.linkInfo.socials.length;
                const monetizationsCount = _sessionController.linkInfo.monetizations.length;
                
                showBypassInfo(socialsCount, monetizationsCount);

                for (const social of _sessionController.linkInfo.socials) {
                    _sendMessage.call(this, clientPacketTypes.SOCIAL_STARTED, {
                        url: social.url
                    });
                }

                for (const monetizationIdx in _sessionController.linkInfo.monetizations) {
                    const monetization = _sessionController.linkInfo.monetizations[monetizationIdx];

                    switch (monetization) {
                        case 22:
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "readArticles2",
                                payload: { event: "read" }
                            });
                            break;
                        case 25:
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "operaGX",
                                payload: { event: "start" }
                            });
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "operaGX",
                                payload: { event: "installClicked" }
                            });
                            fetch('https://work.ink/_api/v2/callback/operaGX', {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 'noteligible': true })
                            });
                            break;
                        case 34:
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "norton",
                                payload: { event: "start" }
                            });
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "norton",
                                payload: { event: "installClicked" }
                            });
                            break;
                        case 71:
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "externalArticles",
                                payload: { event: "start" }
                            });
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "externalArticles",
                                payload: { event: "installClicked" }
                            });
                            break;
                        case 45:
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "pdfeditor",
                                payload: { event: "installed" }
                            });
                            break;
                        case 57:
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "betterdeals",
                                payload: { event: "installed" }
                            });
                            break;
                        default:
                            log("Unknown monetization:", monetization);
                            break;
                    }
                }

                setTimeout(() => {
                    updateBypassProgress();
                }, 1000);

                return ret;
            }

            return _sendMessage.apply(this, args);
        };
    }

    function createOnLinkInfoProxy() {
        return function(...args) {
            const linkInfo = args[0];
            log("Link info received:", linkInfo);

            Object.defineProperty(linkInfo, "isAdblockEnabled", {
                get() { return false },
                set(newValue) { log("Blocked isAdblockEnabled set:", newValue); },
                configurable: false,
                enumerable: true
            });

            return _onLinkInfo.apply(this, args);
        };
    }

    function redirect(url) {
        updateStatus("🎉", "Redirecting now!");
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    function startCountdown(url, waitLeft) {
        showCountdown(waitLeft);

        const interval = setInterval(() => {
            waitLeft -= 1;
            if (waitLeft > 0) {
                updateCountdown(waitLeft);
            } else {
                clearInterval(interval);
                redirect(url);
            }
        }, 1000);
    }

    function createOnLinkDestinationProxy() {
        return function (...args) {
            const payload = args[0];
            log("Link destination received:", payload);

            const waitTimeSeconds = 30;
            const secondsPassed = (Date.now() - startTime) / 1000;

            if (secondsPassed >= waitTimeSeconds) {
                redirect(payload.url);
            } else {
                startCountdown(payload.url, waitTimeSeconds - secondsPassed);
            }

            return _onLinkDestination.apply(this, args);
        };
    }

    function setupSessionControllerProxy() {
        const sendMessage = resolveName(_sessionController, NAME_MAP.sendMessage);
        const onLinkInfo = resolveName(_sessionController, NAME_MAP.onLinkInfo);
        const onLinkDestination = resolveName(_sessionController, NAME_MAP.onLinkDestination);

        _sendMessage = sendMessage.fn;
        _onLinkInfo = onLinkInfo.fn;
        _onLinkDestination = onLinkDestination.fn;

        const sendMessageProxy = createSendMessageProxy();
        const onLinkInfoProxy = createOnLinkInfoProxy();
        const onLinkDestinationProxy = createOnLinkDestinationProxy();

        Object.defineProperty(_sessionController, sendMessage.name, {
            get() { return sendMessageProxy },
            set(newValue) { _sendMessage = newValue },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(_sessionController, onLinkInfo.name, {
            get() { return onLinkInfoProxy },
            set(newValue) { _onLinkInfo = newValue },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(_sessionController, onLinkDestination.name, {
            get() { return onLinkDestinationProxy },
            set(newValue) { _onLinkDestination = newValue },
            configurable: false,
            enumerable: true
        });

        log(`Proxies installed: ${sendMessage.name}, ${onLinkInfo.name}, ${onLinkDestination.name}`);
    }

    function checkForSessionController(target, prop, value, receiver) {
        log("Checking property set:", prop, value);

        if (
            value &&
            typeof value === "object" &&
            resolveName(value, NAME_MAP.sendMessage).fn &&
            resolveName(value, NAME_MAP.onLinkInfo).fn &&
            resolveName(value, NAME_MAP.onLinkDestination).fn &&
            !_sessionController
        ) {
            _sessionController = value;
            log("Intercepted session controller:", _sessionController);
            setupSessionControllerProxy();
        }

        return Reflect.set(target, prop, value, receiver);
    }

    function createComponentProxy(component) {
        return new Proxy(component, {
            construct(target, args) {
                const result = Reflect.construct(target, args);
                log("Intercepted component:", target, args, result);

                result.$$.ctx = new Proxy(result.$$.ctx, {
                    set: checkForSessionController
                });

                return result;
            }
        });
    }

    function createNodeResultProxy(result) {
        return new Proxy(result, {
            get(target, prop, receiver) {
                if (prop === "component") {
                    return createComponentProxy(target.component);
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }

    function createNodeProxy(oldNode) {
        return async (...args) => {
            const result = await oldNode(...args);
            log("Intercepted node result:", result);
            return createNodeResultProxy(result);
        };
    }

    function createKitProxy(kit) {
        if (typeof kit !== "object" || !kit) return [false, kit];

        const originalStart = "start" in kit && kit.start;
        if (!originalStart) return [false, kit];

        const kitProxy = new Proxy(kit, {
            get(target, prop, receiver) {
                if (prop === "start") {
                    return function(...args) {
                        const appModule = args[0];
                        const options = args[2];

                        if (typeof appModule === "object" &&
                            typeof appModule.nodes === "object" &&
                            typeof options === "object" &&
                            typeof options.node_ids === "object") {

                            const oldNode = appModule.nodes[options.node_ids[1]];
                            appModule.nodes[options.node_ids[1]] = createNodeProxy(oldNode);
                        }

                        log("kit.start intercepted!", options);
                        return originalStart.apply(this, args);
                    };
                }
                return Reflect.get(target, prop, receiver);
            }
        });

        return [true, kitProxy];
    }

    function setupSvelteKitInterception() {
        const originalPromiseAll = unsafeWindow.Promise.all;
        let intercepted = false;

        unsafeWindow.Promise.all = async function(promises) {
            const result = originalPromiseAll.call(this, promises);

            if (!intercepted) {
                intercepted = true;

                return await new Promise((resolve) => {
                    result.then(([kit, app, ...args]) => {
                        log("SvelteKit modules loaded");

                        const [success, wrappedKit] = createKitProxy(kit);
                        if (success) {
                            unsafeWindow.Promise.all = originalPromiseAll;
                            log("Wrapped kit ready:", wrappedKit, app);
                        }

                        resolve([wrappedKit, app, ...args]);
                    });
                });
            }

            return await result;
        };
    }

    setupSvelteKitInterception();

    // Remove injected ads
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.classList?.contains("adsbygoogle")) {
                        node.remove();
                        log("Removed injected ad:", node);
                    }
                    node.querySelectorAll?.(".adsbygoogle").forEach((el) => {
                        el.remove();
                        log("Removed nested ad:", el);
                    });
                }
            }
        }
    });

    observer.observe(unsafeWindow.document.documentElement, { childList: true, subtree: true });
})();
