const saveBtn = document.getElementById("saveBtn");
const statusPill = document.getElementById("statusPill");
const statusText = document.getElementById("statusText");

// FRONTEND-ONLY placeholder: simulates the vertical slice until backend exists
function setStatus(state, text) {
  statusPill.textContent = text;
  statusPill.classList.remove("pill--ok", "pill--err");

  if (state === "ok") statusPill.classList.add("pill--ok");
  if (state === "err") statusPill.classList.add("pill--err");
}

saveBtn.addEventListener("click", async () => {
  setStatus("", "Saving...");

  // ✅ When your team builds backend:
  // Replace the timeout with:
  // const res = await fetch("http://localhost:3000/api/sample", { method: "POST" });
  // const data = await res.json();
  // setStatus("ok", "Saved");
  // statusText.textContent = `Saved value from DB: ${data.value}`;

  try {
    // Fake “save” now
    await new Promise((r) => setTimeout(r, 500));
    const fakeSavedValue = new Date().toISOString();

    setStatus("ok", "Saved");
    statusText.innerHTML = `Saved value (frontend placeholder): <code>${fakeSavedValue}</code>`;
  } catch (err) {
    setStatus("err", "Error");
    statusText.textContent = "Something went wrong.";
  }
});