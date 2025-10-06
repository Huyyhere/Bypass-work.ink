(function() {
    "use strict";

    const isVolcano = location.hostname.includes("key.volcano.wtf");
    const isWorkink = location.hostname.includes("work.ink");

    function createUI(color, title) {
        const box = document.createElement("div");
        box.style.cssText = "position:fixed;top:20px;right:20px;z-index:999999";
        const shadow = box.attachShadow({ mode: "closed" });

        const css = document.createElement("style");
        css.textContent = `
            *{margin:0;padding:0;box-sizing:border-box}
            .ui{background:${color};border-radius:8px;padding:12px 16px;width:240px;box-shadow:0 4px 12px rgba(0,0,0,.2);color:#fff;font:13px system-ui,sans-serif}
            .title{font-size:14px;font-weight:600;margin-bottom:8px;opacity:.95}
            .msg{font-size:12px;opacity:.85;margin-bottom:8px}
            .bar{background:rgba(255,255,255,.2);height:3px;border-radius:2px;overflow:hidden}
            .fill{background:#fff;height:100%;width:0;transition:width .3s}
            .info{margin-top:8px;font-size:11px;opacity:.75;display:none}
            .row{display:flex;justify-content:space-between;margin:3px 0}
            .cd{font-size:28px;font-weight:700;text-align:center;margin:8px 0}
        `;
        shadow.appendChild(css);

        const ui = document.createElement("div");
        ui.className = "ui";
        ui.innerHTML = `
            <div class="title">${title}</div>
            <div class="msg" id="msg">Initializing...</div>
            <div class="bar"><div class="fill" id="bar"></div></div>
            <div class="info" id="info"></div>
        `;
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
        const ui = createUI("linear-gradient(135deg,#1e293b,#0f172a)", "Auto Redirect");

        function wait() {
            return new Promise(r => {
                if (document.readyState !== "loading") r();
                else window.addEventListener("load", r);
            });
        }

        function check() {
            const btn = document.querySelector("#primaryButton");
            if (btn && !btn.disabled && btn.textContent.includes("Continue")) {
                ui.upd("Clicking...", 90);
                btn.click();
                setTimeout(() => {
                    if (location.hostname.includes("volcano")) {
                        ui.upd("Retrying...", 60);
                        setTimeout(monitor, 3000);
                    } else {
                        ui.upd("Complete ✓", 100);
                    }
                }, 2000);
                return true;
            }
            return false;
        }

        async function monitor() {
            ui.upd("Loading...", 20);
            await wait();
            ui.upd("Scanning...", 40);

            const iv = setInterval(() => {
                if (check()) {
                    clearInterval(iv);
                } else {
                    const cap = document.querySelector('iframe[src*="cloudflare"]');
                    if (cap) ui.upd("Solve CAPTCHA...", 30);
                }
            }, 1000);

            const og = unsafeWindow.fetch;
            unsafeWindow.fetch = function(...a) {
                if (a[0]?.includes?.("work.ink")) {
                    ui.upd("Redirecting...", 85);
                    setTimeout(check, 1000);
                }
                return og.apply(this, a);
            };
        }

        monitor();
    }

    if (isWorkink) {
        const ui = createUI("linear-gradient(135deg,#6366f1,#8b5cf6)", "Work.ink Bypass");

        const MAP = {
            send: ["sendMessage", "sendMsg", "writeMessage"],
            info: ["onLinkInfo"],
            dest: ["onLinkDestination"]
        };

        function find(o, n) {
            for (let i of n) {
                if (typeof o[i] === "function") return { fn: o[i], name: i };
            }
            return { fn: null, name: null };
        }

        let ctrl, send, info, dest;
        const t0 = Date.now();

        function pkts() {
            return {
                MON: "c_monetization",
                SOC: "c_social_started",
                TURN: "c_turnstile_response",
                AD: "c_adblocker_detected",
                PING: "c_ping"
            };
        }

        function proxy() {
            const p = pkts();
            return function(...a) {
                const [t, d] = a;
                
                if (t === p.AD) return;

                if (ctrl.linkInfo && t === p.TURN) {
                    const ret = send.apply(this, a);
                    ui.upd("Bypassing...", 50);

                    const sc = ctrl.linkInfo.socials.length;
                    const mc = ctrl.linkInfo.monetizations.length;
                    
                    ui.show(`
                        <div class="row"><span>Status:</span><span>Active</span></div>
                        <div class="row"><span>Socials:</span><span>${sc}</span></div>
                        <div class="row"><span>Offers:</span><span>${mc}</span></div>
                    `);

                    ctrl.linkInfo.socials.forEach(s => {
                        send.call(this, p.SOC, { url: s.url });
                    });

                    ctrl.linkInfo.monetizations.forEach(m => {
                        const types = {
                            22: [["readArticles2", { event: "read" }]],
                            25: [
                                ["operaGX", { event: "start" }],
                                ["operaGX", { event: "installClicked" }]
                            ],
                            34: [
                                ["norton", { event: "start" }],
                                ["norton", { event: "installClicked" }]
                            ],
                            71: [
                                ["externalArticles", { event: "start" }],
                                ["externalArticles", { event: "installClicked" }]
                            ],
                            45: [["pdfeditor", { event: "installed" }]],
                            57: [["betterdeals", { event: "installed" }]]
                        };

                        (types[m] || []).forEach(([type, payload]) => {
                            send.call(this, p.MON, { type, payload });
                        });

                        if (m === 25) {
                            fetch('https://work.ink/_api/v1/callback/operaGX', {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ noteligible: true })
                            });
                        }
                    });

                    setTimeout(() => ui.upd("Done ✓", 100), 1000);
                    return ret;
                }

                return send.apply(this, a);
            };
        }

        function infoProxy() {
            return function(...a) {
                Object.defineProperty(a[0], "isAdblockEnabled", {
                    get: () => false,
                    set: () => {},
                    configurable: false
                });
                return info.apply(this, a);
            };
        }

        function destProxy() {
            return function(...a) {
                const url = a[0].url;
                const wait = 30;
                const passed = (Date.now() - t0) / 1000;
                const left = Math.max(0, wait - passed);

                if (left === 0) {
                    ui.upd("Redirecting...", 100);
                    setTimeout(() => location.href = url, 500);
                } else {
                    ui.show(`<div class="cd" id="cd">${Math.ceil(left)}</div>`);
                    ui.upd("Redirecting in", 100);
                    
                    const iv = setInterval(() => {
                        const cd = ui.info.querySelector("#cd");
                        const t = Math.max(0, left - (Date.now() - t0) / 1000 + passed);
                        if (t > 0 && cd) {
                            cd.textContent = Math.ceil(t);
                        } else {
                            clearInterval(iv);
                            location.href = url;
                        }
                    }, 1000);
                }

                return dest.apply(this, a);
            };
        }

        function setup() {
            const s = find(ctrl, MAP.send);
            const i = find(ctrl, MAP.info);
            const d = find(ctrl, MAP.dest);

            send = s.fn;
            info = i.fn;
            dest = d.fn;

            Object.defineProperty(ctrl, s.name, {
                get: () => proxy(),
                set: v => send = v,
                configurable: false
            });

            Object.defineProperty(ctrl, i.name, {
                get: () => infoProxy(),
                set: v => info = v,
                configurable: false
            });

            Object.defineProperty(ctrl, d.name, {
                get: () => destProxy(),
                set: v => dest = v,
                configurable: false
            });
        }

        function hook(t, p, v, r) {
            if (v && typeof v === "object" &&
                find(v, MAP.send).fn &&
                find(v, MAP.info).fn &&
                find(v, MAP.dest).fn && !ctrl) {
                ctrl = v;
                setup();
            }
            return Reflect.set(t, p, v, r);
        }

        const og = unsafeWindow.Promise.all;
        let hooked = false;

        unsafeWindow.Promise.all = async function(p) {
            const res = og.call(this, p);
            if (!hooked) {
                hooked = true;
                return new Promise(ok => {
                    res.then(([k, ...rest]) => {
                        if (k?.start) {
                            const ogStart = k.start;
                            k.start = function(...a) {
                                const [m, , o] = a;
                                if (m?.nodes && o?.node_ids) {
                                    const ogNode = m.nodes[o.node_ids[1]];
                                    m.nodes[o.node_ids[1]] = async (...na) => {
                                        const r = await ogNode(...na);
                                        if (r.component) {
                                            const ogComp = r.component;
                                            r.component = new Proxy(ogComp, {
                                                construct(t, a) {
                                                    const inst = Reflect.construct(t, a);
                                                    inst.$$.ctx = new Proxy(inst.$$.ctx, { set: hook });
                                                    return inst;
                                                }
                                            });
                                        }
                                        return r;
                                    };
                                }
                                return ogStart.apply(this, a);
                            };
                            unsafeWindow.Promise.all = og;
                        }
                        ok([k, ...rest]);
                    });
                });
            }
            return res;
        };

        new MutationObserver(m => {
            m.forEach(({ addedNodes }) => {
                addedNodes.forEach(n => {
                    if (n.nodeType === 1) {
                        if (n.classList?.contains("adsbygoogle")) n.remove();
                        n.querySelectorAll?.(".adsbygoogle").forEach(e => e.remove());
                    }
                });
            });
        }).observe(document.documentElement, { childList: true, subtree: true });
    }
})();
