/* ==========================================================================
   Navigation Services Limited — Core JS
   Shared across all pages: scroll reveal, counters, navbar shadow,
   FAQ accordion (Bootstrap handles it), and NAVI AI chat widget.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Scroll reveal (data-aos) ---------- */
  const revealEls = document.querySelectorAll("[data-aos]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("aos-visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".counter-num[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Navbar shadow on scroll ---------- */
  const navbar = document.querySelector(".nsl-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 12) {
        navbar.style.boxShadow = "0 4px 20px rgba(7,27,82,0.12)";
      } else {
        navbar.style.boxShadow = "var(--shadow-sm)";
      }
    });
  }

  /* ---------- Sidebar toggle (dashboard) ---------- */
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".dash-sidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 991 &&
        sidebar.classList.contains("show") &&
        !sidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)
      ) {
        sidebar.classList.remove("show");
      }
    });
  }

  /* ---------- Newsletter form (demo) ---------- */
  const newsletterForm = document.querySelector("#newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector("button");
      const original = btn.textContent;
      btn.textContent = "Subscribed!";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        newsletterForm.reset();
      }, 2200);
    });
  }

  /* ---------- Contact form (demo) ---------- */
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const alertBox = document.querySelector("#contactAlert");
      if (alertBox) {
        alertBox.classList.remove("d-none");
        setTimeout(() => alertBox.classList.add("d-none"), 4000);
      }
      contactForm.reset();
    });
  }

  /* ---------- Password visibility toggle (auth pages) ---------- */
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.querySelector(btn.getAttribute("data-target"));
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.innerHTML = isPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    });
  });

  /* =====================================================================
     NAVI AI — Chat Widget
     ===================================================================== */
  const naviToggle = document.querySelector("#naviToggle");
  const naviWindow = document.querySelector("#naviWindow");
  const naviClose = document.querySelector("#naviClose");
  const naviBody = document.querySelector("#naviBody");
  const naviInput = document.querySelector("#naviInput");
  const naviSend = document.querySelector("#naviSend");

  if (naviToggle && naviWindow) {
    naviToggle.addEventListener("click", () => {
      naviWindow.classList.toggle("open");
      if (naviWindow.classList.contains("open")) {
        naviInput.focus();
      }
    });

    if (naviClose) {
      naviClose.addEventListener("click", () => naviWindow.classList.remove("open"));
    }

    // Quick suggestion chips
    naviBody.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) {
        sendNaviMessage(chip.textContent.trim());
      }
    });

    naviSend.addEventListener("click", () => {
      const text = naviInput.value.trim();
      if (text) sendNaviMessage(text);
    });

    naviInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const text = naviInput.value.trim();
        if (text) sendNaviMessage(text);
      }
    });
  }

  function sendNaviMessage(text) {
    appendNaviMessage(text, "user");
    naviInput.value = "";
    naviBody.scrollTop = naviBody.scrollHeight;

    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "navi-msg bot navi-typing-wrap";
    typing.innerHTML = '<div class="navi-typing"><span></span><span></span><span></span></div>';
    naviBody.appendChild(typing);
    naviBody.scrollTop = naviBody.scrollHeight;

    setTimeout(() => {
      typing.remove();
      appendNaviMessage(getNaviReply(text), "bot");
      naviBody.scrollTop = naviBody.scrollHeight;
    }, 900);
  }

  function appendNaviMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `navi-msg ${sender}`;
    msg.textContent = text;
    naviBody.appendChild(msg);
  }

  function getNaviReply(text) {
    const t = text.toLowerCase();
    if (t.includes("ican")) {
      return "The ICAN programme covers all stages with structured tuition, mock exams and past questions. Want me to show you the ICAN programme page or check fees?";
    }
    if (t.includes("acca")) {
      return "Our ACCA programme includes live classes, recorded sessions and a dedicated question bank. I can take you to the ACCA programme page if you'd like.";
    }
    if (t.includes("fee") || t.includes("price") || t.includes("cost")) {
      return "Fees vary by programme and payment plan (one-time or installment). Visit the programme page for full details, or I can connect you with admissions.";
    }
    if (t.includes("certificate")) {
      return "Certificates are issued automatically once you complete 100% of a course and pass the final assessment. You can verify any certificate on our Certificate Verification page.";
    }
    if (t.includes("register") || t.includes("sign up") || t.includes("enroll")) {
      return "You can register with your email or continue with Google. Head to the Register page and I'll guide you through choosing your programme.";
    }
    if (t.includes("login") || t.includes("sign in")) {
      return "You can log in with your email and password, or use Google Sign-In on the Login page.";
    }
    return "Thanks for your message! I'm NAVI, your study assistant. I can help with programme info, fees, certificates, exams, and navigating your dashboard. (This is a demo response — full AI integration connects via the AI Integration Layer.)";
  }

});
