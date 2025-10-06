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

    // Simple GUI
    const box = unsafeWindow.document.createElement("div");
    box.style.cssText = "position:fixed;top:15px;right:15px;z-index:999999";
    const shadow = box.attachShadow({ mode: "closed" });

    const css = unsafeWindow.document.createElement("style");
    css.textContent = `
        *{margin:0;padding:0;box-sizing:border-box}
        .wrap{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;padding:15px;width:280px;box-shadow:0 8px 30px rgba(0,0,0,.3);color:#fff;font-family:system-ui,sans-serif;font-size:13px}
        .hd{display:flex;align-items:center;gap:6px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.2)}
        .title{font-size:15px;font-weight:600;flex:1}
        .ver{font-size:10px;opacity:.7}
        .status{background:rgba(255,255,255,.12);padding:10px;border-radius:6px;margin-bottom:10px}
        .msg{font-size:12px}
        .bar-wrap{background:rgba(0,0,0,.15);height:3px;border-radius:3px;overflow:hidden;margin-top:8px;display:none}
        .bar{background:linear-gradient(90deg,#10b981,#06b6d4);height:100%;width:0;transition:width .3s}
        .info{background:rgba(255,255,255,.08);padding:8px;border-radius:6px;margin-bottom:8px;display:none}
        .row{display:flex;justify-content:space-between;margin:4px 0;font-size:11px}
        .lbl{opacity:.8}
        .val{font-weight:600}
        .ft{text-align:center;padding-top:8px;border-top:1px solid rgba(255,255,255,.2);font-size:10px}
        .big{font-size:24px;text-align:center;margin:6px 0;font-weight:700}
    `;
    shadow.appendChild(css);

    const ui = unsafeWindow.document.createElement("div");
    ui.className = "wrap";
    ui.innerHTML = `
        <div class="hd">
            <span class="title">Work.ink Bypass</span>
            <span class="ver">v1.0.0</span>
        </div>
        <div class="status">
            <div class="msg" id="msg">Solve captcha first</div>
            <div class="bar-wrap" id="barwrap">
                <div class="bar" id="bar"></div>
            </div>
        </div>
        <div class="info" id="info">
            <div class="row">
                <span class="lbl">Status:</span>
                <span class="val" id="st">Waiting</span>
            </div>
            <div class="row">
                <span class="lbl">Socials:</span>
                <span class="val" id="soc">0</span>
            </div>
            <div class="row">
                <span class="lbl">Offers:</span>
                <span class="val" id="mon">0</span>
            </div>
        </div>
        <div class="ft">by Huyyhere</div>
    `;

    shadow.appendChild(ui);
    unsafeWindow.document.documentElement.appendChild(box);

    const msg = shadow.getElementById("msg");
    const barwrap = shadow.getElementById("barwrap");
    const bar = shadow.getElementById("bar");
    const info = shadow.getElementById("info");
    const st = shadow.getElementById("st");
    const soc = shadow.getElementById("soc");
    const mon = shadow.getElementById("mon");

    function upd(txt, prog = false) {
        msg.textContent = txt;
        barwrap.style.display = prog ? "block" : "none";
    }

    function show(s, m) {
        info.style.display = "block";
        st.textContent = "Bypassing";
        soc.textContent = s;
        mon.textContent = m;
    }

    function done() {
        bar.style.width = "100%";
        st.textContent = "Done";
    }

    function countdown(sec) {
        shadow.querySelector(".status").innerHTML = `
            <div class="msg">Redirecting in</div>
            <div class="big" id="cd">${Math.ceil(sec)}</div>
        `;
    }

    function tick(sec) {
        const cd = shadow.getElementById("cd");
        if (cd) cd.textContent = Math.ceil(sec);
    }

    const NAME_MAP = {
        sendMessage: ["sendMessage", "sendMsg", "writeMessage", "writeMsg"],
        onLinkInfo: ["onLinkInfo"],
        onLinkDestination: ["onLinkDestination"]
    };

    function find(obj, names) {
        for (let i = 0; i < names.length; i++) {
            const n = names[i];
            if (typeof obj[n] === "function") {
                return { fn: obj[n], idx: i, name: n };
            }
        }
        return { fn: null, idx: -1, name: null };
    }

    let ctrl, send, info1, dest;

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

            if (ctrl.linkInfo && typ === p.TURNSTILE_RESPONSE) {
                const ret = send.apply(this, args);
                upd("Bypassing...", true);

                const sc = ctrl.linkInfo.socials.length;
                const mc = ctrl.linkInfo.monetizations.length;
                show(sc, mc);

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
})();
