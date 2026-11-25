(() => {
  const ls = [...document.querySelectorAll(".nav a")],
    io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting)
            ls.forEach((a) =>
              a.classList.toggle("on", a.hash === "#" + e.target.id),
            );
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
  document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
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
