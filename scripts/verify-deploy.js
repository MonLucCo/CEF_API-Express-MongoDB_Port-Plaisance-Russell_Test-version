/**
 * verify-deploy.js
 * Pipeline complet de validation du déploiement Alwaysdata.
 * 
 * Ce script doit être exécuté dans un terminal WSL car il nécessite un environnement Ubuntu pour la bonne exécution des 
 * script `*.sh` spécifiques au déploiement automatisé exploitant la commande `rsync`.
 * 
 * Version 1.0.0
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { spawnSync } = require("child_process");

const PIPELINE_VERSION = "1.0.0";

// Vérifier WSL
if (!process.env.WSL_DISTRO_NAME) {
    console.error("❌ Ce pipeline doit être exécuté dans WSL.");
    process.exit(1);
}

// Timestamp
function stamp() {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

// Buffer pipeline
let pipeline = "";

// Log pipeline
function log(msg) {
    console.log(msg);
    pipeline += msg + "\n";
}

// Question interactive
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(q) {
    return new Promise((resolve) => {
        rl.question(q, (ans) => {
            const normalized = ans.trim().toLowerCase() || "n";
            log(`Réponse (${q.trim()}) : ${normalized}`);
            resolve(normalized);
        });
    });
}

(async () => {
    log("=== Pipeline Deploy ===");
    log(`\n🛠️ Version pipeline : ${PIPELINE_VERSION}\n`);

    // Version
    const version = await ask("Version à déployer (ex : v0.2.0-dev) : ");
    if (!version) {
        log("❌ Version invalide.");
        process.exit(1);
    }

    // Dossier versionné
    const folder = `${version}_02_deploy_${stamp()}`;
    const baseDir = path.join("docs-dev/tests/deploiements", folder);
    fs.mkdirSync(baseDir, { recursive: true });
    log(`📁 Dossier créé : ${baseDir}`);

    // Fonction utilitaire
    function runAndSave(cmd, file) {
        log(`▶ ${cmd}`);
        const result = spawnSync(cmd, { shell: true, encoding: "utf8" });

        const content =
            `=== ${cmd} ===\n\n` +
            `--- STDOUT ---\n${result.stdout || "(vide)"}\n\n` +
            `--- STDERR ---\n${result.stderr || "(vide)"}\n`;

        fs.writeFileSync(path.join(baseDir, file), content);

        if (result.status === 0) {
            log(`✔ Log enregistré : ${file}`);
        } else {
            log(`❌ Erreur (code ${result.status}) — log : ${file}`);
        }
    }

    // Exécution pipeline
    runAndSave("npm run deploy:check", "01_deploy-check.log");
    runAndSave("npm run deploy:preview", "02_deploy-preview.log");
    runAndSave("npm run deploy:dry", "03_deploy-dry.log");

    const confirm = await ask("Lancer le déploiement réel : (o/N) ? ");
    if (confirm === "o") {
        runAndSave("npm run deploy -- --deploy", "04_deploy.log");
    } else {
        log("⏹ Déploiement annulé.");
    }

    // -------------------------------------------------------------------------
    // Test API après redémarrage manuel
    // -------------------------------------------------------------------------

    const testApi = await ask("Le serveur Alwaysdata a-t-il été redémarré manuellement ? (o/N) : ");

    if (testApi === "o") {
        log("🔍 Test d'accès à l'API en production...");

        const apiTest = spawnSync(
            'curl -I https://perlucco.alwaysdata.net/api/port-plaisance-russell',
            { shell: true, encoding: "utf8" }
        );

        const apiLog =
            `=== Test API ===\n\n` +
            `--- STDOUT ---\n${apiTest.stdout || "(vide)"}\n\n` +
            `--- STDERR ---\n${apiTest.stderr || "(vide)"}\n`;

        fs.writeFileSync(path.join(baseDir, "05_api-test.log"), apiLog);

        if (apiTest.status === 0) {
            log("✔ API accessible — log : 05_api-test.log");
        } else {
            log("❌ API inaccessible — log : 05_api-test.log");
        }
    } else {
        log("⏭ Test API ignoré (redémarrage non effectué).");
    }

    // Fin du pipeline   
    log("\n=== Pipeline Deploy terminé ! ===\n");

    // Nettoyage du Pipeline avant restitution
    const cleanedPipeline = pipeline.trimEnd();

    // Templates
    const checklist = fs
        .readFileSync("scripts/templates/checklist-deploy.md", "utf8")
        .replace(/{{version}}/g, version);

    fs.writeFileSync(path.join(baseDir, "checklist-deployment.md"), checklist);

    const resume = fs
        .readFileSync("scripts/templates/resume-deploy.md", "utf8")
        .replace(/{{version}}/g, version)
        .replace(/{{date}}/g, new Date().toLocaleString())
        .replace(/{{pipeline}}/g, cleanedPipeline)
        .replace(/{{pipelineVersion}}/g, PIPELINE_VERSION);

    fs.writeFileSync(path.join(baseDir, "resume-deploy.md"), resume);

    log("🎉 Pipeline Deploy terminé !");

    rl.close();
})();
