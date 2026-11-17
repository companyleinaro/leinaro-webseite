/* ==========================================================================
   Leinaro – Website v3
   Wird im <head> ohne "defer" geladen: Abschnitt 0 setzt sofort die
   Klassen für die Scroll-Story (kein Springen beim Laden, kein Inline-Skript
   wegen der Content-Security-Policy). Alles Weitere startet nach dem Laden.

   0. Sofort: Klassen setzen
   1. Hilfsfunktionen
   2. Header (Farbe je Hintergrund, kompakt beim Scrollen)
   3. Navigation (Leistungs-Untermenü, mobiles Menü)
   4. Scroll-Story (Startseite)
   5. Parallax Unterseiten-Hero
   6. Reveal-Animationen
   7. Kontaktformular (Web3Forms)
   8. Datenschutzhinweis
   9. Kleinigkeiten (Anker auf Akkordeons, Jahreszahl)
   ========================================================================== */

/* === 0. SOFORT: KLASSEN SETZEN === */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("story-on");
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* === 1. HILFSFUNKTIONEN === */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const round = (value) => Math.round(value * 1000) / 1000;

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); return true; } catch (e) { return false; }
    }
  };

  /* === 2a. ÜBERSCHRIFTEN EINPASSEN === */
  // Große Überschriften dürfen nie mitten im Wort umbrechen. Ist das längste
  // Wort breiter als die Zeile, wird die Schrift für dieses Element verkleinert.
  // Hero-Überschriften werden zusätzlich so begrenzt, dass sie nie unter die
  // Navigation reichen (niedrige Laptop-Fenster, Handys im Querformat).
  const fitTargets = Array.from(document.querySelectorAll(
    ".display, .h-xl, .h-lg, .statement, .service-row__title, .work-card__title, .package h3, .mobile-menu__list > li > a, .quote blockquote"
  ));
  const measureCanvas = document.createElement("canvas").getContext("2d");

  function widestWord(el, style) {
    const size = parseFloat(style.fontSize);
    measureCanvas.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
    const spacing = parseFloat(style.letterSpacing) || 0;
    return el.textContent.split(/[\s ]+/).reduce((max, word) => {
      if (!word) return max;
      return Math.max(max, measureCanvas.measureText(word).width + spacing * word.length);
    }, 0);
  }

  function fitHeadings() {
    fitTargets.forEach((el) => { el.style.fontSize = ""; });
    // Erst alles lesen, dann schreiben (kein Layout-Flackern)
    const plan = fitTargets.map((el) => {
      const style = getComputedStyle(el);
      const avail = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      if (!avail || avail < 40) return null;
      const widest = widestWord(el, style);
      if (widest <= avail) return null;
      return parseFloat(style.fontSize) * (avail / widest) * 0.97;
    });
    plan.forEach((size, i) => { if (size) fitTargets[i].style.fontSize = size + "px"; });

    // Hero: Abstand zur Navigation sichern
    const headerHeight = header ? header.offsetHeight : 80;
    document.querySelectorAll(".scene__title").forEach((title) => {
      const content = title.closest(".scene__content");
      if (!content) return;
      for (let i = 0; i < 10 && content.offsetTop < headerHeight + 16; i++) {
        title.style.fontSize = parseFloat(getComputedStyle(title).fontSize) * 0.92 + "px";
      }
    });
  }

  /* === 2. HEADER === */
  const header = document.querySelector(".site-header");
  const themedSections = Array.from(document.querySelectorAll("[data-header]"));
  let sectionBounds = [];
  let headerTheme = "";
  let headerScrolled = null;
  let headerHidden = false;
  let lastScrollY = window.scrollY;

  function measureHeader() {
    const y = window.scrollY;
    sectionBounds = themedSections.map((section) => {
      const rect = section.getBoundingClientRect();
      return { top: rect.top + y, bottom: rect.bottom + y, theme: section.dataset.header };
    });
  }

  function updateHeader(y) {
    if (!header) return;
    const probe = y + 34;
    let theme = "light";
    for (const bounds of sectionBounds) {
      if (bounds.top <= probe && bounds.bottom > probe) {
        theme = bounds.theme;
        break;
      }
    }
    if (theme !== headerTheme) {
      headerTheme = theme;
      header.classList.toggle("is-light", theme === "light");
    }
    const scrolled = y > 40;
    if (scrolled !== headerScrolled) {
      headerScrolled = scrolled;
      header.classList.toggle("is-scrolled", scrolled);
    }

    // Runterscrollen: ausblenden. Hochscrollen: sofort wieder zeigen.
    const delta = y - lastScrollY;
    if (Math.abs(delta) > 6 || y <= 120) {
      const menuBusy = document.body.classList.contains("menu-open") ||
        subItems.some((item) => item.classList.contains("is-open"));
      const hide = y > 120 && delta > 0 && !menuBusy;
      if (hide !== headerHidden) {
        headerHidden = hide;
        header.classList.toggle("is-hidden", hide);
      }
      lastScrollY = y;
    }
  }

  /* === 3. NAVIGATION === */
  // Leistungs-Untermenü: per Klick/Touch und Tastatur bedienbar, nicht nur per Hover
  const subItems = Array.from(document.querySelectorAll(".nav__item--sub"));

  function closeSubmenus(except) {
    subItems.forEach((item) => {
      if (item === except) return;
      item.classList.remove("is-open");
      const btn = item.querySelector("[aria-expanded]");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  subItems.forEach((item) => {
    const btn = item.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      closeSubmenus(item);
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav__item--sub")) closeSubmenus();
  });

  // Mobiles Menü
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.inert = !open;
    if (open) {
      const firstLink = mobileMenu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  if (menuToggle && mobileMenu) {
    mobileMenu.inert = true;
    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080 && document.body.classList.contains("menu-open")) setMenu(false);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.body.classList.contains("menu-open")) {
      setMenu(false);
      menuToggle.focus();
    }
    closeSubmenus();
  });

  /* === 4. SCROLL-STORY === */
  const story = document.querySelector(".story");
  const scenes = story ? Array.from(story.querySelectorAll(".scene")) : [];
  const stage = story ? story.querySelector(".story__stage") : null;
  const storyCount = story ? story.querySelector(".story__count") : null;
  const storyProgress = story ? story.querySelector(".story__progress") : null;
  const btnUp = story ? story.querySelector(".story__btn--up") : null;
  const btnDown = story ? story.querySelector(".story__btn--down") : null;
  const storyActive = Boolean(story && scenes.length > 1 && !reducedMotion);
  const sceneState = scenes.map(() => ({ lp: null, op: null, visible: null }));
  let currentScene = -1;
  let storyTop = 0;
  let stageHeight = 1;
  let storyRange = 1;

  if (story && !storyActive) document.documentElement.classList.remove("story-on");
  if (storyActive) story.style.setProperty("--scenes", scenes.length);

  function measureStory() {
    if (!storyActive) return;
    storyTop = story.getBoundingClientRect().top + window.scrollY;
    stageHeight = stage.offsetHeight || window.innerHeight;
    storyRange = Math.max(story.offsetHeight - stageHeight, 1);
  }

  function updateStory(y) {
    if (!storyActive) return;
    const offset = y - storyTop;
    if (offset > storyRange + stageHeight) return;

    const progress = clamp(offset / stageHeight, 0, scenes.length - 1);
    // Weiche Überblendung (Smoothstep) über einen längeren Abschnitt
    const opacities = scenes.map((scene, index) => {
      if (index === 0) return 1;
      const t = clamp((progress - (index - 0.8)) / 0.65, 0, 1);
      return t * t * (3 - 2 * t);
    });

    scenes.forEach((scene, index) => {
      const state = sceneState[index];
      const lp = round(clamp(progress - index, -1, 1));
      const op = round(opacities[index]);
      // Komplett verdeckte oder ausgeblendete Szenen nicht zeichnen
      const covered = opacities.slice(index + 1).some((value) => value >= 1);
      const visible = op > 0 && !covered;
      if (lp !== state.lp) { state.lp = lp; scene.style.setProperty("--lp", lp); }
      if (op !== state.op) { state.op = op; scene.style.setProperty("--op", op); }
      if (visible !== state.visible) {
        state.visible = visible;
        scene.style.visibility = visible ? "visible" : "hidden";
      }
    });

    const active = Math.round(progress);
    if (active !== currentScene) {
      currentScene = active;
      scenes.forEach((scene, index) => {
        const isActive = index === active;
        scene.classList.toggle("is-active", isActive);
        scene.setAttribute("aria-hidden", String(!isActive));
        scene.querySelectorAll("a, button").forEach((el) => { el.tabIndex = isActive ? 0 : -1; });
      });
      if (storyCount) {
        storyCount.textContent = String(active + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
      }
      if (btnUp) btnUp.disabled = active === 0;
    }

    if (storyProgress) storyProgress.style.setProperty("--progress", round(clamp(offset / storyRange, 0, 1)));
  }

  function goToScene(index) {
    if (index >= scenes.length) {
      window.scrollTo({ top: storyTop + story.offsetHeight, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: storyTop + clamp(index, 0, scenes.length - 1) * stageHeight, behavior: "smooth" });
  }

  if (storyActive) {
    if (btnUp) btnUp.addEventListener("click", () => goToScene(currentScene - 1));
    if (btnDown) btnDown.addEventListener("click", () => goToScene(currentScene + 1));
    // Alle Szenenbilder vorab dekodieren, damit beim ersten Überblenden nichts stockt
    scenes.forEach((scene) => {
      const img = scene.querySelector("img");
      if (img && img.decode) img.decode().catch(() => {});
    });
  }

  /* === 5. PARALLAX UNTERSEITEN-HERO === */
  const pageHero = document.querySelector(".page-hero");
  let heroTop = 0;
  let heroHeight = 1;
  let heroLp = null;

  function measurePageHero() {
    if (!pageHero) return;
    heroTop = pageHero.getBoundingClientRect().top + window.scrollY;
    heroHeight = pageHero.offsetHeight || 1;
  }

  function updatePageHero(y) {
    if (!pageHero || reducedMotion) return;
    const lp = round(clamp((y - heroTop) / heroHeight, 0, 1));
    if (lp !== heroLp) {
      heroLp = lp;
      pageHero.style.setProperty("--lp", lp);
    }
  }

  // Gemeinsamer Takt: Scroll-Events pro Bild bündeln, beim Scrollen nichts vermessen.
  // Die Scroll-Story folgt der Scrollposition mit leichter Trägheit: Mausrad-
  // Sprünge werden so zu einer durchgehend flüssigen Überblendung.
  let frameRequested = false;
  let storyY = window.scrollY;
  let lastFrame = 0;

  function render(now) {
    frameRequested = false;
    const y = window.scrollY;
    if (storyActive) {
      const dt = lastFrame ? Math.min(now - lastFrame, 64) : 16.7;
      const follow = 1 - Math.pow(1 - 0.14, dt / 16.7);
      storyY += (y - storyY) * follow;
      if (Math.abs(y - storyY) < 0.5) storyY = y;
      updateStory(storyY);
      if (storyY !== y) requestFrame();
    }
    lastFrame = storyY !== y ? now : 0;
    updatePageHero(y);
    updateHeader(y);
  }

  function requestFrame() {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(render);
  }

  function measureAll() {
    fitHeadings();
    measureHeader();
    measureStory();
    measurePageHero();
    storyY = window.scrollY;
    render(performance.now());
  }

  let resizeTimer = 0;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measureAll, 120);
  }

  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", measureAll);
  document.addEventListener("toggle", measureAll, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureAll);
  measureAll();

  /* === 6. REVEAL-ANIMATIONEN === */
  const revealItems = document.querySelectorAll(".reveal");
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* === 7. KONTAKTFORMULAR (WEB3FORMS) === */
  // Versand per fetch, Besucher bleibt auf der Seite, Bestätigung direkt im Formular.
  const form = document.querySelector(".contact-form");
  if (form) {
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.querySelector("span");
    const status = form.querySelector(".contact-form__status");
    const honeypot = form.elements.namedItem("botcheck");
    const requiredTextFields = ["name", "email", "message"].map((name) => form.elements.namedItem(name));
    const originalButtonText = buttonLabel.textContent;
    let sending = false;

    const clean = (value) => String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    const makeSubject = (name, service) => {
      // Name wird als "Vorname Nachname" erfasst – Betreff: "Nachname Vorname"
      const parts = clean(name).split(" ");
      const lastName = parts.pop();
      const subjectName = [lastName, parts.join(" ")].filter(Boolean).join(" ");
      return `Projektanfrage - ${subjectName} ${clean(service) || "Allgemeine Anfrage"}`;
    };

    const showStatus = (state, message) => {
      status.dataset.state = state;
      status.textContent = message;
      status.hidden = false;
    };

    requiredTextFields.forEach((field) => {
      field.addEventListener("input", () => field.setCustomValidity(""));
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending) return;

      requiredTextFields.forEach((field) => {
        field.setCustomValidity(field.value.trim() ? "" : "Bitte füllen Sie dieses Feld aus.");
      });
      if (!form.reportValidity()) return;
      if (honeypot && honeypot.checked) {
        showStatus("error", "Die Nachricht konnte nicht gesendet werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.");
        status.focus();
        return;
      }

      sending = true;
      button.disabled = true;
      buttonLabel.textContent = "Wird gesendet …";
      form.setAttribute("aria-busy", "true");
      showStatus("pending", "Ihre Nachricht wird gesendet. Bitte warten Sie einen Moment.");
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);

      try {
        const payload = Object.fromEntries(new FormData(form));
        requiredTextFields.forEach((field) => { payload[field.name] = field.value.trim(); });
        payload.subject = makeSubject(payload.name, payload.service);
        payload.botcheck = false;
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
          redirect: "error",
          credentials: "omit"
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) {
          throw new Error(response.status === 429 ? "rate-limit" : "submission-failed");
        }
        form.reset();
        requiredTextFields.forEach((field) => field.setCustomValidity(""));
        showStatus("success", "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Ich melde mich so bald wie möglich persönlich bei Ihnen zurück.");
      } catch (error) {
        const message = error.name === "AbortError"
          ? "Die Verbindung hat zu lange gedauert. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
          : error.message === "rate-limit"
            ? "Momentan sind zu viele Anfragen eingegangen. Bitte versuchen Sie es in einigen Minuten erneut."
            : "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie mir an office@leinaro.at.";
        showStatus("error", message);
      } finally {
        window.clearTimeout(timeout);
        sending = false;
        button.disabled = false;
        buttonLabel.textContent = originalButtonText;
        form.removeAttribute("aria-busy");
        status.focus();
      }
    });

    // Erst aktivieren, wenn der Versand per JavaScript bereit ist
    button.disabled = false;
  }

  /* === 8. DATENSCHUTZHINWEIS === */
  // Keine Cookies: Gespeichert wird nur die Bestätigung des Hinweises (siehe Datenschutzerklärung, Abschnitt 6).
  const PRIVACY_KEY = "leinaro-privacy-notice-v2";
  const note = document.getElementById("privacy-note");
  if (note) {
    const noteStatus = note.querySelector("[data-privacy-status]");
    const withdraw = note.querySelector("[data-privacy-withdraw]");
    let acknowledged = storage.get(PRIVACY_KEY) === "acknowledged";
    storage.remove("leitwerk-cookie-note");

    const closeNote = () => { note.hidden = true; };
    const openNote = () => {
      noteStatus.hidden = true;
      withdraw.hidden = !acknowledged;
      note.hidden = false;
      const heading = note.querySelector("h2");
      if (heading) heading.focus();
    };

    note.querySelector("[data-privacy-accept]").addEventListener("click", () => {
      if (storage.set(PRIVACY_KEY, "acknowledged")) {
        storage.remove("leinaro-privacy-notice-v1");
        acknowledged = true;
      }
      closeNote();
    });

    withdraw.addEventListener("click", () => {
      if (!storage.remove(PRIVACY_KEY)) {
        noteStatus.textContent = "Bitte löschen Sie die Website-Daten in Ihren Browser-Einstellungen.";
        noteStatus.hidden = false;
        return;
      }
      acknowledged = false;
      withdraw.hidden = true;
      noteStatus.textContent = "Ihre gespeicherte Auswahl wurde gelöscht.";
      noteStatus.hidden = false;
    });

    // Escape schließt den Hinweis ohne Speicherung
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !note.hidden) closeNote();
    });

    document.querySelectorAll("[data-privacy-open]").forEach((btn) => btn.addEventListener("click", openNote));

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const legalPage = ["datenschutz.html", "impressum.html"].includes(page);
    if (!acknowledged && !legalPage) note.hidden = false;
  }

  /* === 9. KLEINIGKEITEN === */
  // Anker auf Akkordeons (z. B. faq.html#google) direkt öffnen
  function openFromHash() {
    if (!window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target && target.tagName === "DETAILS") target.open = true;
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
