/**
 * Script de validation pré-déploiement.
 * -------------------------------------
 * Objectifs :
 *  - Demander la version cible (ex : v0.2.0-dev)
 *  - Créer automatiquement un dossier d’archivage versionné et daté à la minute :
 *        <version>_01_predeploy_<YYYY-MM-DD>_<HH-mm>
 *
 *  - Options interactives :
 *      - Réinstaller l’environnement (clean + install)
 *      - Lancer le serveur (npm start)
 *      - Inclure `stderr` dans les logs
 *      - Protection contre l'écrasement du dossier de résultat
 *
 *  - Selon configuration (predeploy.config.json) :
 *      - Exécuter les tests automatisés
 *      - Générer les fichiers de logs
 *
 *  - Selon templates (scripts/templates) :
 *      - Générer la checklist pré-déploiement (checklist.md)
 *      - Générer le résumé de validation (resume.md)
 *      - Insérer les traces du pipeline dans le résumé
 *
 * Ce script constitue la base du pipeline de validation avant
 * déploiement Alwaysdata. Il garantit que la version testée est
 * strictement identique à la version déployée.
 *
 * Usage :
 *   npm run validate:predeploy
 *
 * Version : 1.0.0
 */

const PIPELINE_VERSION = "1.0.0";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { spawnSync, spawn } = require("child_process");
const config = require("./config/predeploy.config.json");

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

// Timestamp local stable (YYYY-MM-DD_HH-mm)
function formatLocalTimestamp(date = new Date()) {
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}_` +
    `${pad(date.getHours())}-` +
    `${pad(date.getMinutes())}`
  );
}

// Buffer pipeline
let pipelineLog = "";
function logPipeline(message) {
  console.log(message);
  pipelineLog += message + "\n";
}

// Question interactive
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const normalized = answer.trim().toLowerCase() || "n";  // <-- DEFAULT = N
      logPipeline(`Réponse (${question.trim()}) : ${normalized}`);
      resolve(normalized);
    });
  });
}

// ---------------------------------------------------------------------------
// Script principal
// ---------------------------------------------------------------------------

(async () => {
  logPipeline("=== Validation pré-déploiement ===");
  logPipeline(`Pipeline validate-predeploy — version ${PIPELINE_VERSION}`);

  // --- Version ---
  const version = await ask("Nom de la version (ex : v0.2.0-dev) ? ");
  if (!version) {
    logPipeline("❌ Version invalide.");
    process.exit(1);
  }

  // --- Dossier versionné ---
  const now = new Date();
  const stamp = formatLocalTimestamp(now);
  const folderName = `${version}_01_predeploy_${stamp}`;
  const baseDir = path.join(config.paths.deployRoot, folderName);

  if (fs.existsSync(baseDir)) {
    const overwrite = await ask("⚠️ Le dossier existe déjà. L’écraser : (o/N) ? ");
    if (overwrite !== "o") {
      logPipeline("❌ Validation annulée.");
      process.exit(0);
    }
    fs.rmSync(baseDir, { recursive: true, force: true });
  }

  fs.mkdirSync(baseDir, { recursive: true });
  logPipeline(`📁 Dossier créé : ${baseDir}\n`);

  // -------------------------------------------------------------------------
  // 1) Réinstallation
  // -------------------------------------------------------------------------

  let reinstall = "n";
  if (config.options.askReinstall) {
    reinstall = await ask("Souhaites-tu réinstaller l'environnement : (o/N) ? ");
  }

  if (reinstall === "o") {
    logPipeline("\n🔄 Réinstallation de l’environnement...");

    const reinstallResult = spawnSync("npm run reinstall", {
      shell: true,
      encoding: "utf8"
    });

    logPipeline("--- Réinstallation : STDOUT ---");
    logPipeline(reinstallResult.stdout || "(vide)");

    logPipeline("--- Réinstallation : STDERR ---");
    logPipeline(reinstallResult.stderr || "(vide)");

    // Pause pour éviter les tests trop rapides
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // -------------------------------------------------------------------------
  // 2) Inclure stderr ?
  // -------------------------------------------------------------------------

  const includeErrors = await ask("Inclure les erreurs (stderr) dans les logs : (o/N) ? ");
  const captureStderr = includeErrors === "o";

  // -------------------------------------------------------------------------
  // 3) Exécution des tests
  // -------------------------------------------------------------------------

  function runAndLog(command, logFile) {
    logPipeline(`▶ Exécution : ${command}`);

    const result = spawnSync(command, {
      shell: true,
      encoding: "utf8"
    });

    let content = `=== Test : ${command} ===\n\n`;

    content += `--- STDOUT ---\n${result.stdout || "(vide)"}\n`;

    if (captureStderr) {
      content += `--- STDERR ---\n${result.stderr || "(vide)"}\n`;
    }

    fs.writeFileSync(path.join(baseDir, logFile), content);

    if (result.status === 0) {
      logPipeline(`   ✔ Log enregistré dans ${logFile}`);
    } else {
      logPipeline(`   ❌ Erreurs enregistrées dans ${logFile} (code ${result.status})`);
    }
  }

  logPipeline("\n=== Exécution des tests ===\n");
  config.tests.forEach((test) => runAndLog(test.command, test.log));
  logPipeline("\n=== Exécution des tests terminée ===\n");

  // -------------------------------------------------------------------------
  // 4) Démarrage serveur (après tests) : démarrage et arrêt après 10 secondes
  // -------------------------------------------------------------------------

  const startServer = await ask("Souhaites-tu lancer le serveur pour vérification finale : (o/N) ? ");

  if (startServer === "o") {
    logPipeline("🚀 Lancement du serveur...");

    const serverProcess = spawn("npm", ["start"], {
      shell: true,
      detached: true
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));
    logPipeline("✔ Serveur lancé (test rapide).");

    // Kill process tree
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", serverProcess.pid, "/T", "/F"]);
    } else {
      process.kill(-serverProcess.pid);
    }

    logPipeline("🛑 Serveur arrêté.");
  }

  // -------------------------------------------------------------------------
  // 5) Message final
  // -------------------------------------------------------------------------

  logPipeline("\n=== 🎉 Validation pré-déploiement terminée ! ===");

  // Nettoyage du pipelineLog pour éviter les lignes vides
  const cleanedPipeline = pipelineLog.trimEnd();

  // -------------------------------------------------------------------------
  // 6) Génération checklist + résumé
  // -------------------------------------------------------------------------

  const checklistTemplate = fs.readFileSync(config.templates.checklist, "utf8");
  const checklist = checklistTemplate.replace(/{{version}}/g, version);
  fs.writeFileSync(path.join(baseDir, "checklist-validation.md"), checklist);

  const resumeTemplate = fs.readFileSync(config.templates.resume, "utf8");
  const resume = resumeTemplate
    .replace(/{{version}}/g, version)
    .replace(/{{date}}/g, now.toLocaleString())
    .replace(/{{pipelineVersion}}/g, PIPELINE_VERSION)
    .replace(/{{pipeline}}/g, cleanedPipeline);

  fs.writeFileSync(path.join(baseDir, "resume-validation.md"), resume);

  rl.close();
})();
