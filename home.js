(() => {
  const ls = [...document.querySelectorAll(".nav a")],
    secs = [...document.querySelectorAll("main section[id]")],
    setOn = (id) =>
      ls.forEach((a) => a.classList.toggle("on", a.hash === "#" + id)),
    syncNav = () => {
      if (!secs.length) return;
      if (scrollY < 40) return setOn(secs[0].id);
      const maxY = document.documentElement.scrollHeight - innerHeight;
      if (maxY > 0 && scrollY >= maxY - 24)
        return setOn(secs[secs.length - 1].id);
      const line = innerHeight * 0.35;
      let cur = secs[0].id;
      for (const s of secs) {
        if (s.getBoundingClientRect().top <= line) cur = s.id;
      }
      setOn(cur);
    };
  syncNav();
  addEventListener("scroll", syncNav, { passive: true });
  addEventListener("resize", syncNav, { passive: true });
  addEventListener("load", syncNav);
  const toast = document.getElementById("toast");
  let tt;
  const say = (m, ok) => {
    toast.textContent = m;
    toast.className = "toast show " + (ok ? "ok" : "err");
    clearTimeout(tt);
    tt = setTimeout(() => (toast.className = "toast"), 4500);
  };
  const f = document.querySelector(".fm");
  if (f) {
    const st = f.querySelector(".fs"),
      btn = f.querySelector("button"),
      set = (m, c) => {
        st.textContent = m;
        st.className = "fs " + c;
      };
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f)),
        bad = [];
      if (!d.name.trim()) bad.push(["name", "name"]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
        bad.push(["email", "valid email"]);
      if (!d.message.trim()) bad.push(["message", "message"]);
      if (bad.length) {
        set("Please provide: " + bad.map((b) => b[1]).join(", ") + ".", "err");
        f.elements[bad[0][0]].focus();
        return;
      }
      const ep = f.dataset.endpoint;
      if (!ep || ep.includes("GANTI_")) {
        set("Contact form is not connected yet.", "err");
        say("Contact form is not connected yet.", 0);
        return;
      }
      btn.disabled = true;
      set("Sending...", "");
      try {
        const r = await fetch(ep, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(d),
        });
        const res = await r.json().catch(() => null);
        if (!r.ok || (res && (res.success === false || res.success === "false"))) {
          throw new Error((res && res.message) || "Failed to send. Please try again later.");
        }
        f.reset();
        set("Message sent. Thank you!", "ok");
        say("Message sent. Thank you!", 1);
      } catch (err) {
        const msg = (err && err.message) || "Failed to send. Please try again later.";
        set(msg, "err");
        say(msg, 0);
      }
      btn.disabled = false;
    });
  }
})();
(() => {
  const w = document.querySelector('.navwrap');
  if (!w) return;
  const f = () => w.classList.toggle('scrolled', scrollY > 40);
  f();
  addEventListener('scroll', f, { passive: true });
})();
