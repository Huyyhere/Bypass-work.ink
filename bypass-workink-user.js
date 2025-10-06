// ==UserScript==
// @name         Bypass Work.ink Huyyhere
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ultimate bypasses work.ink with auto-update check
// @author       huyyhere
// @match        https://*.work.ink/*
// @match        https://workink.click/*
// @match        *://*/direct/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=work.ink
// @run-at       document-start
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/Huyyhere/Bypass-work.ink/refs/heads/main/scripts.js
// @downloadURL  https://raw.githubusercontent.com/Huyyhere/Bypass-work.ink/refs/heads/main/scripts.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @resource     NOTYF_CSS https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css
// ==/UserScript==

(function() {
    'use strict';
    const notyfCss = GM_getResourceText("NOTYF_CSS");
    GM_addStyle(notyfCss);
    const notyf = new Notyf({ duration: 5000 });
    notyf.success("Load thành công");
    const UPDATE_URL = "https://raw.githubusercontent.com/Huyyhere/Bypass-work.ink/refs/heads/main/version.txt";
    const CURRENT_VERSION = "1.0.0";
    const CHECK_INTERVAL = 24 * 60 * 60 * 1000;
    async function checkForUpdate() {
        const lastCheck = GM_getValue("lastCheck", 0);
        const now = Date.now();
        if (now - lastCheck < CHECK_INTERVAL) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: UPDATE_URL,
            onload: function(response) {
                const latestVersion = response.responseText.trim();
                if (latestVersion > CURRENT_VERSION) {
                    notyf.success(`New version ${latestVersion} available! Update at: <a href="https://greasyfork.org/en/scripts/xxx">GreasyFork</a>`);
                }
                GM_setValue("lastCheck", now);
            },
            onerror: function() {
                notyf.error("Failed to check for updates.");
            }
        });
    }
    function bypassWorkInk() {
        if (window.location.hostname.includes("r.")) {
            window.location.hostname = window.location.hostname.replace("r.", "");
            return;
        }
        if (window.location.hostname.includes("work.ink")) {
            const pathParts = decodeURIComponent(window.location.pathname.slice(1)).split("/");
            const [encodedUserId, linkCustom] = pathParts.slice(-2);
            try {
                const link = atob(linkCustom).split(" ").slice(-1)[0];
                window.location.replace(link);
            } catch (e) {
                notyf.error("Failed to bypass work.ink link.");
                console.error("Bypass error:", e);
            }
        }
    }
    checkForUpdate();
    bypassWorkInk();
})();
