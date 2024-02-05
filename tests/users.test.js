const supertest = require('supertest')
const buildServer = require('@asafe/api').default

const app = buildServer(true)

let adminAccessToken = null
let userAccessToken = null
let userIds = []
let userToDelete = null
const email = 'test' + Math.floor(Math.random() * 100) + '@example.com'

describe('POST /login', () => {
  test('admin login', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/login')
      .send({ email: 'admin@admin.com', password: 'Admin_1234' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.accessToken)
        adminAccessToken = response.body.accessToken
      })
  })

  test('error user login', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/login')
      .send({ email: 'test2@example.com', password: 'Test_1234' })
      .expect([400, 401])
      .expect('Content-Type', /json/)
  })

  test('user login', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/login')
      .send({ email: 'test1@example.com', password: 'Test_12345' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.accessToken)
        userAccessToken = response.body.accessToken
      })
  })
})

describe('GET /users', () => {
  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).toBeGreaterThan(0)
        userIds = userIds.concat(response.body.map((user) => { return { id: user.id, email: user.email } }))
      })
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .get('/api/users')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send()
      .expect(401)
      .expect('Content-Type', /json/)
  })
})

describe('POST /users', () => {
  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ email, password: 'Test_12345' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.id)
        userIds.push({ id: response.body.id, email: response.body.email })
      })
  })

  test('user already exists', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ email, password: 'Test_12345' })
      .expect(409)
      .expect('Content-Type', /json/)
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/users')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({ email, password: 'Test_12345' })
      .expect(401)
      .expect('Content-Type', /json/)
  })
})

describe('PUT /users', () => {
  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .put('/api/users/' + userIds[1].id)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ email: userIds[1].email, firstName: 'Test3', lastName: 'Test' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.id)
        expect(response.body.firstName).toEqual('Test3')
        expect(response.body.lastName).toEqual('Test')
      })
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .put('/api/users/' + userIds[1].id)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({ email: userIds[1].email, firstName: 'Test3', lastName: 'Test' })
      .expect(401)
      .expect('Content-Type', /json/)
  })
})

describe('DELETE /users', () => {
  test('admin', async () => {
    userToDelete = userIds.slice(-1)[0]
    await app.ready()
    await supertest(app.server)
      .delete('/api/users/' + userToDelete.id)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200)
      .then(response => {
        userIds.pop()
      })
  })

  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .delete('/api/users/' + userToDelete.id)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(404)
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .delete('/api/users/' + userToDelete.id)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(401)
  })
})
