/**
 * Helper – createTestUser()
 * ------------------------------------------------------------------
 * Crée un utilisateur de test et génère un token JWT valide.
 *
 * Rôle :
 *   - Simplifier la création d’un utilisateur authentifié dans les tests.
 *   - Garantir que le token est signé avec jwtConfig.secret, c’est-à-dire
 *     la même clé que celle utilisée par le middleware d’authentification.
 *
 * Pourquoi ce helper existe :
 *   - Évite la duplication de code dans les tests d’intégration.
 *   - Assure une cohérence totale entre signature et vérification JWT.
 *   - Rend les tests plus lisibles et plus robustes.
 *
 * Utilisation typique dans un fichier de tests :
 *   const createTestUser = require('../helpers/createTestUser');
 *
 *   let token;
 *   beforeEach(async () => {
 *       const { token: t } = await createTestUser();
 *       token = t;
 *   });
 *
 * Retourne :
 *   { user, token }
 *
 * @module tests/helpers/createTestUser
 * @requires bcrypt
 * @requires jwt
 * @requires jsonwebtoken
 * @requires module:src/models/user
 * @requires module:config/jwt
 * @version 0.1.0 
 */
const User = require('../../src/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

async function createTestUser() {
    const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10)
    });

    const token = jwt.sign({ userId: user._id }, jwtConfig.secret);

    return { user, token };
}

module.exports = createTestUser;
