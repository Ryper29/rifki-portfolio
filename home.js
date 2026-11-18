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
      if (!d.name.trim()) bad.push(["name", "nama"]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
        bad.push(["email", "email"]);
      if (d.message.trim().length < 5) bad.push(["message", "pesan"]);
      if (bad.length) {
        set("Periksa kembali: " + bad.map((b) => b[1]).join(", ") + ".", "err");
        f.elements[bad[0][0]].focus();
        return;
      }
      const ep = f.dataset.endpoint;
      if (!ep || ep.includes("GANTI_")) {
        set("Form belum terhubung ke FormSubmit.", "err");
        say("Form belum terhubung ke FormSubmit.", 0);
        return;
      }
      btn.disabled = true;
      set("Mengirim…", "");
      try {
        const r = await fetch(ep, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(d),
        });
        if (!r.ok) throw 0;
        f.reset();
        set("Pesan terkirim. Terima kasih!", "ok");
        say("Pesan terkirim. Terima kasih!", 1);
      } catch {
        set("Gagal mengirim. Coba lagi nanti.", "err");
        say("Gagal mengirim pesan.", 0);
      }
      btn.disabled = false;
    });
  }
})();
