
    // Detect an existing Magnet URI or a v1 Info Hash in the release body.
    const body = release.body || "";

    const hashMatch = body.match(
      /Info[\s-]*Hash\s*:\s*([a-f0-9]{40})\b/i
    );

    const magnetMatch = body.match(
      /magnet:\?xt=urn:btih:[a-f0-9]{40}(?:&[^\s<]*)?/i
    );

    const hash = hashMatch
      ? hashMatch[1].toLowerCase()
      : magnetMatch
        ? magnetMatch[0].match(/urn:btih:([a-f0-9]{40})/i)[1].toLowerCase()
        : null;

    if (hash || magnetMatch) {
      const name = release.name || release.tag_name || "Linuxbase";

      const magnet = magnetMatch
        ? magnetMatch[0].replace(/[),.;]+$/, "")
        : "magnet:?xt=urn:btih:" + hash +
          "&dn=" + encodeURIComponent(name);

      if (hash) {
        const hashText = document.createElement("code");
        hashText.className = "hash";
        hashText.textContent = "Info Hash: " + hash;
        card.appendChild(hashText);
      }

      const magnetLink = makeLink("🧲 Magnet", magnet, "magnet-btn");
      magnetLink.title = "Open this torrent in a compatible client";
      assets.appendChild(magnetLink);

      const copyMagnet = document.createElement("button");
      copyMagnet.type = "button";
      copyMagnet.className = "magnet-btn";
      copyMagnet.textContent = messages[language].copy;

      copyMagnet.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(magnet);
          copyMagnet.textContent = messages[language].copied;
        } catch {
          window.prompt("Copy Magnet link:", magnet);
        }
      });

      assets.appendChild(copyMagnet);

      if (hash) {
        const copyHash = document.createElement("button");
        copyHash.type = "button";
        copyHash.className = "magnet-btn";
        copyHash.textContent = "Copy Info Hash";

        copyHash.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(hash);
            copyHash.textContent = messages[language].copied;
          } catch {
            window.prompt("Copy Info Hash:", hash);
          }
        });

        assets.appendChild(copyHash);
      }
    }
