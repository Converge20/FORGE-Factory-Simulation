# Apply Phase 3 to the existing private repository

GitHub access still returns HTTP 404. The working folder is an exported application, not a Git checkout. No replacement repository was created and no push, main-branch change, merge or public deployment is claimed.

The patch targets the exact Phase 2 snapshot in the preserved `forge-phase2-source.zip`. It includes source, configuration, research, documentation and tests; generated build files and installed dependencies are omitted from the patch. The full Phase 3 source ZIP and separate production ZIP contain the new prebuilt application.

In an authenticated checkout or existing Codespace for `Converge20/FORGE-Factory-Simulation`, download the patch, then:

```sh
git switch main
git pull --ff-only
git switch -c feature/phase-3-explorer
git apply --check /path/to/forge-phase3.patch
git apply /path/to/forge-phase3.patch
npm ci
npm test
npm run build
npm run dev
```

If `git apply --check` fails, stop and inspect differences instead of forcing the update: the remote baseline could not be read. The full source ZIP provides a file-by-file transfer alternative onto the same feature branch. Commit and push only that branch after your review. Do not make the repository public or merge main without approval.

For review in Codespaces, keep port 5173 **Private** and choose **Open in Browser**. The downloaded single-file HTML review copy is an additional route; it contains the real React/Three.js application. Browser policies may block opening local HTML, in which case use the private Codespaces preview or an existing static server.
