const { expect } = require('chai');
const sinon = require('sinon')

const deprecatedRoute = require('../../src/middlewares/deprecatedRoute');
const attachDeprecatedInfo = require('../../src/middlewares/attachDeprecatedInfo');

describe('Middlewares Deprecated (Niveau-1)', () => {

    describe('Middlewares Deprecated - deprecatedRoute (niveau-1)', () => {

        it('doit ajouter le header X-Deprecated: true', () => {
            const req = {};
            const res = {
                setHeader: sinon.spy(),
                locals: {}
            };
            const next = sinon.spy();

            deprecatedRoute(req, res, next);

            expect(res.setHeader.calledWith('X-Deprecated', 'true')).to.be.true;
            expect(res.locals.deprecated).to.equal(true);
            expect(next.calledOnce).to.be.true;
        });

    });

    describe('Middlewares Deprecated - attachDeprecatedInfo (niveau-1)', () => {

        it('doit ajouter le bloc deprecated dans la réponse JSON', () => {
            const req = {};
            const res = {
                locals: { deprecated: true },
                json: sinon.spy()
            };

            attachDeprecatedInfo(req, res, () => { });

            const body = { user: { name: 'John' } };
            res.json(body);

            expect(body.deprecated).to.deep.equal({
                since: "v0.2.1-dev",
                alternative: "/api/users"
            });
        });

        it('ne doit rien ajouter si la route n’est pas dépréciée', () => {
            const req = {};
            const res = {
                locals: {},
                json: sinon.spy()
            };

            attachDeprecatedInfo(req, res, () => { });

            const body = { ok: true };
            res.json(body);

            expect(body).to.not.have.property('deprecated');
        });

    });

});