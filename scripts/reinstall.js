/**
 * Script de réinstallation complète de l’environnement.
 * -----------------------------------------------------
 * Objectifs :
 *  - Exécuter le script clean.js
 *  - Réinstaller toutes les dépendances via npm install
 *
 * Ce script garantit une installation reproductible et cohérente
 * avec l’état réel du projet, notamment avant un pré-déploiement.
 *
 * Usage :
 *   npm run reinstall
 *
 * Version : 1.0.0
 */
const { execSync } = require("child_process");

console.log("🔄 Réinstallation complète de l'environnement...");

try {
    execSync("node scripts/clean.js", { stdio: "inherit" });

    console.log("➡ Installation des dépendances...");
    execSync("npm install", { stdio: "inherit" });

    console.log("✔ Réinstallation terminée !");
} catch (err) {
    console.error("❌ Erreur lors de la réinstallation :", err.message);
    process.exit(1);
}
