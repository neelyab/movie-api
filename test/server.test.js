const app = require('../server')
const { expect } = require('chai');
const supertest = require('supertest');


describe('Movie Server', ()=>{
    const apiToken = process.env.API_TOKEN
    it('GET returns 401 without authorization',() => {
       return supertest(app)
        .get('/movie')
        .expect(401, '{"error":"unauthorized request"}');
    })
    it('returns an array of objects',()=>{
      return supertest(app)
        .get('/movie')
        .set({'Authorization': `Bearer ${apiToken}`
          })
        .expect(200)
        .then(res=>{
                expect(res.body).to.be.an('array')
            })
        })
})