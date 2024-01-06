// Apply dark mode style
function darkmode() {
  document.body.className = document.body.className === "dark" ? md.yaml.theme || "" : "dark";
}

// Load post from markdown file and return a promise
async function loadMarkdown(mdfile) {
  try {
    const response = await fetch(mdfile);
    if (!response.ok) {
      throw new Error("Failed to load markdown file.");
    }
    return await response.text();
  } catch (error) {
    throw new Error("Failed to load markdown file.");
  }
}

// Parse URL parameters and initialize blog objects
md.params = {};
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
  md.params[key] = value;
});

// Initialize blog page
async function initPage() {
  try {
    const mdfile = md.params.page;
    const text = await loadMarkdown(mdfile);
    
    updatePageContent(text);
    updatePageTitleAndSubtitle();
    updateMenu();

    md.load(md.params.page);
  } catch (error) {
    console.error(error.message);
  }
}

function updatePageContent(text) {
  document.getElementById("content").innerHTML = md.html(text);
}

function updatePageTitleAndSubtitle() {
  document.getElementById("title").innerText = md.yaml.title;
  document.getElementById("subtitle").innerText = md.yaml.subtitle;
}

function updateMenu() {
  const html = Object.entries(md.yaml.menu)
    .map(([label, link]) => `<a href="${link}">${label}</a>`)
    .join("");
  document.getElementById("menu").innerHTML = html;
}


window.onload = initPage;