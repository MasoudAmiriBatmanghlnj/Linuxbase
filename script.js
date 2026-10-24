
function render() {
  const q = search.value.trim().toLowerCase();

  const filtered = allReleases.filter(r =>
    [r.name, r.tag_name, r.body]
      .some(v => (v || "").toLowerCase().includes(q))
  );

  list.replaceChildren();
  count.textContent = messages[language].count(filtered.length);

  if (!filtered.length) {
    statusBox.hidden = false;
    statusBox.textContent = allReleases.length
      ? messages[language].empty
      : messages[language].none;
    return;
  }

  statusBox.hidden = true;

  filtered.forEach(release => {
    const card = document.createElement("article");
    card.className = "release";

    const title = document.createElement("h3");
    title.textContent = release.name || release.tag_name || "Release";
    card.appendChild(title);

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = release.tag_name || "";
    card.appendChild(date);

    if (release.body) {
      const description = document.createElement("p");
      description.className = "description";
      description.textContent = release.body.slice(0, 2500);
      card.appendChild(description);
    }

    const assets = document.createElement("div");
    assets.className = "assets";

    assets.appendChild(makeLink(
      messages[language].view,
      release.html_url,
      "btn"
    ));

    const torrentAssets = release.assets.filter(asset =>
      asset.name.toLowerCase().endsWith(".torrent")
    );

    torrentAssets.forEach(asset => {
      assets.appendChild(makeLink(
        `${messages[language].torrent}: ${asset.name}`,
        asset.browser_download_url
      ));
    });

    const hashMatch = (release.body || "").match(
      /^\s*Info-Hash:\s*([a-fA-F0-9]{40})\s*$/im
    );

    if (hashMatch) {
      const hash = hashMatch[1].toLowerCase();
      const name = release.name || release.tag_name || "Linuxbase";
      const magnet =
        "magnet:?xt=urn:btih:" + hash +
        "&dn=" + encodeURIComponent(name);

      const hashText = document.createElement("code");
      hashText.className = "hash";
      hashText.textContent = "Info Hash: " + hash;
      card.appendChild(hashText);

      const magnetButton = document.createElement("a");
      magnetButton.className = "magnet-btn";
      magnetButton.href = magnet;
      magnetButton.textContent = "🧲 Magnet";
      magnetButton.title = "Open this torrent in a compatible client";
      assets.appendChild(magnetButton);

      const copyButton = document.createElement("button");
      copyButton.className = "magnet-btn";
      copyButton.textContent = messages[language].copy;

      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(magnet);
          copyButton.textContent = messages[language].copied;
        } catch {
          window.prompt("Copy Magnet link:", magnet);
        }
      });

      assets.appendChild(copyButton);

      const hashButton = document.createElement("button");
      hashButton.className = "magnet-btn";
      hashButton.textContent = "Copy Info Hash";

      hashButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(hash);
          hashButton.textContent = messages[language].copied;
        } catch {
          window.prompt("Copy Info Hash:", hash);
        }
      });

      assets.appendChild(hashButton);
    }

    card.appendChild(assets);
    list.appendChild(card);
  });
}

