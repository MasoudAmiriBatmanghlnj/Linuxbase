
const API =
  "https://api.github.com/repos/MasoudAmiriBatmanghlnj/Linuxbase/releases";

const list = document.getElementById("releases");
const statusBox = document.getElementById("status");
const search = document.getElementById("search");
const count = document.getElementById("releaseCount");
const langToggle = document.getElementById("langToggle");

let allReleases = [];
let language = "en";

const messages = {
  en: {
    loading: "Loading releases…",
    error: "Could not load releases. Check your connection and try again.",
    empty: "No releases match your search.",
    none: "No published releases were found.",
    view: "View release",
    torrent: "Download .torrent",
    noAssets: "No downloadable assets attached to this release.",
    copy: "Copy Magnet",
    copied: "Copied!",
    draft: "Draft",
    count: n => `${n} releases`
  },

  fa: {
    loading: "در حال دریافت انتشارها…",
    error: "دریافت انتشارها ناموفق بود. اتصال را بررسی کنید.",
    empty: "انتشاری با این عبارت پیدا نشد.",
    none: "هیچ انتشار منتشرشده‌ای پیدا نشد.",
    view: "مشاهدهٔ انتشار",
    torrent: "دریافت فایل تورنت",
    noAssets: "فایلی برای دریافت پیوست نشده است.",
    copy: "کپی Magnet",
    copied: "کپی شد!",
    draft: "پیش‌نویس",
    count: n => `${n} انتشار`
  }
};

function setLanguage(next) {
  language = next;

  document.documentElement.lang = language;
  document.documentElement.dir =
    language === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-fa]")
    .forEach(element => {
      element.textContent = element.dataset[language];
    });

  search.placeholder =
    search.dataset[
      language === "fa" ? "placeholderFa" : "placeholderEn"
    ];

  langToggle.textContent =
    language === "en" ? "فارسی" : "English";

  langToggle.setAttribute(
    "aria-label",
    language === "en"
      ? "Switch language to Persian"
      : "تغییر زبان به انگلیسی"
  );

  render();
}

langToggle.addEventListener("click", () => {
  setLanguage(language === "en" ? "fa" : "en");
});

function makeLink(label, url, className = "asset") {
  const link = document.createElement("a");

  link.className = className;
  link.href = url;
  link.textContent = label;
  link.rel = "noopener noreferrer";

  return link;
}

function render() {
  const query = search.value.trim().toLowerCase();

  const filtered = allReleases.filter(release =>
    [
      release.name,
      release.tag_name,
      release.body
    ].some(value =>
      (value || "").toLowerCase().includes(query)
    )
  );

  list.replaceChildren();
  count.textContent = messages[language].count(filtered.length);

  if (filtered.length === 0) {
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
    title.textContent =
      release.name || release.tag_name || "Release";

    card.appendChild(title);

    const date = document.createElement("div");
    date.className = "date";

    const published = release.published_at || release.created_at;

    date.textContent =
      (release.tag_name || "") +
      (published
        ? " · " + new Date(published).toLocaleDateString(
            language === "fa" ? "fa-IR" : "en-GB",
            { year: "numeric", month: "short", day: "numeric" }
          )
        : "");

    card.appendChild(date);

    if (release.body) {
      const description = document.createElement("p");
      description.className = "description";
      description.textContent = release.body.slice(0, 2500);
      card.appendChild(description);
    }

    const assets = document.createElement("div");
    assets.className = "assets";

    assets.appendChild(
      makeLink(
        messages[language].view,
        release.html_url,
        "btn"
      )
    );

    const torrents = release.assets.filter(asset =>
      asset.name.toLowerCase().endsWith(".torrent")
    );

    torrents.forEach(asset => {
      assets.appendChild(
        makeLink(
          `${messages[language].torrent}: ${asset.name}`,
          asset.browser_download_url
        )
      );
    });

    // Read one v1 Info Hash from the release description.
    const match = (release.body || "").match(
      /^\s*Info-Hash:\s*([a-fA-F0-9]{40})\s*$/im
    );

    if (match) {
      const hash = match[1].toLowerCase();

      const name =
        release.name || release.tag_name || "Linuxbase";

      const magnet =
        "magnet:?xt=urn:btih:" + hash +
        "&dn=" + encodeURIComponent(name);

      const hashText = document.createElement("code");
      hashText.className = "hash";
      hashText.textContent = "Info Hash: " + hash;
      card.appendChild(hashText);

      const magnetLink = makeLink(
        "🧲 Magnet",
        magnet,
        "magnet-btn"
      );

      magnetLink.title =
        "Open this torrent in a compatible client";

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

    if (release.assets.length === 0) {
      const note = document.createElement("p");
      note.className = "muted";
      note.textContent = messages[language].noAssets;
      card.appendChild(note);
    }

    card.appendChild(assets);
    list.appendChild(card);
  });
}

search.addEventListener("input", render);

async function loadReleases() {
  statusBox.hidden = false;
  statusBox.textContent = messages[language].loading;

  try {
    const response = await fetch(API, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error("GitHub API: " + response.status);
    }

    allReleases = await response.json();

    // Exclude drafts from the public release list.
    allReleases = allReleases.filter(release => !release.draft);

    render();
  } catch (error) {
    statusBox.hidden = false;
    statusBox.textContent = messages[language].error;
    console.error(error);
  }
}

setLanguage("en");
loadReleases();
