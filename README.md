# Website

Static website for the investor pitch.

## Quick Start

```bash
cd website
python3 -m http.server 8080
open http://localhost:8080
```

## Alternate Port (if needed)

```bash
cd website
python3 -m http.server 8000
open http://localhost:8000
```

## Close Server

Press `Ctrl + C` in the same terminal, or run:

```bash
pkill -f "python3 -m http.server 8080"
```

If you started on port `8000`:

```bash
pkill -f "python3 -m http.server 8000"
```

## Structure

- `index.html`: Main page shell
- `style.v2.css`: Active stylesheet
- `main.js`: Component loader and interactions
- `components/`: Reusable HTML sections
