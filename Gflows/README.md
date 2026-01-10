# `.GSX` – Custom Code Language System

`.GSX` is a framework for creating and running **custom programming languages** in a GitHub repo. Using `.GSX`, you can:  

- Define your own **file types** (like `.kmas`, `.ghd`, etc.)  
- Write a **runtime** (`runtime.js`) to execute your language  
- Add **custom code commands** with a `LANGUAGE` file  
- Include **Node.js packages** per language using `.tml` files  
- Automatically execute code and track dependencies via GitHub Actions  

This system allows anyone to fork your repo and immediately start using your custom language with a ready-to-run workflow.  

---

## Example Folder Structure

MyCustomLanguage/
│
├─ .github/
│   └─ workflows/
│       ├─ GFlow.yml        # workflow to run custom code, install packages, add credit
│       └─ JSX.tml          # optional: Node.js packages for this language
│
├─ runtime.js               # required: executes all custom files
├─ LANGUAGE                 # optional: define custom code commands
├─ syntax.tmlanguage        # optional: syntax highlighting for your custom file type
├─ README.md                # this README, auto-updated with credit
├─ package.json             # optional Node.js dependencies
├─ example.kmas             # example file written in your custom language
└─ utils/
    └─ helper.js            # optional helper scripts

---

## File Explanations

### `runtime.js` (Required)
- Executes all files with your custom extension (`.kmas`, `.ghd`, etc.).
- This is the core engine; required for the custom language to work.

### `LANGUAGE` (Optional)
- Define **custom code commands** or shortcuts for your language.
- Used by `runtime.js` if present.

### `.tml` Files in `.github/workflows/` (Optional)
- Each file lists Node.js packages needed for the language (one package per line).
- Installed automatically by `GFlow.yml` workflow.

### `GFlow.yml` (Required)
- GitHub Actions workflow that:
  - Executes all custom files using `runtime.js`
  - Loads optional `LANGUAGE` commands
  - Installs Node.js packages from `.tml` files
  - Adds credit to `README.md` if missing

### `syntax.tmlanguage` (Optional)
- Adds syntax highlighting for your custom file type in editors that support TextMate grammars.

### `README.md`
- Auto-updated with credit (`Sussybocca`) if missing.

### `package.json` (Optional)
- Node.js dependencies for the repo.

### Example Files (`example.kmas`, `utils/helper.js`)
- Demonstrate your custom language or provide helper scripts.

---

## How to Use

1. **Fork this repo** to create your own custom language instance.
2. Add your custom files (`.kmas`, `.ghd`, etc.) to the repo.
3. Optionally create a `LANGUAGE` file to define custom commands.
4. Add any Node.js packages you need in `.tml` files inside `.github/workflows/`.
5. Push your changes. The `GFlow.yml` workflow will:
   - Install Node.js packages
   - Run your custom files via `runtime.js`
   - Add credit to the README automatically
6. Enjoy coding in your own custom language!

---

## Notes

- `runtime.js` is **mandatory**; the language cannot run without it.
- `LANGUAGE` and `.tml` files are **optional**, but recommended for faster coding and dependencies.
- Forking this repo lets others immediately run your custom code without extra setup.
