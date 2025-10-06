(function() {
    "use strict";

    const DEBUG = false;
    const log = DEBUG ? console.log.bind(console, "[Bypass]") : () => {};
    
    // UI Setup
    const box = document.createElement("div");
    box.style.cssText = "position:fixed;top:15px;right:15px;z-index:999999";
    const shadow = box.attachShadow({ mode: "closed" });

    shadow.innerHTML = `
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            .w{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;padding:18px;width:300px;box-shadow:0 10px 40px rgba(0,0,0,.25);color:#fff;font:14px -apple-system,sans-serif}
            .h{display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.2)}
            .t{font:600 16px sans-serif;flex:1}
            .v{font-size:11px;opacity:.7}
            .s{background:rgba(255,255,255,.12);padding:12px;border-radius:8px;margin-bottom:12px}
            .m{display:flex;align-items:center;gap:6px;font-size:13px}
            .b{background:rgba(0,0,0,.15);height:4px;border-radius:4px;overflow:hidden;margin-top:10px;display:none}
            .bp{background:linear-gradient(90deg,#10b981,#06b6d4);height:100%;width:0;transition:width .3s}
            .i{background:rgba(255,255,255,.08);padding:10px;border-radius:8px;margin-bottom:10px;display:none}
            .r{display:flex;justify-content:space-between;margin:5px 0;font-size:12px}
            .l{opacity:.8}
            .va{font-weight:600}
            .f{text-align:center;padding-top:10px;border-top:1px solid rgba(255,255,255,.2);font-size:11px}
            .f a{display:inline-flex;align-items:center;gap:5px;background:#5865f2;color:#fff;padding:6px 12px;border-radius:6px;text-decoration:none;margin-top:6px;font-weight:600;transition:all .2s}
            .f a:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(88,101,242,.4)}
            .big{font-size:28px;text-align:center;margin:8px 0}
            @keyframes spin{to{transform:rotate(360deg)}}
            .spin{display:inline-block;animation:spin 1s linear infinite}
        </style>
        <div class="w">
            <div class="h">
                <span>⚡</span>
                <span class="t">Work.ink Bypass</span>
                <span class="v">v2.0</span>
            </div>
            <div class="s">
                <div class="m" id="msg">🔒 Solve captcha first</div>
                <div class="b" id="bw"><div class="bp" id="bar"></div></div>
            </div>
            <div class="i" id="info">
                <div class="r"><span class="l">Status:</span><span class="va" id="st">Waiting</span></div>
                <div class="r"><span class="l">Socials:</span><span class="va" id="soc">0</span></div>
                <div class="r"><span class="l">Offers:</span><span class="va" id="mon">0</span></div>
            </div>
            <div class="f">
                <div>by Huyyhere</div>
                <a href="https://discord.gg/WxFMRXNUuC" target="_blank">
                    <svg width="16" height="16" viewBox="0 0 71 55" fill="currentColor">
                        <path d="M60.1 4.9C55.6 2.8 50.7 1.3 45.7 0.4c-0.1 0-0.2 0-0.2 0.1c-0.6 1.1-1.3 2.6-1.8 3.8c-5.5-0.8-10.9-0.8-16.2 0c-0.5-1.2-1.2-2.6-1.8-3.8c0-0.1-0.1-0.1-0.2-0.1c-5.1 0.9-9.9 2.4-14.5 4.5c0 0-0.1 0-0.1 0.1C1.6 18.7-0.9 32.1 0.3 45.4c0 0 0 0.1 0.1 0.2c6.1 4.5 12 7.2 17.7 9c0.1 0 0.2 0 0.2-0.1c1.4-1.9 2.6-3.9 3.7-6c0.1-0.1 0-0.2-0.1-0.3c-1.9-0.7-3.8-1.6-5.5-2.6c-0.1-0.1-0.2-0.3 0-0.4c0.4-0.3 0.7-0.6 1.1-0.9c0.1-0.1 0.2-0.1 0.2 0c11.6 5.3 24.2 5.3 35.7 0c0.1 0 0.2 0 0.2 0c0.4 0.3 0.7 0.6 1.1 0.9c0.1 0.1 0.1 0.3 0 0.4c-1.8 1-3.6 1.9-5.5 2.6c-0.1 0-0.2 0.2-0.1 0.3c1.1 2.1 2.3 4.1 3.6 6c0.1 0.1 0.2 0.1 0.2 0.1c5.8-1.8 11.7-4.5 17.8-9c0.1 0 0.1-0.1 0.1-0.2c1.5-15.3-2.5-28.6-10.5-40.4C60.1 4.9 60.1 4.9 60.1 4.9z M23.7 37.3c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.4 3.2 6.4 7.2C30.1 34.1 27.3 37.3 23.7 37.3z M47.3 37.3c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.4 3.2 6.4 7.2C53.7 34.1 50.9 37.3 47.3 37.3z"/>
                    </svg>
                    Discord
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(box);

    const $ = id => shadow.getElementById(id);
    const msg = $("msg"), bar = $("bar"), bw = $("bw"), info = $("info");
    const st = $("st"), soc = $("soc"), mon = $("mon");

    const ui = {
        upd: (ico, txt, prog = false) => {
            msg.innerHTML = `${ico} ${txt}`;
            bw.style.display = prog ? "block" : "none";
        },
        show: (s, m) => {
            info.style.display = "block";
            st.textContent = "Bypassing";
            soc.textContent = s;
            mon.textContent = m;
        },
        done: () => {
            bar.style.width = "100%";
            st.textContent = "Done ✓";
        },
        countdown: sec => {
            const s = $("msg").parentElement;
            s.innerHTML = `<div class="big">✅</div><div class="m" style="justify-content:center">Redirect in</div><div class="big" id="cd">${Math.ceil(sec)}</div>`;
            const iv = setInterval(() => {
                sec -= 1;
                const cd = $("cd");
                if (sec > 0 && cd) cd.textContent = Math.ceil(sec);
                else { clearInterval(iv); location.href = ui.url; }
            }, 1000);
        }
    };

    // Packet types
    const PKT = {
        ANNOUNCE: "c_announce",
        MONETIZATION: "c_monetization",
        SOCIAL_STARTED: "c_social_started",
        TURNSTILE_RESPONSE: "c_turnstile_response",
        ADBLOCKER_DETECTED: "c_adblocker_detected",
        PING: "c_ping"
    };

    // Monetization handlers
    const MON = {
        22: (send) => send(PKT.MONETIZATION, { type: "readArticles2", payload: { event: "read" } }),
        25: (send) => {
            send(PKT.MONETIZATION, { type: "operaGX", payload: { event: "start" } });
            send(PKT.MONETIZATION, { type: "operaGX", payload: { event: "installClicked" } });
            fetch('https://work.ink/_api/v1/callback/operaGX', {
                method: 'POST', mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteligible: true })
            });
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

    let ctrl, sendFn, t0 = Date.now();

    // Find controller methods
    const find = (obj, names) => names.map(n => obj[n]).find(f => typeof f === "function");

    // Setup hooks
    const setup = () => {
        const origSend = find(ctrl, ["sendMessage", "sendMsg", "writeMessage"]);
        const origInfo = find(ctrl, ["onLinkInfo"]);
        const origDest = find(ctrl, ["onLinkDestination"]);

        sendFn = origSend;

        // Hook sendMessage
        Object.defineProperty(ctrl, Object.keys(ctrl).find(k => ctrl[k] === origSend), {
            get: () => function(...args) {
                const [typ, dat] = args;
                if (typ !== PKT.PING) log("Send:", typ, dat);
                if (typ === PKT.ADBLOCKER_DETECTED) return;

                if (ctrl.linkInfo && typ === PKT.TURNSTILE_RESPONSE) {
                    const ret = origSend.apply(this, args);
                    ui.upd("⚡", "Captcha solved! Bypassing...", true);

                    const { socials, monetizations } = ctrl.linkInfo;
                    ui.show(socials.length, monetizations.length);

                    socials.forEach(s => sendFn.call(this, PKT.SOCIAL_STARTED, { url: s.url }));
                    monetizations.forEach(m => MON[m]?.(sendFn.bind(this)) || log("Unknown:", m));

                    setTimeout(ui.done, 1000);
                    return ret;
                }
                return origSend.apply(this, args);
            },
            configurable: false
        });

        // Hook onLinkInfo
        Object.defineProperty(ctrl, Object.keys(ctrl).find(k => ctrl[k] === origInfo), {
            get: () => function(...args) {
                log("Link info:", args[0]);
                Object.defineProperty(args[0], "isAdblockEnabled", {
                    get: () => false,
                    set: () => {},
                    configurable: false
                });
                return origInfo.apply(this, args);
            },
            configurable: false
        });

        // Hook onLinkDestination
        Object.defineProperty(ctrl, Object.keys(ctrl).find(k => ctrl[k] === origDest), {
            get: () => function(...args) {
                log("Dest:", args[0]);
                ui.url = args[0].url;
                const wait = 30 - (Date.now() - t0) / 1000;
                wait > 0 ? ui.countdown(wait) : location.href = ui.url;
                return origDest.apply(this, args);
            },
            configurable: false
        });

        log("Hooks ready");
    };

    // Intercept controller
    const intercept = () => {
        const origAll = Promise.all;
        let done = false;
        Promise.all = async function(p) {
            const res = origAll.call(this, p);
            if (!done) {
                done = true;
                return new Promise(ok => {
                    res.then(([kit, ...rest]) => {
                        if (kit?.start) {
                            const origStart = kit.start;
                            kit.start = function(...args) {
                                const [mod, , opt] = args;
                                if (mod?.nodes && opt?.node_ids) {
                                    const origNode = mod.nodes[opt.node_ids[1]];
                                    mod.nodes[opt.node_ids[1]] = async (...a) => {
                                        const r = await origNode(...a);
                                        if (r.component) {
                                            const origComp = r.component;
                                            r.component = new Proxy(origComp, {
                                                construct(t, a) {
                                                    const inst = Reflect.construct(t, a);
                                                    inst.$$.ctx = new Proxy(inst.$$.ctx, {
                                                        set(t, p, v) {
                                                            if (v && typeof v === "object" && 
                                                                find(v, ["sendMessage"]) && !ctrl) {
                                                                ctrl = v;
                                                                log("Controller found");
                                                                setup();
                                                            }
                                                            return Reflect.set(t, p, v);
                                                        }
                                                    });
                                                    return inst;
                                                }
                                            });
                                        }
                                        return r;
                                    };
                                }
                                return origStart.apply(this, args);
                            };
                        }
                        Promise.all = origAll;
                        ok([kit, ...rest]);
                    });
                });
            }
            return res;
        };
    };

    intercept();

    // Remove ads
    new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(n => {
                if (n.classList?.contains("adsbygoogle")) n.remove();
                n.querySelectorAll?.(".adsbygoogle").forEach(el => el.remove());
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true });

})();
