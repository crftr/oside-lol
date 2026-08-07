/* ============================================================
   OSIDE.LOL — runtime
   Nothing here is certified. The pier is holding anyway.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- storage helpers (file:// safe) ---------------- */
  function storeGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, val) {
    try { sessionStorage.setItem(key, val); } catch (e) {}
  }

  function $(id) { return document.getElementById(id); }

  /* ============================================================
     CURRENT YEAR
     ============================================================ */
  var currentYear = $("currentYear");
  var year = new Date().getFullYear();
  currentYear.textContent = String(year);
  currentYear.setAttribute("datetime", String(year));

  /* ============================================================
     MOBILE NAVIGATION
     ============================================================ */
  var navToggle = $("navToggle");
  var navLinks = $("navLinks");
  var navToggleLabel = navToggle.querySelector(".nav-toggle-label");

  function setNavOpen(open) {
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close city menu" : "Open city menu");
    navLinks.classList.toggle("is-open", open);
    navToggleLabel.textContent = open ? "CLOSE MENU" : "CITY MENU";
  }

  navToggle.addEventListener("click", function () {
    setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest(".nav-link")) setNavOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  /* ============================================================
     TOAST
     ============================================================ */
  var toastEl = $("toast");
  var toastMsg = $("toastMsg");
  var toastTimer = null;

  function showToast(msg, actions) {
    toastMsg.textContent = "";
    var text = document.createTextNode(msg);
    toastMsg.appendChild(text);
    (actions || []).forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = a.label;
      b.addEventListener("click", function () { a.fn(); hideToast(); });
      toastMsg.appendChild(b);
    });
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  }
  function hideToast() {
    toastEl.hidden = true;
    clearTimeout(toastTimer);
  }
  $("toastClose").addEventListener("click", hideToast);

  /* ============================================================
     MODAL
     ============================================================ */
  var modal = $("modal");
  var modalTitle = $("modalTitle");
  var modalBody = $("modalBody");
  var lastFocus = null;

  function openModal(title, html) {
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.hidden = false;
    var closeBtn = modal.querySelector(".js-modal-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!modal.hidden) closeModal();
      if (!popup.hidden) hidePopup();
    }
  });
  var modalClose = modal.querySelectorAll(".js-modal-close");
  for (var i = 0; i < modalClose.length; i++) {
    modalClose[i].addEventListener("click", closeModal);
  }

  /* ============================================================
     BOOT / LOADING OVERLAY
     ============================================================ */
  var loading = $("loading");
  var loadingText = $("loadingText");
  var loadingBar = $("loadingBar");

  var bootLines = [
    ["loading the marine layer...", 20],
    ["loading the pier...", 38],
    ["loading the potholes...", 56],
    ["loading the cold brew...", 74],
    ["loading downtown construction...", 90],
    ["loading the fog...", 100]
  ];

  function runBoot() {
    if (reduceMotion || storeGet("oside_booted")) { loading.hidden = true; return; }
    storeSet("oside_booted", "1");
    loading.hidden = false;
    var line = 0;
    loadingText.textContent = bootLines[0][0];
    var tick = setInterval(function () {
      line++;
      if (line >= bootLines.length) {
        clearInterval(tick);
        loading.classList.add("done");
        setTimeout(function () { loading.hidden = true; }, 550);
        return;
      }
      loadingText.textContent = bootLines[line][0];
      loadingBar.style.width = bootLines[line][1] + "%";
      loadingBar.textContent = bootLines[line][1] + "%";
    }, 250);
  }
  // skip on any key or click
  loading.addEventListener("click", function () { loading.classList.add("done"); setTimeout(function(){ loading.hidden = true; }, 400); });
  document.addEventListener("keydown", function () {
    if (!loading.hidden) { loading.classList.add("done"); setTimeout(function(){ loading.hidden = true; }, 400); }
  });
  runBoot();

  /* ============================================================
     TITLE ROTATOR
     ============================================================ */
  var titles = ["OSIDE.LOL", "Oside. Lol.", "Oceanside, CA (1987)", "UNDER CONSTRUCTION", "PLEASE STAND BY"];
  var tIdx = 0;
  if (!reduceMotion) {
    setInterval(function () {
      if (document.hidden) return;
      tIdx = (tIdx + 1) % titles.length;
      document.title = titles[tIdx];
    }, 4000);
  }

  /* ============================================================
     TICKER COUNTERS
     ============================================================ */
  var visitorCount = $("visitorCount");
  visitorCount.textContent = "0,00" + (1 + Math.floor(Math.random() * 7));

  var wastedSec = 0;
  var timeWasted = $("timeWasted");
  setInterval(function () {
    wastedSec++;
    var m = String(Math.floor(wastedSec / 60)).padStart(2, "0");
    var s = String(wastedSec % 60).padStart(2, "0");
    timeWasted.textContent = m + ":" + s;
  }, 1000);

  var sunClicks = 0;
  var cheatCount = 0;
  var sunCountEl = $("sunCount");
  var cheatCountEl = $("cheatCount");

  /* ============================================================
     TAGLINE ROTATOR
     ============================================================ */
  var taglines = [
    "World's longest wooden pier — still holding.",
    "Est. 1883. Rebuilt 1987. Questioned daily.",
    "Marines, the sunset market, and a parking problem.",
    "Now serving cold brew. The potholes are complementary.",
    "Your grandpa's beach town, now with oat milk.",
    "Oceanside: what Carlsbad's HOA warned you about.",
    "Oceanside: still gritty, now with $14 lattes.",
    "A 1,954-foot pier and zero answers.",
    "Where coastal grit meets a brand activation.",
    "Now leasing the former location of the thing you liked."
  ];
  var tIdx2 = 0;
  var taglineEl = $("tagline");

  function flipTagline(next) {
    if (next === undefined) { tIdx2 = (tIdx2 + 1) % taglines.length; }
    else { tIdx2 = next % taglines.length; }
    taglineEl.classList.add("flip");
    setTimeout(function () {
      taglineEl.textContent = taglines[tIdx2];
      taglineEl.classList.remove("flip");
    }, 250);
  }
  var taglineInterval = setInterval(function () { if (!document.hidden && !document.body.classList.contains("low-fog")) flipTagline(); }, 5000);
  taglineEl.addEventListener("click", function () { flipTagline(); });

  /* ============================================================
     FACT GENERATOR
     ============================================================ */
  var facts = [
    "The pier is 1,954 feet long. It has been 1,954 feet long since 1987. This is the entire fact.",
    "Oceanside is the only North County beach town where spontaneous fun begins before the sponsor logo is approved. Carlsbad has filed an objection.",
    "A surfer has claimed the waves were 'better yesterday' approximately four million times. All of them were correct.",
    "Downtown construction has broken ground fourteen times. The groundbreaking ceremony broke ground again last week.",
    "Mission San Luis Rey is the largest of the California missions. It is still older than the cold brew.",
    "The harbor is home to fish tacos, a tackle shop, and one seagull running a local protection scheme.",
    "Every day at 5:47 AM someone says 'dawn patrol' out loud. None of them have been asked to stop.",
    "The word 'vibe' was added to the municipal code in 2019. Section 44. Never enforced.",
    "The 5-over-1 on the corner has 214 units and zero residents who can afford the parking structure.",
    "Camp Pendleton is next door. The Marines have never complained about the potholes, because the potholes have never complained about the Marines.",
    "The pier has been rebuilt exactly once, in 1987, which the city refers to as 'the maintenance plan.'",
    "The Sunset Market is not the farmers market. The city apologizes on behalf of everyone who keeps saying it is.",
    "The Strand has two speed limits: 5 mph and 'looking for parking.' Both are enforced by bicycles.",
    "Every new downtown building is named by pairing an ocean with a milk alternative. The Pacific Oat was the last available combination.",
    "Coast Highway is simultaneously a road, a construction project, and a group chat about what used to be there."
  ];
  var factQueue = null;
  var factOut = $("factOut");
  var factTimer = null;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function nextFact() {
    if (!factQueue || factQueue.length === 0) factQueue = shuffle(facts);
    return factQueue.shift();
  }

  function typeFact(text) {
    clearInterval(factTimer);
    factOut.textContent = "";
    var i = 0;
    if (reduceMotion) { factOut.textContent = text; return; }
    factTimer = setInterval(function () {
      i += 2;
      factOut.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(factTimer);
    }, 12);
  }

  function giveFact(scroll) {
    var f = nextFact();
    typeFact(f);
    if (scroll && $("factgen")) {
      $("factgen").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }
  }
  $("factBtn").addEventListener("click", function () { giveFact(true); });
  $("factBtn2").addEventListener("click", function () { giveFact(false); });

  /* ============================================================
     SUN
     ============================================================ */
  var sun = $("sun");
  var sunMessage = $("sunMessage");
  var sunLines = [
    "you clicked the sun. it noticed.",
    "the sun respects your persistence.",
    "this does not make it set. nothing does.",
    "the sun has now been clicked more than the pier has been repaired.",
    "the sun is preparing a statement for the city council.",
    "the sun is out of statements. try the pier."
  ];
  var sunMsgTimer = null;

  function sunSay(msg) {
    sunMessage.textContent = msg;
    sunMessage.classList.add("show");
    clearTimeout(sunMsgTimer);
    sunMsgTimer = setTimeout(function () { sunMessage.classList.remove("show"); }, 2600);
  }

  function onSun() {
    sunClicks++;
    sunCountEl.textContent = sunClicks;
    sun.classList.remove("glitching");
    void sun.offsetWidth;
    sun.classList.add("glitching");

    if (sunClicks === 7) {
      sun.classList.add("eclipsed");
      sunSay("eclipse achieved. the marine layer approves. visibility: 0.");
      showToast("Eclipse achieved. The marine layer approves. Visibility: 0.");
      return;
    }
    var idx = Math.min(sunClicks - 1, sunLines.length - 1);
    sunSay(sunLines[idx]);
  }
  sun.addEventListener("click", onSun);
  sun.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSun(); }
  });

  /* ============================================================
     O MARK
     ============================================================ */
  var heroO = $("heroO");
  var titleText = $("titleText");
  var oStates = [
    '<span class="chrome">SIDE</span><span class="lol">.lol</span>',
    '<span class="chrome">H.</span><span class="lol"> LOL.</span>',
    '<span class="chrome">CEANSIDE</span><span class="lol">.lol</span>'
  ];
  var oIdx = 0;

  function onOMark() {
    oIdx = (oIdx + 1) % oStates.length;
    heroO.classList.remove("glitching");
    void heroO.offsetWidth;
    heroO.classList.add("glitching");
    titleText.innerHTML = oStates[oIdx];
    document.title = oStates[oIdx].replace(/<[^>]*>/g, "") + " (you did this)";
  }
  heroO.addEventListener("click", onOMark);
  heroO.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOMark(); }
  });

  /* ============================================================
     PIER
     ============================================================ */
  var pierTold = false;
  var pier = $("pier");

  function onPier() {
    if (!pierTold) {
      pierTold = true;
      showToast("The pier is holding. It will continue to hold.");
    }
  }

  pier.addEventListener("click", onPier);
  pier.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPier(); }
  });

  /* ============================================================
     WINDOW DOTS
     ============================================================ */
  var closeDots = document.querySelectorAll(".js-win-close");
  for (var c = 0; c < closeDots.length; c++) {
    closeDots[c].addEventListener("click", function (e) {
      var winId = this.getAttribute("data-win");
      var win = $(winId);
      if (!win) return;
      win.classList.add("is-closed");
      win.setAttribute("aria-hidden", "true");
      var name = winId.toUpperCase() + ".EXE";
      showToast(name + " has closed. It will be back after this fog.", [{
        label: "REOPEN",
        fn: function () {
          win.classList.remove("is-closed");
          win.removeAttribute("aria-hidden");
          win.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }
      }]);
    });
  }
  var shrugDots = document.querySelectorAll(".js-win-shrug");
  for (var s = 0; s < shrugDots.length; s++) {
    shrugDots[s].addEventListener("click", function () {
      if (this.classList.contains("dot-green")) {
        showToast("Maximize: the window is already as large as the law allows.");
      } else {
        showToast("Minimize: not implemented. The window stays. The fog does too.");
      }
    });
  }

  // keyboard support for decorative window dots (role="button" on spans)
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var t = e.target;
    if (t && t.classList &&
        (t.classList.contains("js-win-close") || t.classList.contains("js-win-shrug") || t.classList.contains("js-modal-close"))) {
      e.preventDefault();
      t.click();
    }
  });

  /* ============================================================
     GUESTBOOK
     ============================================================ */
  var guestForm = $("guestForm");
  var guestList = $("guestList");
  var guestCount = $("guestCount");
  var count = parseInt(guestCount.textContent, 10) || 4;

  guestForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("guestName").value.trim();
    var msg = $("guestMsg").value.trim();
    if (!name || !msg) return;

    var li = document.createElement("li");
    li.className = "entry";
    li.innerHTML =
      '<p class="entry-meta"><span class="entry-name"></span> · location withheld · just now</p>' +
      '<p class="entry-body"></p>' +
      '<p class="entry-status">status: pending approval (est. 3-5 business years)</p>';
    li.querySelector(".entry-name").textContent = name.toLowerCase();
    li.querySelector(".entry-body").textContent = msg;
    guestList.appendChild(li);

    count++;
    guestCount.textContent = count;
    guestForm.reset();
    showToast("Entry queued. The pier has been notified. It will not respond.");
  });

  /* ============================================================
     NAV / WEBRING / FOOTER BUTTONS
     ============================================================ */
  function modalPierCam() {
    openModal("PIER_CAM.EXE",
      '<p class="modal-lead">CAMERA 2 — OFFLINE. FOG.</p>' +
      '<div class="static-box"></div>' +
      '<p>CAMERA 1 is also offline. It, too, is fog. The fog is currently winning.</p>' +
      '<p class="fact-hint">please stand by. standing by has not helped.</p>');
  }
  function modalCouncil() {
    openModal("CITYCOUNCIL.EXE",
      '<p class="modal-lead">The council is in recess.</p>' +
      '<p>It has been in recess since 2003. The next open session is TBD, and was also TBD in 2003.</p>' +
      '<p class="fact-hint">the pier remains open. this is not related to anything.</p>');
  }
  function modalBug() {
    openModal("BUGREPORT.EXE",
      '<p class="modal-lead">We are aware of the bug.</p>' +
      '<p>The bug is the marine layer. Closing this window will not fix it. Neither will anything else.</p>' +
      '<p class="fact-hint">thank you for your report. it has been forwarded to the pier.</p>');
  }

  $("navPierCam").addEventListener("click", modalPierCam);
  $("navCouncil").addEventListener("click", modalCouncil);
  $("footCouncil").addEventListener("click", modalCouncil);
  $("footBug").addEventListener("click", modalBug);

  $("footOfficial").addEventListener("click", function () {
    showToast("We are not sure which website is the official one either. We have always suspected the pier.");
  });
  $("footPostcard").addEventListener("click", function () {
    showToast("Postcard backlog: 1,954 ft. Yours is in line behind 1947 of your grandpa's.");
  });

  var sections = ["welcome", "facts", "factgen", "development", "guestbook"];

  function goRandomSection() {
    var id = sections[Math.floor(Math.random() * sections.length)];
    $(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    return id;
  }

  $("navMystery").addEventListener("click", function () {
    var id = goRandomSection();
    showToast("You were sent somewhere in O'side. It was " + id + ". The fog approves.");
  });

  $("ringNext").addEventListener("click", goRandomSection);
  $("ringRandom").addEventListener("click", goRandomSection);
  $("ringPrev").addEventListener("click", function () {
    showToast("There is no prev. The webring has a population of one. It's a ring, but small.");
  });

  /* ============================================================
     POP-UP AD
     ============================================================ */
  var popup = $("popup");

  function hidePopup() {
    popup.classList.add("popup-vanish");
    setTimeout(function () { popup.hidden = true; }, 400);
  }
  $("popupClose").addEventListener("click", hidePopup);
  $("popupClaim").addEventListener("click", function () {
    hidePopup();
    showToast("Your prize: one (1) unpermitted good time in O'side. Not valid in Carlsbad. HOA restrictions may apply.");
  });

  if (!storeGet("oside_popup")) {
    setTimeout(function () {
      storeSet("oside_popup", "1");
      if (document.hidden) return;
      popup.hidden = false;
      // move focus into the dialog only if the user hasn't started anything yet
      if (document.activeElement === document.body) {
        setTimeout(function () { $("popupClaim").focus(); }, 60);
      }
    }, 4000);
  }

  /* ============================================================
     KONAMI CODE → LOW-FOG MODE
     ============================================================ */
  var konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var konamiIdx = 0;

  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea")) return;
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        activateLowFog();
      }
    } else {
      konamiIdx = key === konami[0] ? 1 : 0;
    }
  });

  var fogActive = false;
  function activateLowFog() {
    fogActive = !fogActive;
    cheatCount++;
    cheatCountEl.textContent = cheatCount;
    if (fogActive) {
      document.body.classList.add("low-fog");
      showToast("LOW-FOG MODE. The marine layer has been politely asked to leave.");
      flipTagline(5);
      setTimeout(function () {
        flipTagline();
        showToast("The marine layer returns. It always returns.");
      }, 12000);
    } else {
      document.body.classList.remove("low-fog");
      showToast("FOG RE-ENGAGED. The marine layer is back, and it is not taking questions.");
    }
  }

  /* ============================================================
     CONSOLE EASTER EGG
     ============================================================ */
  console.log(
    "%c OSIDE.LOL %c the marine layer compiled successfully. est. 1987. no warranty. ",
    "background:#ff2d95;color:#fff;font-family:monospace;font-size:14px;font-weight:bold;padding:4px 6px;",
    "background:#150824;color:#00f0ff;font-family:monospace;font-size:12px;padding:4px 6px;"
  );
  console.log("TIP: try the konami code. the sun is also a button. so is the pier. so is everything, honestly.");

})();
