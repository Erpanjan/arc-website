# ARC Website

Static marketing website for the ARC AI Companion platform.

## Quick Start

Run these commands from the **website root directory**:

1.  **Start the server**:
    ```bash
    python3 -m http.server 8080
    ```
2.  **View the site**:
    Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Project Structure

```
website/
├── index.html              # Main landing page
├── privacy.html            # Privacy Policy
├── terms.html              # Service Agreement
├── early-access.html       # Early Access signup form
├── assets/
│   ├── css/
│   │   ├── main.css        # Global design system & styles
│   │   └── early-access.css# Early Access form styles
│   └── js/
│       ├── main.js         # Core app logic (components, nav, animations)
│       ├── early-access.js # Form submission handler
│       └── supabase-config.js # Supabase credentials
├── components/             # HTML partials injected dynamically by main.js
│   ├── nav.html
│   ├── hero.html
│   ├── interact.html
│   ├── solution.html
│   ├── monitoring.html
│   ├── accessibility.html
│   └── cta-footer.html
├── docs/
│   ├── legal/              # Source documents for terms & privacy pages
│   │   ├── Data Privacy Policy.docx
│   │   └── Service Agreement.docx
│   └── database/           # Database setup scripts (not served)
│       └── supabase-early-access-setup.sql
├── main.js                 # Symlink → assets/js/main.js (backward compat)
└── style.v2.css            # Symlink → assets/css/main.css (backward compat)
```

---

## Troubleshooting: "Address already in use"

If you see `[Errno 48] Address already in use`:

**Option A: Use a different port**
```bash
python3 -m http.server 8888
```

**Option B: Kill the existing process (macOS)**
```bash
lsof -ti:8080 | xargs kill -9
```

---

## Close Server

Press `Ctrl + C` in the terminal where the server is running.

If the terminal is closed but the server is still running, use **Option B** above.
