EXPLAIN.md - Repository Structure Guide
Welcome! If you're looking at the folders here and feeling a bit lost, you're not alone. This repository is the active workshop of a developer who prioritizes shipping updates to the core HSX runtime above all else.

TL;DR: Focus on the /runtime/ folder. Almost everything else is either an experiment, a legacy project, or a stable module that doesn't need frequent attention.

🗺️ The Mental Map: What's What
Here is a simple guide to the main folders and why they exist:

Folder / File	Purpose & Status	How Often It Changes
/runtime/	🚀 PRIMARY FOCUS. This contains the core hsx-runtime.js engine and its direct dependencies. Almost all current development happens here.	Very Frequently. Updated 12-20 times per 2-month development cycle.
/frontend/ & /backend/	🛠️ Runtime Build Targets. These typically contain context-specific versions or builds of the runtime for different environments (e.g., browser vs. Node.js). They are fed from the core /runtime/ work.	Updated alongside the core runtime.
/Mist_Extracted/	✅ STABLE EXTENSIONS. This is the base code for HSX extensions. It is considered feature-complete and stable, so it rarely needs updates. You can mostly ignore it.	Almost Never. It "just works."
/MS/, /KS/, /ZFlows/	🧪 EXPERIMENTAL SANDBOXES. These are sister projects, proof-of-concepts, or legacy tools that are "kinda working, kinda not." They are isolated here so experiments don't break the main runtime.	Sporadically. They are tinkered with when there's spare time or new inspiration.
/examples/ & /docs/	📚 Learning Resources. Example projects and documentation. Updated when new features are added.	Occasionally.
hsx.code-workspace	💻 Developer Environment. The main VS Code workspace file used for active development on this project.	As needed.
.vsix files in Releases	⚠️ Currently Outdated. The packaged VS Code extensions are not the current focus. The latest functionality is always in the runtime source code.	Infrequently. Priority is on the runtime, not the editor tool packaging.
Random root files (extract-mist.js, hsx.mp4, etc.)	🔧 Utilities & Assets. Scratch files, build scripts, logos, or demo assets used for development or the website.	As needed.
❓ Why Does It Look Like This?
The structure follows a "maker's priority" system:

Velocity Over Vanity: The main goal is to push updates to the HSX runtime. The folder structure optimizes for the developer's speed, not for a newcomer's first impression.

Isolation is Safety: Keeping experiments (/MS/, /KS/) and stable code (/Mist_Extracted/) in separate folders prevents accidents and allows the core runtime to evolve cleanly and rapidly.

Clear Focus: If you want to see what's actually happening in the project, look at the commit history for the /runtime/ folder. That's the heartbeat.

👨‍💻 How to Contribute or Explore
To understand HSX: Start with the /runtime/ source code and the /examples/ folder.

To report a bug: Check if it's related to the runtime (look in /runtime/, /frontend/, /backend/) or an experimental project.

To clean up: Proposals to organize the root directory are welcome, but any change must not break the developer's established workflow for updating the runtime.

This is a living workshop, not a museum. The apparent mess is a side effect of constant creation.

