(function() {
    "use strict";

    const isVolcano = location.hostname.includes("key.volcano.wtf");
    const isWorkink = location.hostname.includes("work.ink");

    function createUI(gradient, title) {
        const box = document.createElement("div");
        box.style.cssText = "position:fixed;top:20px;right:20px;z-index:999999";
        const shadow = box.attachShadow({ mode: "closed" });

        const css = document.createElement("style");
        css.textContent = `*{margin:0;padding:0;box-sizing:border-box}.ui{background:${gradient};border-radius:8px;padding:12px 16px;width:240px;box-shadow:0 4px 12px rgba(0,0,0,.2);color:#fff;font:13px system-ui,sans-serif}.title{font-size:14px;font-weight:600;margin-bottom:8px;opacity:.95}.msg{font-size:12px;opacity:.85;margin-bottom:8px}.bar{background:rgba(255,255,255,.2);height:3px;border-radius:2px;overflow:hidden}.fill{background:#fff;height:100%;width:0;transition:width .3s}.info{margin-top:8px;font-size:11px;opacity:.75;display:none}.row{display:flex;justify-content:space-between;margin:3px 0}.cd{font-size:28px;font-weight:700;text-align:center;margin:8px 0}`;
        shadow.appendChild(css);

        const ui = document.createElement("div");
        ui.className = "ui";
        ui.innerHTML = `<div class="title">${title}</div><div class="msg" id="msg">Initializing...</div><div class="bar"><div class="fill" id="bar"></div></div><div class="info" id="info"></div>`;
        shadow.appendChild(ui);
        document.documentElement.appendChild(box);

        return {
            msg: shadow.getElementById("msg"),
            bar: shadow.getElementById("bar"),
            info: shadow.getElementById("info"),
            upd: (txt, pct) => {
                shadow.getElementById("msg").textContent = txt;
                shadow.getElementById("bar").style.width = `${pct}%`;
            },
            show: (html) => {
                const info = shadow.getElementById("info");
                info.innerHTML = html;
                info.style.display = "block";
            }
        };
    }

    if (isVolcano) {
        const ui = createUI("linear-gradient(135deg,#1e293b,#0f172a)", "Volcano Bypass");

        function waitLoad() {
            return new Promise(r => {
                if (document.readyState !== "loading") r();
                else window.addEventListener("load", r);
            });
        }

        function checkButton() {
            const btn = document.querySelector("#primaryButton");
            if (btn && !btn.disabled && btn.textContent.includes("Continue")) {
                ui.upd("Clicking...", 90);
                btn.click();
                setTimeout(() => {
                    if (location.hostname.includes("volcano")) {
                        ui.upd("Retrying...", 60);
                        setTimeout(startMonitor, 3000);
                    } else {
                        ui.upd("Complete ✓", 100);
                    }
                }, 2000);
                return true;
            }
            return false;
        }

        async function startMonitor() {
            ui.upd("Loading...", 20);
            await waitLoad();
            ui.upd("Scanning...", 40);

            const checkInterval = setInterval(() => {
                if (checkButton()) {
                    clearInterval(checkInterval);
                } else {
                    const captcha = document.querySelector('iframe[src*="cloudflare"]');
                    if (captcha) ui.upd("Solve CAPTCHA...", 30);
                }
            }, 1000);

            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = function(...args) {
                if (args[0]?.includes?.("work.ink")) {
                    ui.upd("Redirecting...", 85);
                    setTimeout(checkButton, 1000);
                }
                return originalFetch.apply(this, args);
            };
        }

        startMonitor();
    }

    if (isWorkink) {
        const ui = createUI("linear-gradient(135deg,#6366f1,#8b5cf6)", "Work.ink Bypass");

        const NAME_MAP = {
            send: ["sendMessage", "sendMsg", "writeMessage", "writeMsg"],
            info: ["onLinkInfo"],
            dest: ["onLinkDestination"]
        };

        function findMethod(obj, names) {
            for (let name of names) {
                if (typeof obj[name] === "function") {
                    return { fn: obj[name], name };
                }
            }
            return { fn: null, name: null };
        }

        let ctrl, sendFn, infoFn, destFn;
        const startTime = Date.now();

        function getPackets() {
            return {
                MONETIZATION: "c_monetization",
                SOCIAL_STARTED: "c_social_started",
                TURNSTILE_RESPONSE: "c_turnstile_response",
                ADBLOCKER_DETECTED: "c_adblocker_detected",
                PING: "c_ping"
            };
        }

        function createSendProxy() {
            const p = getPackets();
            return function(...args) {
                const [type, data] = args;
                
                if (type === p.ADBLOCKER_DETECTED) return;

                if (ctrl.linkInfo && type === p.TURNSTILE_RESPONSE) {
                    const ret = sendFn.apply(this, args);
                    ui.upd("Bypassing...", 50);

                    const sc = ctrl.linkInfo.socials.length;
                    const mc = ctrl.linkInfo.monetizations.length;
                    
                    ui.show(`<div class="row"><span>Status:</span><span>Active</span></div><div class="row"><span>Socials:</span><span>${sc}</span></div><div class="row"><span>Offers:</span><span>${mc}</span></div>`);

                    for (const s of ctrl.linkInfo.socials) {
                        sendFn.call(this, p.SOCIAL_STARTED, { url: s.url });
                    }

                    for (const m of ctrl.linkInfo.monetizations) {
                        switch (m) {
                            case 22:
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "readArticles2",
                                    payload: { event: "read" }
                                });
                                break;
                            case 25:
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "operaGX",
                                    payload: { event: "start" }
                                });
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "operaGX",
                                    payload: { event: "installClicked" }
                                });
                                fetch('https://work.ink/_api/v1/callback/operaGX', {
                                    method: 'POST',
                                    mode: 'no-cors',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ noteligible: true })
                                });
                                break;
                            case 34:
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "norton",
                                    payload: { event: "start" }
                                });
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "norton",
                                    payload: { event: "installClicked" }
                                });
                                break;
                            case 71:
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "externalArticles",
                                    payload: { event: "start" }
                                });
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "externalArticles",
                                    payload: { event: "installClicked" }
                                });
                                break;
                            case 45:
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "pdfeditor",
                                    payload: { event: "installed" }
                                });
                                break;
                            case 57:
                                sendFn.call(this, p.MONETIZATION, {
                                    type: "betterdeals",
                                    payload: { event: "installed" }
                                });
                                break;
                        }
                    }

                    setTimeout(() => ui.upd("Done ✓", 100), 1000);
                    return ret;
                }

                return sendFn.apply(this, args);
            };
        }

        function createInfoProxy() {
            return function(...args) {
                const linkInfo = args[0];
                Object.defineProperty(linkInfo, "isAdblockEnabled", {
                    get() { return false; },
                    set(v) {},
                    configurable: false,
                    enumerable: true
                });
                return infoFn.apply(this, args);
            };
        }

        function createDestProxy() {
            return function(...args) {
                const payload = args[0];
                const url = payload.url;
                const waitTime = 30;
                const elapsed = (Date.now() - startTime) / 1000;

                if (elapsed >= waitTime) {
                    ui.upd("Redirecting...", 100);
                    setTimeout(() => location.href = url, 500);
                } else {
                    const remaining = waitTime - elapsed;
                    ui.show(`<div class="cd" id="cd">${Math.ceil(remaining)}</div>`);
                    ui.upd("Redirecting in", 100);
                    
                    const iv = setInterval(() => {
                        const cd = ui.info.querySelector("#cd");
                        const left = waitTime - (Date.now() - startTime) / 1000;
                        if (left > 0 && cd) {
                            cd.textContent = Math.ceil(left);
                        } else {
                            clearInterval(iv);
                            location.href = url;
                        }
                    }, 1000);
                }

                return destFn.apply(this, args);
            };
        }

        function setupHooks() {
            const s = findMethod(ctrl, NAME_MAP.send);
            const i = findMethod(ctrl, NAME_MAP.info);
            const d = findMethod(ctrl, NAME_MAP.dest);

            sendFn = s.fn;
            infoFn = i.fn;
            destFn = d.fn;

            const sendProxy = createSendProxy();
            const infoProxy = createInfoProxy();
            const destProxy = createDestProxy();

            Object.defineProperty(ctrl, s.name, {
                get() { return sendProxy; },
                set(v) { sendFn = v; },
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(ctrl, i.name, {
                get() { return infoProxy; },
                set(v) { infoFn = v; },
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(ctrl, d.name, {
                get() { return destProxy; },
                set(v) { destFn = v; },
                configurable: false,
                enumerable: true
            });
        }

        function proxySet(target, prop, value, receiver) {
            if (value && typeof value === "object" &&
                findMethod(value, NAME_MAP.send).fn &&
                findMethod(value, NAME_MAP.info).fn &&
                findMethod(value, NAME_MAP.dest).fn && 
                !ctrl) {
                ctrl = value;
                setupHooks();
            }
            return Reflect.set(target, prop, value, receiver);
        }

        function componentProxy(component) {
            return new Proxy(component, {
                construct(target, args) {
                    const instance = Reflect.construct(target, args);
                    instance.$$.ctx = new Proxy(instance.$$.ctx, { set: proxySet });
                    return instance;
                }
            });
        }

        function nodeProxy(nodeResult) {
            return new Proxy(nodeResult, {
                get(target, prop, receiver) {
                    if (prop === "component") {
                        return componentProxy(target.component);
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });
        }

        function wrapNode(originalNode) {
            return async (...args) => {
                const result = await originalNode(...args);
                return nodeProxy(result);
            };
        }

        function kitProxy(kit) {
            if (typeof kit !== "object" || !kit || !kit.start) {
                return [false, kit];
            }

            const proxiedKit = new Proxy(kit, {
                get(target, prop, receiver) {
                    if (prop === "start") {
                        return function(...args) {
                            const [module, , options] = args;

                            if (typeof module === "object" &&
                                typeof module.nodes === "object" &&
                                typeof options === "object" &&
                                typeof options.node_ids === "object") {
                                const originalNode = module.nodes[options.node_ids[1]];
                                module.nodes[options.node_ids[1]] = wrapNode(originalNode);
                            }

                            return target.start.apply(this, args);
                        };
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });

            return [true, proxiedKit];
        }

        function interceptPromise() {
            const original = unsafeWindow.Promise.all;
            let hooked = false;

            unsafeWindow.Promise.all = async function(promises) {
                const result = original.call(this, promises);
                if (!hooked) {
                    hooked = true;
                    return await new Promise((resolve) => {
                        result.then(([kit, app, ...rest]) => {
                            const [success, wrappedKit] = kitProxy(kit);
                            if (success) {
                                unsafeWindow.Promise.all = original;
                            }
                            resolve([wrappedKit, app, ...rest]);
                        });
                    });
                }
                return await result;
            };
        }

        interceptPromise();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains("adsbygoogle")) {
                            node.remove();
                        }
                        node.querySelectorAll?.(".adsbygoogle").forEach(ad => ad.remove());
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
})();
