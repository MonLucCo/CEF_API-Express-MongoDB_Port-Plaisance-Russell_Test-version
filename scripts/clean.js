/**
 * Script de nettoyage de l’environnement local du projet.
 * --------------------------------------------------------
 * Objectifs :
 *  - Supprimer le dossier node_modules/
 *  - Supprimer package-lock.json
 *  - Nettoyer le cache npm
 *
 * Ce script garantit un environnement propre avant une réinstallation
 * complète ou une validation pré-déploiement.
 *
 * Usage :
 *   npm run clean
 *
 * Version : 1.0.0
 */
const { execSync } = require("child_process");
const fs = require("fs");

console.log("🧹 Nettoyage du projet...");

try {
    if (fs.existsSync("node_modules")) {
        console.log("➡ Suppression de node_modules...");
        execSync("rm -rf node_modules", { stdio: "inherit" });
    }

    if (fs.existsSync("package-lock.json")) {
        console.log("➡ Suppression de package-lock.json...");
        fs.unlinkSync("package-lock.json");
    }

    console.log("➡ Nettoyage du cache npm...");
    execSync("npm cache clean --force", { stdio: "inherit" });

    console.log("✔ Nettoyage terminé !");
} catch (err) {
    console.error("❌ Erreur lors du nettoyage :", err.message);
    process.exit(1);
}
