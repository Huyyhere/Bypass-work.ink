// ==UserScript==
// @name         Bypass Work.ink Huyyhere
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ultimate bypass for work.ink and key.volcano.wtf
// @author       huyyhere
// @match        https://work.ink/*
// @match        https://key.volcano.wtf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=work.ink
// @run-at       document-start
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/Huyyhere/Bypass-work.ink/main/scripts.js
// @downloadURL  https://raw.githubusercontent.com/Huyyhere/Bypass-work.ink/main/scripts.js
// ==/UserScript==

(function() {
    "use strict";

    const DEBUG = false;
    const oldLog = unsafeWindow.console.log;
    const oldWarn = unsafeWindow.console.warn;
    const oldError = unsafeWindow.console.error;

    function log(...args) { if (DEBUG) oldLog("[UnShortener]", ...args); }
    function warn(...args) { if (DEBUG) oldWarn("[UnShortener]", ...args); }
    function error(...args) { if (DEBUG) oldError("[UnShortener]", ...args); }

    if (DEBUG) unsafeWindow.console.clear = function() {};
    const box = unsafeWindow.document.createElement("div");
    box.style.cssText = "position:fixed;top:10px;right:10px;z-index:999999";
    const shadow = box.attachShadow({ mode: "closed" });

    const css = unsafeWindow.document.createElement("style");
    css.textContent = `
        .wrap{background:#333;border-radius:5px;padding:10px;color:#fff;font-family:sans-serif;font-size:12px}
        .msg{font-size:12px}
        .bar-wrap{background:#555;height:2px;border-radius:2px;margin-top:5px;display:none}
        .bar{background:#0a8;width:0;transition:width .3s}
    `;
    shadow.appendChild(css);

    const ui = unsafeWindow.document.createElement("div");
    ui.className = "wrap";
    ui.innerHTML = `
        <div class="msg" id="msg">Solve captcha first</div>
        <div class="bar-wrap" id="barwrap">
            <div class="bar" id="bar"></div>
        </div>
    `;
    shadow.appendChild(ui);
    unsafeWindow.document.documentElement.appendChild(box);

    const msg = shadow.getElementById("msg");
    const barwrap = shadow.getElementById("barwrap");
    const bar = shadow.getElementById("bar");

    function upd(txt, prog = false) {
        msg.textContent = txt;
        barwrap.style.display = prog ? "block" : "none";
    }

    function done() {
        bar.style.width = "100%";
    }

    function countdown(sec) {
        msg.textContent = `Redirecting in ${Math.ceil(sec)}`;
    }

    function tick(sec) {
        msg.textContent = `Redirecting in ${Math.ceil(sec)}`;
    }

    const NAME_MAP = {
        sendMessage: ["sendMessage", "sendMsg", "writeMessage", "writeMsg"],
        onLinkInfo: ["onLinkInfo"],
        onLinkDestination: ["onLinkDestination"]
    };

    function find(obj, names) {
        for (let i = 0; i < names.length; i++) {
            if (typeof obj[names[i]] === "function") {
                return { fn: obj[names[i]], idx: i, name: names[i] };
            }
        }
        return { fn: null, idx: -1, name: null };
    }

    let ctrl, send, info1, dest;
    let isVolcano = window.location.hostname.includes("key.volcano.wtf");
    let isWorkInk = window.location.hostname.includes("work.ink");

    function pkts() {
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

    const t0 = Date.now();

    function sendProxy() {
        const p = pkts();
        return function(...args) {
            const typ = args[0];
            const dat = args[1];

            if (typ !== p.PING) log("Send:", typ, dat);
            if (typ === p.ADBLOCKER_DETECTED) {
                warn("Block adblock msg");
                return;
            }

            if (isWorkInk && ctrl.linkInfo && (typ === p.TURNSTILE_RESPONSE || typ === p.RECAPTCHA_RESPONSE || typ === p.HCAPTCHA_RESPONSE)) {
                const ret = send.apply(this, args);
                upd("Bypassing...", true);

                for (const s of ctrl.linkInfo.socials) {
                    send.call(this, p.SOCIAL_STARTED, { url: s.url });
                }

                for (const m of ctrl.linkInfo.monetizations) {
                    switch (m) {
                        case 22:
                            send.call(this, p.MONETIZATION, {
                                type: "readArticles2",
                                payload: { event: "read" }
                            });
                            break;
                        case 25:
                            send.call(this, p.MONETIZATION, {
                                type: "operaGX",
                                payload: { event: "start" }
                            });
                            send.call(this, p.MONETIZATION, {
                                type: "operaGX",
                                payload: { event: "installClicked" }
                            });
                            fetch('https://work.ink/_api/v1/callback/operaGX', {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 'noteligible': true })
                            });
                            break;
                        case 34:
                            send.call(this, p.MONETIZATION, {
                                type: "norton",
                                payload: { event: "start" }
                            });
                            send.call(this, p.MONETIZATION, {
                                type: "norton",
                                payload: { event: "installClicked" }
                            });
                            break;
                        case 71:
                            send.call(this, p.MONETIZATION, {
                                type: "externalArticles",
                                payload: { event: "start" }
                            });
                            send.call(this, p.MONETIZATION, {
                                type: "externalArticles",
                                payload: { event: "installClicked" }
                            });
                            break;
                        case 45:
                            send.call(this, p.MONETIZATION, {
                                type: "pdfeditor",
                                payload: { event: "installed" }
                            });
                            break;
                        case 57:
                            send.call(this, p.MONETIZATION, {
                                type: "betterdeals",
                                payload: { event: "installed" }
                            });
                            break;
                        default:
                            log("Unknown monetization:", m);
                            break;
                    }
                }

                setTimeout(() => done(), 1000);
                return ret;
            }

            return send.apply(this, args);
        };
    }

    function infoProxy() {
        return function(...args) {
            const li = args[0];
            log("Link info:", li);

            Object.defineProperty(li, "isAdblockEnabled", {
                get() { return false },
                set(v) { log("Block adblock set:", v); },
                configurable: false,
                enumerable: true
            });

            return info1.apply(this, args);
        };
    }

    function redir(url) {
        upd("Redirecting...");
        setTimeout(() => { window.location.href = url; }, 500);
    }

    function startcd(url, wait) {
        countdown(wait);
        const iv = setInterval(() => {
            wait -= 1;
            if (wait > 0) {
                tick(wait);
            } else {
                clearInterval(iv);
                redir(url);
            }
        }, 1000);
    }

    function destProxy() {
        return function(...args) {
            const pl = args[0];
            log("Destination:", pl);

            const wait = 30;
            const passed = (Date.now() - t0) / 1000;

            if (passed >= wait) {
                redir(pl.url);
            } else {
                startcd(pl.url, wait - passed);
            }

            return dest.apply(this, args);
        };
    }

    function setup() {
        const s = find(ctrl, NAME_MAP.sendMessage);
        const i = find(ctrl, NAME_MAP.onLinkInfo);
        const d = find(ctrl, NAME_MAP.onLinkDestination);

        send = s.fn;
        info1 = i.fn;
        dest = d.fn;

        const sp = sendProxy();
        const ip = infoProxy();
        const dp = destProxy();

        Object.defineProperty(ctrl, s.name, {
            get() { return sp },
            set(v) { send = v },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(ctrl, i.name, {
            get() { return ip },
            set(v) { info1 = v },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(ctrl, d.name, {
            get() { return dp },
            set(v) { dest = v },
            configurable: false,
            enumerable: true
        });

        log(`Hooks: ${s.name}, ${i.name}, ${d.name}`);
    }

    function chk(t, p, v, r) {
        log("Prop set:", p, v);

        if (v && typeof v === "object" &&
            find(v, NAME_MAP.sendMessage).fn &&
            find(v, NAME_MAP.onLinkInfo).fn &&
            find(v, NAME_MAP.onLinkDestination).fn &&
            !ctrl) {
            ctrl = v;
            log("Got controller:", ctrl);
            setup();
        }

        return Reflect.set(t, p, v, r);
    }

    function compProxy(c) {
        return new Proxy(c, {
            construct(t, a) {
                const r = Reflect.construct(t, a);
                log("Component:", t, a, r);
                r.$$.ctx = new Proxy(r.$$.ctx, { set: chk });
                return r;
            }
        });
    }

    function nodeProxy(r) {
        return new Proxy(r, {
            get(t, p, rx) {
                if (p === "component") return compProxy(t.component);
                return Reflect.get(t, p, rx);
            }
        });
    }

    function makeNode(old) {
        return async (...a) => {
            const r = await old(...a);
            log("Node:", r);
            return nodeProxy(r);
        };
    }

    function kitProxy(k) {
        if (typeof k !== "object" || !k) return [false, k];

        const start = "start" in k && k.start;
        if (!start) return [false, k];

        const kp = new Proxy(k, {
            get(t, p, r) {
                if (p === "start") {
                    return function(...a) {
                        const mod = a[0];
                        const opt = a[2];

                        if (typeof mod === "object" &&
                            typeof mod.nodes === "object" &&
                            typeof opt === "object" &&
                            typeof opt.node_ids === "object") {
                            const old = mod.nodes[opt.node_ids[1]];
                            mod.nodes[opt.node_ids[1]] = makeNode(old);
                        }

                        log("kit.start:", opt);
                        return start.apply(this, a);
                    };
                }
                return Reflect.get(t, p, r);
            }
        });

        return [true, kp];
    }

    function intercept() {
        const orig = unsafeWindow.Promise.all;
        let done = false;
        unsafeWindow.Promise.all = async function(p) {
            const res = orig.call(this, p);
            if (!done) {
                done = true;
                return await new Promise((ok) => {
                    res.then(([k, a, ...rest]) => {
                        log("SvelteKit loaded");
                        const [ok2, wp] = kitProxy(k);
                        if (ok2) {
                            unsafeWindow.Promise.all = orig;
                            log("Kit ready:", wp, a);
                        }
                        ok([wp, a, ...rest]);
                    });
                });
            }
            return await res;
        };
    }

    intercept();

    const obs = new MutationObserver((muts) => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType === 1) {
                    if (n.classList?.contains("adsbygoogle")) {
                        n.remove();
                        log("Ad removed:", n);
                    }
                    n.querySelectorAll?.(".adsbygoogle").forEach((el) => {
                        el.remove();
                        log("Nested ad removed:", el);
                    });
                }
            }
        }
    });

    obs.observe(unsafeWindow.document.documentElement, { childList: true, subtree: true });

    function waitForWorkInk() {
        if (isVolcano) {
            upd("Waiting for redirect...");
            const observer = new MutationObserver((mutations) => {
                const continueButton = document.querySelector('button:contains("Continue with Work.ink")') ||
                                      document.querySelector('button:contains("Continue")');
                if (continueButton) {
                    log("Continue button detected, simulating click...");
                    continueButton.click();
                    observer.disconnect();
                    setTimeout(() => {
                        isVolcano = window.location.hostname.includes("key.volcano.wtf");
                        isWorkInk = window.location.hostname.includes("work.ink");
                        if (isWorkInk) {
                            upd("Solve captcha first");
                            log("Redirected to work.ink, proceeding with bypass");
                        }
                    }, 1000);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    waitForWorkInk();
})();
