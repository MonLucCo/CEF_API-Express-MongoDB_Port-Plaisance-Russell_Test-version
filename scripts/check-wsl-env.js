/**
 * check-wsl-env.js
 * Vérification complète de l’environnement WSL.
 */

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

// Timestamp YYYY-MM-DD_HH-mm
function stamp() {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

// Vérifier WSL
if (!process.env.WSL_DISTRO_NAME) {
    console.error("❌ Ce script doit être exécuté dans WSL.");
    process.exit(1);
}

// Préparer dossier logs
const logDir = "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, `check-wsl-env_${stamp()}.log`);
let log = "";

// Fonction utilitaire : capture STDOUT + STDERR
function run(cmd) {
    log += `\n▶ ${cmd}\n`;

    try {
        const result = execSync(cmd, {
            encoding: "utf8",
            stdio: ["pipe", "pipe", "pipe"] // capture stdout + stderr
        });

        log += result + "\n";
        return result;

    } catch (err) {
        const out = err.stdout?.toString() || "";
        const errout = err.stderr?.toString() || "";

        log += out + errout + "\n";
        return null;
    }
}

// ---------------------------------------------------------------------------
// Vérifications
// ---------------------------------------------------------------------------

log += "=== Vérification environnement WSL ===\n";

// Node
run("node -v");

// npm
run("npm -v");

// rsync
run("rsync --version");

// SSH (écrit dans stderr → maintenant capturé dans un speudo terminal PTY)
run('script -q -c "ssh -V" /dev/null');

// jq
run("jq --version");

// ---------------------------------------------------------------------------
// Clés SSH
// ---------------------------------------------------------------------------

log += "\n=== Clé SSH ===\n";

["id_ed25519", "id_ed25519.pub"].forEach((file) => {
    const p = `${process.env.HOME}/.ssh/${file}`;
    if (fs.existsSync(p)) {
        log += `✔ ${file} présent\n`;
    } else {
        log += `❌ ${file} manquant\n`;
    }
});

// ---------------------------------------------------------------------------
// Scripts .sh
// ---------------------------------------------------------------------------

log += "\n=== Scripts .sh ===\n";

if (fs.existsSync("scripts")) {
    const scripts = fs.readdirSync("scripts").filter((f) => f.endsWith(".sh"));

    scripts.forEach((file) => {
        const content = fs.readFileSync(`scripts/${file}`, "utf8");

        if (content.includes("\r")) {
            log += `❌ ${file} contient CRLF\n`;
        } else {
            log += `✔ ${file} en LF\n`;
        }
    });
} else {
    log += "❌ Dossier scripts/ introuvable\n";
}

// ---------------------------------------------------------------------------
// Finalisation
// ---------------------------------------------------------------------------

log += "\n✔ Vérification terminée.\n";

// Sauvegarde du log
fs.writeFileSync(logFile, log);

console.log(`✔ Vérification terminée. Log : ${logFile}`);
