
(function() {
    "use strict";

    const DEBUG = false; // debug logging
    const VERSION = "2.0.0"; // Version tracking

    // Preserve original console methods in case the site overrides them
    const oldLog = window.console.log;
    const oldWarn = window.console.warn;
    const oldError = window.console.error;

    // Wrapper functions prepend a tag and only log when DEBUG is true
    function log(...args) { if (DEBUG) oldLog("[WorkInk Bypass]", ...args); }
    function warn(...args) { if (DEBUG) oldWarn("[WorkInk Bypass]", ...args); }
    function error(...args) { if (DEBUG) oldError("[WorkInk Bypass]", ...args); }

    // Override console.clear in DEBUG mode to prevent the site from erasing debug logs
    if (DEBUG) window.console.clear = function() {};

    log(`🚀 Work.ink Bypass v${VERSION} initialized`);

    // Create UI container with shadow DOM for isolation
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.left = "10px";
    container.style.zIndex = 999999;

    // Attach closed shadow root for maximum isolation
    const shadow = container.attachShadow({ mode: "closed" });

    // Create hint element with improved styling
    const hint = document.createElement("div");
    hint.textContent = "🔒 Please solve the captcha to continue";

    Object.assign(hint.style, {
        background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,30,30,0.9) 100%)",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        pointerEvents: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease"
    });

    shadow.appendChild(hint);
    document.documentElement.appendChild(container);

    // Enhanced name mapping with more fallback options
    const NAME_MAP = {
        sendMessage: ["sendMessage", "sendMsg", "writeMessage", "writeMsg", "send"],
        onLinkInfo: ["onLinkInfo", "handleLinkInfo", "linkInfo"],
        onLinkDestination: ["onLinkDestination", "handleDestination", "destination"]
    };

    function resolveName(obj, candidates) {
        for (let i = 0; i < candidates.length; i++) {
            const name = candidates[i];
            if (typeof obj[name] === "function") {
                log(`✓ Found method: ${name}`);
                return { fn: obj[name], index: i, name };
            }
        }
        warn(`✗ Could not find any of:`, candidates);
        return { fn: null, index: -1, name: null };
    }

    // Global state
    let _sessionController = undefined;
    let _sendMessage = undefined;
    let _onLinkInfo = undefined;
    let _onLinkDestination = undefined;

    // Constants
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

    // Helper function to safely fetch with error handling
    async function safeFetch(url, options) {
        try {
            await fetch(url, options);
            log(`✓ Fetch successful: ${url}`);
        } catch (err) {
            warn(`✗ Fetch failed: ${url}`, err);
        }
    }

    function createSendMessageProxy() {
        const clientPacketTypes = getClientPacketTypes();

        return function(...args) {
            const packet_type = args[0];
            const packet_data = args[1];

            // Don't spam logs with ping messages
            if (packet_type !== clientPacketTypes.PING) {
                log("📤 Sent message:", packet_type, packet_data);
            }

            // Block adblocker detection
            if (packet_type === clientPacketTypes.ADBLOCKER_DETECTED) {
                warn("🛡️ Blocked adblocker detected message");
                return;
            }

            // Main bypass logic when captcha is solved
            if (_sessionController.linkInfo && packet_type === clientPacketTypes.TURNSTILE_RESPONSE) {
                const ret = _sendMessage.apply(this, args);

                hint.textContent = "⏳ Captcha solved, bypassing... (This can take up to a minute)";
                hint.style.background = "linear-gradient(135deg, rgba(255,165,0,0.9) 0%, rgba(255,140,0,0.9) 100%)";
                
                log("🔓 Starting bypass sequence...");

                // Send social started messages
                for (const social of _sessionController.linkInfo.socials) {
                    _sendMessage.call(this, clientPacketTypes.SOCIAL_STARTED, {
                        url: social.url
                    });
                    log(`📱 Social bypass: ${social.url}`);
                }

                // Handle monetizations
                for (const monetizationIdx in _sessionController.linkInfo.monetizations) {
                    const monetization = _sessionController.linkInfo.monetizations[monetizationIdx];

                    switch (monetization) {
                        case 22: { // readArticles2
                            log("📰 Bypassing: readArticles2");
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "readArticles2",
                                payload: { event: "read" }
                            });
                            break;
                        }

                        case 25: { // operaGX
                            log("🎮 Bypassing: operaGX");
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "operaGX",
                                payload: { event: "start" }
                            });
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "operaGX",
                                payload: { event: "installClicked" }
                            });
                            safeFetch('https://work.ink/_api/v2/callback/operaGX', {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 'noteligible': true })
                            });
                            break;
                        }

                        case 34: { // norton
                            log("🛡️ Bypassing: norton");
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "norton",
                                payload: { event: "start" }
                            });
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "norton",
                                payload: { event: "installClicked" }
                            });
                            break;
                        }

                        case 71: { // externalArticles
                            log("📄 Bypassing: externalArticles");
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "externalArticles",
                                payload: { event: "start" }
                            });
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "externalArticles",
                                payload: { event: "installClicked" }
                            });
                            break;
                        }

                        case 45: { // pdfeditor
                            log("📝 Bypassing: pdfeditor");
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "pdfeditor",
                                payload: { event: "installed" }
                            });
                            break;
                        }

                        case 57: { // betterdeals
                            log("💰 Bypassing: betterdeals");
                            _sendMessage.call(this, clientPacketTypes.MONETIZATION, {
                                type: "betterdeals",
                                payload: { event: "installed" }
                            });
                            break;
                        }

                        default: {
                            warn(`⚠️ Unknown monetization type: ${monetization} (${typeof monetization})`);
                            break;
                        }
                    }
                }

                log("✅ Bypass sequence completed");
                return ret;
            }

            return _sendMessage.apply(this, args);
        };
    }

    function createOnLinkInfoProxy() {
        return function(...args) {
            const linkInfo = args[0];

            log("📋 Link info received:", linkInfo);

            // Prevent adblock detection
            Object.defineProperty(linkInfo, "isAdblockEnabled", {
                get() { 
                    log("🛡️ isAdblockEnabled getter called - returning false");
                    return false;
                },
                set(newValue) {
                    log(`🛡️ Attempted to set isAdblockEnabled to: ${newValue} - blocked`);
                },
                configurable: false,
                enumerable: true
            });

            return _onLinkInfo.apply(this, args);
        };
    }

    function updateHint(waitLeft) {
        const seconds = Math.ceil(waitLeft);
        hint.textContent = `⏳ Destination found, redirecting in ${seconds} second${seconds !== 1 ? 's' : ''}...`;
        hint.style.background = "linear-gradient(135deg, rgba(0,150,255,0.9) 0%, rgba(0,100,200,0.9) 100%)";
    }

    function redirect(url) {
        hint.textContent = "🎉 Redirecting to your destination...";
        hint.style.background = "linear-gradient(135deg, rgba(0,200,100,0.9) 0%, rgba(0,150,80,0.9) 100%)";
        log("🚀 Redirecting to:", url);
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    function startCountdown(url, waitLeft) {
        const startCountdownTime = Date.now();
        updateHint(waitLeft);

        const interval = setInterval(() => {
            const elapsed = (Date.now() - startCountdownTime) / 1000;
            const remaining = waitLeft - elapsed;
            
            if (remaining > 0) {
                updateHint(remaining);
            } else {
                clearInterval(interval);
                redirect(url);
            }
        }, 100); // Update every 100ms for smoother countdown
    }

    function createOnLinkDestinationProxy() {
        return function (...args) {
            const payload = args[0];
            log("🎯 Link destination received:", payload);

            const waitTimeSeconds = 30;
            const secondsPassed = (Date.now() - startTime) / 1000;
            const remainingWait = Math.max(0, waitTimeSeconds - secondsPassed);

            if (remainingWait <= 0) {
                log("⚡ Minimum wait time met, redirecting immediately");
                redirect(payload.url);
            } else {
                log(`⏱️ ${Math.ceil(remainingWait)} seconds remaining before redirect`);
                startCountdown(payload.url, remainingWait);
            }

            return _onLinkDestination.apply(this, args);
        };
    }

    function setupSessionControllerProxy() {
        const sendMessage = resolveName(_sessionController, NAME_MAP.sendMessage);
        const onLinkInfo = resolveName(_sessionController, NAME_MAP.onLinkInfo);
        const onLinkDestination = resolveName(_sessionController, NAME_MAP.onLinkDestination);

        if (!sendMessage.fn || !onLinkInfo.fn || !onLinkDestination.fn) {
            error("❌ Failed to find required session controller methods");
            return;
        }

        _sendMessage = sendMessage.fn;
        _onLinkInfo = onLinkInfo.fn;
        _onLinkDestination = onLinkDestination.fn;

        const sendMessageProxy = createSendMessageProxy();
        const onLinkInfoProxy = createOnLinkInfoProxy();
        const onLinkDestinationProxy = createOnLinkDestinationProxy();

        // Patch the actual property names
        Object.defineProperty(_sessionController, sendMessage.name, {
            get() { return sendMessageProxy; },
            set(newValue) { _sendMessage = newValue; },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(_sessionController, onLinkInfo.name, {
            get() { return onLinkInfoProxy; },
            set(newValue) { _onLinkInfo = newValue; },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(_sessionController, onLinkDestination.name, {
            get() { return onLinkDestinationProxy; },
            set(newValue) { _onLinkDestination = newValue; },
            configurable: false,
            enumerable: true
        });

        log(`✅ SessionController proxies installed: ${sendMessage.name}, ${onLinkInfo.name}, ${onLinkDestination.name}`);
    }

    function checkForSessionController(target, prop, value, receiver) {
        if (DEBUG) log("🔍 Checking property set:", prop);

        if (
            value &&
            typeof value === "object" &&
            resolveName(value, NAME_MAP.sendMessage).fn &&
            resolveName(value, NAME_MAP.onLinkInfo).fn &&
            resolveName(value, NAME_MAP.onLinkDestination).fn &&
            !_sessionController
        ) {
            _sessionController = value;
            log("🎯 Intercepted session controller!");
            setupSessionControllerProxy();
        }

        return Reflect.set(target, prop, value, receiver);
    }

    function createComponentProxy(component) {
        return new Proxy(component, {
            construct(target, args) {
                const result = Reflect.construct(target, args);
                log("🔧 Intercepted SvelteKit component construction");

                if (result.$$ && result.$$.ctx) {
                    result.$$.ctx = new Proxy(result.$$.ctx, {
                        set: checkForSessionController
                    });
                }

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
            log("📦 Intercepted SvelteKit node result");
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
                            if (oldNode) {
                                appModule.nodes[options.node_ids[1]] = createNodeProxy(oldNode);
                                log("✅ SvelteKit node proxy installed");
                            }
                        }

                        return originalStart.apply(this, args);
                    };
                }
                return Reflect.get(target, prop, receiver);
            }
        });

        return [true, kitProxy];
    }

    function setupSvelteKitInterception() {
        const originalPromiseAll = Promise.all;
        let intercepted = false;

        Promise.all = async function(promises) {
            const result = originalPromiseAll.call(this, promises);

            if (!intercepted) {
                intercepted = true;

                return await new Promise((resolve) => {
                    result.then(([kit, app, ...args]) => {
                        log("📚 SvelteKit modules loaded");

                        const [success, wrappedKit] = createKitProxy(kit);
                        if (success) {
                            // Restore original Promise.all
                            Promise.all = originalPromiseAll;
                            log("✅ SvelteKit interception complete");
                        }

                        resolve([wrappedKit, app, ...args]);
                    }).catch(err => {
                        error("❌ Error in SvelteKit interception:", err);
                        resolve(result);
                    });
                });
            }

            return await result;
        };
    }

    // Initialize the bypass
    log("🔌 Setting up SvelteKit interception...");
    setupSvelteKitInterception();

    // Enhanced ad removal with better selectors
    const AD_SELECTORS = [
        ".adsbygoogle",
        "[class*='ad-']",
        "[id*='google_ads']",
        "ins.adsbygoogle"
    ];

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    // Check all ad selectors
                    for (const selector of AD_SELECTORS) {
                        if (node.matches && node.matches(selector)) {
                            node.remove();
                            log("🗑️ Removed ad element:", selector);
                        }
                        
                        // Also check children
                        if (node.querySelectorAll) {
                            node.querySelectorAll(selector).forEach((el) => {
                                el.remove();
                                log("🗑️ Removed nested ad:", selector);
                            });
                        }
                    }
                }
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
    });

    log("👁️ Ad removal observer started");
    log("✅ Work.ink Bypass fully initialized");
})();
