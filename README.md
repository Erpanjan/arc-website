# Website

Static website for the investor pitch.

## Quick Start

Run these commands from the **website root directory**:

1.  **Start the server**:
    ```bash
    # Try port 8080 first
    python3 -m http.server 8080
    ```
2.  **View the site**:
    Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Troubleshooting: "Address already in use"

If you see an error saying `[Errno 48] Address already in use`, it means another server is already running on that port.

**Option A: Use a different port**
```bash
python3 -m http.server 8888
```

**Option B: Kill the existing process (macOS)**
```bash
# Find and kill the process on port 8080
lsof -ti:8080 | xargs kill -9
```

---

## Close Server

Press `Ctrl + C` in the terminal where the server is running.

If the terminal is closed but the server is still running, use the **Option B** command above to clear the port.

## Structure

- `index.html`: Main page shell
- `style.v2.css`: Active stylesheet
- `main.js`: Component loader and interactions
- `components/`: Reusable HTML sections
