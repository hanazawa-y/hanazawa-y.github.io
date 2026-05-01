import("./main.js").catch((err) => {

	const el =
		document.getElementById("loading");

	if (!el) {
		return;
	}

	el.textContent =
		"読み込みエラー: "
		+ (err?.message || String(err));

	el.classList.remove(
		"hidden"
	);
});
