(function() {
    "use strict";

    const box = document.createElement("div");
    box.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999";
    const shadow = box.attachShadow({ mode: "closed" });

    shadow.innerHTML = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .wrap {
                background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                padding: 28px;
                width: 420px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                color: #fff;
                backdrop-filter: blur(10px);
                animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .header {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 24px;
                text-align: center;
                letter-spacing: 0.5px;
            }
            .status {
                background: rgba(255, 255, 255, 0.15);
                padding: 18px;
                border-radius: 12px;
                margin-bottom: 18px;
                backdrop-filter: blur(5px);
            }
            .message {
                font-size: 15px;
                text-align: center;
                min-height: 24px;
            }
            .bar-wrap {
                background: rgba(0, 0, 0, 0.2);
                height: 6px;
                border-radius: 6px;
                overflow: hidden;
                margin-top: 14px;
                display: none;
            }
            .bar {
                background: linear-gradient(90deg, #00f260, #0575e6);
                height: 100%;
                width: 0;
                transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 10px rgba(0, 242, 96, 0.5);
            }
            .info {
                background: rgba(255, 255, 255, 0.1);
                padding: 16px;
                border-radius: 12px;
                display: none;
            }
            .row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .row:last-child {
                border: 0;
            }
            .label {
                opacity: 0.85;
            }
            .value {
                font-weight: 600;
                color: #00f260;
            }
            .big {
                font-size: 52px;
                text-align: center;
                margin: 16px 0;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            .auto-check {
                background: rgba(255, 255, 255, 0.1);
                padding: 12px;
                border-radius: 8px;
                margin-top: 12px;
                font-size: 13px;
                text-align: center;
                opacity: 0.9;
            }
        </style>
        <div class="wrap">
            <div class="header">Work.ink Auto Bypass</div>
            <div class="status">
                <div class="message" id="msg">Initializing...</div>
                <div class="bar-wrap" id="barwrap">
                    <div class="bar" id="bar"></div>
                </div>
            </div>
            <div class="info" id="info">
                <div class="row">
                    <span class="label">Status</span>
                    <span class="value" id="status">Ready</span>
                </div>
                <div class="row">
                    <span class="label">Socials</span>
                    <span class="value" id="socials">0</span>
                </div>
                <div class="row">
                    <span class="label">Offers</span>
                    <span class="value" id="offers">0</span>
                </div>
            </div>
            <div class="auto-check" id="autocheck">Auto-solving captcha...</div>
        </div>
    `;

    document.body.appendChild(box);

    const $ = id => shadow.getElementById(id);
    const msg = $("msg");
    const bar = $("bar");
    const barwrap = $("barwrap");
    const info = $("info");
    const status = $("status");
    const socials = $("socials");
    const offers = $("offers");
    const autocheck = $("autocheck");

    const showNotification = (text, type = "info") => {
        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "linear-gradient(135deg, #00f260, #0575e6)" : type === "error" ? "linear-gradient(135deg, #ff6b6b, #ee5a6f)" : "linear-gradient(135deg, #667eea, #764ba2)"};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        const style = document.createElement("style");
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100px); }
            }
        `;
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }
        
        notification.textContent = text;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = "slideOutRight 0.3s ease-out";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    const ui = {
        update: (text, showBar = false) => {
            msg.textContent = text;
            barwrap.style.display = showBar ? "block" : "none";
        },
        showInfo: (socialCount, offerCount) => {
            info.style.display = "block";
            status.textContent = "Bypassing";
            socials.textContent = socialCount;
            offers.textContent = offerCount;
            autocheck.style.display = "none";
        },
        complete: () => {
            bar.style.width = "100%";
            status.textContent = "Complete";
        },
        countdown: (seconds) => {
            const statusDiv = $("msg").parentElement;
            statusDiv.innerHTML = `
                <div class="big">✓</div>
                <div class="message">Redirecting in <span id="countdown">${Math.ceil(seconds)}</span>s</div>
            `;
            
            const timer = setInterval(() => {
                seconds -= 1;
                const cd = $("countdown");
                if (seconds > 0 && cd) {
                    cd.textContent = Math.ceil(seconds);
                } else {
                    clearInterval(timer);
                    location.href = ui.redirectUrl;
                }
            }, 1000);
        }
    };

    const PKT = {
        MONETIZATION: "c_monetization",
        SOCIAL_STARTED: "c_social_started",
        TURNSTILE: "c_turnstile_response",
        RECAPTCHA: "c_recaptcha_response",
        HCAPTCHA: "c_hcaptcha_response",
        ADBLOCK: "c_adblocker_detected",
        PING: "c_ping"
    };

    const monetizationHandlers = {
        22: (send) => send(PKT.MONETIZATION, { type: "readArticles2", payload: { event: "read" } }),
        25: (send) => {
            send(PKT.MONETIZATION, { type: "operaGX", payload: { event: "start" } });
            send(PKT.MONETIZATION, { type: "operaGX", payload: { event: "installClicked" } });
            fetch("https://work.ink/_api/v1/callback/operaGX", {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ noteligible: true })
            }).catch(() => {});
        },
        34: (send) => {
            send(PKT.MONETIZATION, { type: "norton", payload: { event: "start" } });
            send(PKT.MONETIZATION, { type: "norton", payload: { event: "installClicked" } });
        },
        71: (send) => {
            send(PKT.MONETIZATION, { type: "externalArticles", payload: { event: "start" } });
            send(PKT.MONETIZATION, { type: "externalArticles", payload: { event: "installClicked" } });
        },
        45: (send) => send(PKT.MONETIZATION, { type: "pdfeditor", payload: { event: "installed" } }),
        57: (send) => send(PKT.MONETIZATION, { type: "betterdeals", payload: { event: "installed" } })
    };

    let controller, sendMessage, startTime = Date.now();
    let captchaCheckInterval;

    const findMethod = (obj, names) => {
        return names.map(name => obj[name]).find(fn => typeof fn === "function");
    };

    const autoSolveCaptcha = () => {
        const checkCaptcha = () => {
            const turnstile = document.querySelector('iframe[src*="turnstile"]');
            const recaptcha = document.querySelector('iframe[src*="recaptcha"]');
            const hcaptcha = document.querySelector('iframe[src*="hcaptcha"]');
            
            if (turnstile || recaptcha || hcaptcha) {
                ui.update("Captcha detected! Auto-solving...", true);
                showNotification("Captcha found, attempting auto-solve...", "info");
                
                setTimeout(() => {
                    const checkbox = document.querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                        showNotification("Captcha checkbox clicked!", "success");
                    }
                }, 1000);
            }
        };
        
        captchaCheckInterval = setInterval(checkCaptcha, 2000);
        checkCaptcha();
    };

    const setupHooks = () => {
        const originalSend = findMethod(controller, ["sendMessage", "sendMsg", "writeMessage"]);
        const originalInfo = findMethod(controller, ["onLinkInfo"]);
        const originalDest = findMethod(controller, ["onLinkDestination"]);

        if (!originalSend || !originalInfo || !originalDest) {
            showNotification("Failed to hook methods!", "error");
            return;
        }

        sendMessage = originalSend;

        Object.defineProperty(controller, Object.keys(controller).find(k => controller[k] === originalSend), {
            get: () => function(...args) {
                const [type, data] = args;
                
                if (type === PKT.ADBLOCK) return;

                if (controller.linkInfo && (type === PKT.TURNSTILE || type === PKT.RECAPTCHA || type === PKT.HCAPTCHA)) {
                    const result = originalSend.apply(this, args);
                    
                    clearInterval(captchaCheckInterval);
                    showNotification("Captcha solved! Starting bypass...", "success");
                    ui.update("Processing bypass...", true);

                    const { socials, monetizations } = controller.linkInfo;
                    ui.showInfo(socials.length, monetizations.length);
                    showNotification(`Found ${socials.length} socials & ${monetizations.length} offers`, "info");

                    socials.forEach(social => {
                        sendMessage.call(this, PKT.SOCIAL_STARTED, { url: social.url });
                    });

                    monetizations.forEach(mon => {
                        if (monetizationHandlers[mon]) {
                            monetizationHandlers[mon](sendMessage.bind(this));
                        }
                    });

                    setTimeout(() => {
                        ui.complete();
                        showNotification("Bypass completed successfully!", "success");
                    }, 1500);
                    
                    return result;
                }

                return originalSend.apply(this, args);
            },
            configurable: false
        });

        Object.defineProperty(controller, Object.keys(controller).find(k => controller[k] === originalInfo), {
            get: () => function(...args) {
                Object.defineProperty(args[0], "isAdblockEnabled", {
                    get: () => false,
                    set: () => {},
                    configurable: false
                });
                return originalInfo.apply(this, args);
            },
            configurable: false
        });

        Object.defineProperty(controller, Object.keys(controller).find(k => controller[k] === originalDest), {
            get: () => function(...args) {
                ui.redirectUrl = args[0].url;
                const waitTime = 30 - (Date.now() - startTime) / 1000;
                
                showNotification(`Redirecting to destination...`, "success");
                
                if (waitTime > 0) {
                    ui.countdown(waitTime);
                } else {
                    location.href = ui.redirectUrl;
                }

                return originalDest.apply(this, args);
            },
            configurable: false
        });

        showNotification("Hooks installed successfully!", "success");
        ui.update("Waiting for captcha...");
        autoSolveCaptcha();
    };

    const interceptSvelteKit = () => {
        const originalPromiseAll = Promise.all;
        let intercepted = false;

        Promise.all = async function(promises) {
            const result = originalPromiseAll.call(this, promises);
            
            if (!intercepted) {
                intercepted = true;
                return new Promise(resolve => {
                    result.then(([kit, ...rest]) => {
                        if (kit?.start) {
                            const originalStart = kit.start;
                            kit.start = function(...args) {
                                const [module, , options] = args;
                                
                                if (module?.nodes && options?.node_ids) {
                                    const originalNode = module.nodes[options.node_ids[1]];
                                    module.nodes[options.node_ids[1]] = async (...nodeArgs) => {
                                        const nodeResult = await originalNode(...nodeArgs);
                                        
                                        if (nodeResult.component) {
                                            const originalComponent = nodeResult.component;
                                            nodeResult.component = new Proxy(originalComponent, {
                                                construct(target, componentArgs) {
                                                    const instance = Reflect.construct(target, componentArgs);
                                                    instance.$$.ctx = new Proxy(instance.$$.ctx, {
                                                        set(ctxTarget, prop, value) {
                                                            if (value && typeof value === "object" && 
                                                                findMethod(value, ["sendMessage"]) && !controller) {
                                                                controller = value;
                                                                showNotification("Script initialized successfully!", "success");
                                                                setupHooks();
                                                            }
                                                            return Reflect.set(ctxTarget, prop, value);
                                                        }
                                                    });
                                                    return instance;
                                                }
                                            });
                                        }
                                        
                                        return nodeResult;
                                    };
                                }
                                
                                return originalStart.apply(this, args);
                            };
                        }
                        
                        Promise.all = originalPromiseAll;
                        resolve([kit, ...rest]);
                    });
                });
            }
            
            return result;
        };
    };

    interceptSvelteKit();
    showNotification("Work.ink Auto Bypass loaded!", "success");

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList?.contains("adsbygoogle")) {
                    node.remove();
                }
                node.querySelectorAll?.(".adsbygoogle").forEach(ad => ad.remove());
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true });

})();
