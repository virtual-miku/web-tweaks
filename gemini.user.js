// ==UserScript==
// @name         Google Gemini
// @namespace    github.com/virtualmiku
// @version      1.0.0
// @description  Custom script for Gemini
// @author       miku.my.id
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    models: {
      lite: "Kohane",
      flash: "Kanade",
      pro: "Miku",
      default: "Kanade",
    },
    thinkingLabel: "Level Max",
    thinkingKeywords: ["mendalam", "reasoning", "thinking"],
  };

  let targetObserver = null;
  let activeModel =
    localStorage.getItem("miku_active_model") || CONFIG.models.default;

  document.addEventListener("click", (e) => {
    const menuItem = e.target.closest("gem-menu-item");
    if (menuItem) {
      const text = menuItem.textContent.toLowerCase();
      if (
        text.includes("lite") ||
        text.includes(CONFIG.models.lite.toLowerCase())
      ) {
        activeModel = CONFIG.models.lite;
      } else if (
        text.includes("pro") ||
        text.includes("advanced") ||
        text.includes(CONFIG.models.pro.toLowerCase())
      ) {
        activeModel = CONFIG.models.pro;
      } else if (
        text.includes("flash") ||
        text.includes(CONFIG.models.flash.toLowerCase())
      ) {
        activeModel = CONFIG.models.flash;
      }

      localStorage.setItem("miku_active_model", activeModel);
      updatePill();
    }
  });

  function updatePill() {
    const container = document.querySelector(".logo-pill-label-container");
    if (!container) return;

    if (!targetObserver) {
      targetObserver = new MutationObserver(() => updatePill());
      targetObserver.observe(container, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    const primaryEl = container.querySelector(".picker-primary-text");
    const secondaryEl = container.querySelector(".picker-secondary-text");

    let modelName = activeModel;
    let isThinking = false;

    if (primaryEl) {
      const rawPrimary = primaryEl.textContent.toLowerCase();
      if (rawPrimary.includes("lite")) {
        modelName = CONFIG.models.lite;
        activeModel = modelName;
      } else if (
        rawPrimary.includes("pro") ||
        rawPrimary.includes("advanced")
      ) {
        modelName = CONFIG.models.pro;
        activeModel = modelName;
      } else if (rawPrimary.includes("flash")) {
        modelName = CONFIG.models.flash;
        activeModel = modelName;
      }
    }

    if (secondaryEl) {
      const rawSecondary = secondaryEl.textContent.toLowerCase();
      isThinking = CONFIG.thinkingKeywords.some((kw) =>
        rawSecondary.includes(kw),
      );
    }

    let customPill = document.getElementById("miku-custom-pill");
    if (!customPill) {
      customPill = document.createElement("div");
      customPill.id = "miku-custom-pill";
      const modelSpan = document.createElement("span");
      modelSpan.className = "miku-pill-model";
      const thinkingSpan = document.createElement("span");
      thinkingSpan.className = "miku-pill-thinking";
      customPill.appendChild(modelSpan);
      customPill.appendChild(thinkingSpan);
      container.insertBefore(customPill, container.firstChild);
    }

    const modelSpan = customPill.querySelector(".miku-pill-model");
    const thinkingSpan = customPill.querySelector(".miku-pill-thinking");

    if (modelSpan && modelSpan.textContent !== modelName) {
      modelSpan.textContent = modelName;
    }

    const targetThinking = isThinking ? CONFIG.thinkingLabel : "";
    if (thinkingSpan && thinkingSpan.textContent !== targetThinking) {
      thinkingSpan.textContent = targetThinking;
    }

    if (primaryEl) primaryEl.style.display = "none";
    if (secondaryEl) secondaryEl.style.display = "none";
  }

  const globalObserver = new MutationObserver(() => {
    const container = document.querySelector(".logo-pill-label-container");
    if (container) updatePill();
  });

  globalObserver.observe(document.body, { childList: true, subtree: true });
  updatePill();
})();
