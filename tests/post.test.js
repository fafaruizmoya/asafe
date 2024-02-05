const supertest = require('supertest')
const buildServer = require('@asafe/api').default

const app = buildServer()

let adminAccessToken = null
let userAccessToken = null
let userId = null
let postIds = []

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

  test('user login', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/login')
      .send({ email: 'test1@example.com', password: 'Test_12345' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.accessToken)
        userAccessToken = String(response.body.accessToken)
        const parts = userAccessToken.split('.')
        const tokenData = JSON.parse(atob(parts[1]))
        userId = tokenData.id
      })
  })
})

describe('POST /posts', () => {
  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ title: 'Updated Text', content: 'Updated Long text' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.id)
        postIds.push(response.body.id)
      })
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .post('/api/posts')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({ title: 'Updated Text', content: 'Updated Long text' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.id)
        postIds.push(response.body.id)
      })
  })
})

describe('GET /posts', () => {
  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .get('/api/posts')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).toBeGreaterThan(0)
      })
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .get('/api/posts?user=' + userId)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send()
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('PUT /posts', () => {
  test('admin', async () => {
    await app.ready()
    await supertest(app.server)
      .put('/api/posts/' + postIds[1])
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ title: 'Updated Text', content: 'Updated Long text by admin' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.id)
      })
  })

  test('user', async () => {
    await app.ready()
    await supertest(app.server)
      .put('/api/posts/' + postIds[1])
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({ title: 'Updated Text', content: 'Updated Long text by user' })
      .expect(200)
      .expect('Content-Type', /json/)
  })
})

describe('DELETE /posts', () => {
  test('admin', async () => {
    const postId = postIds.slice(-1)[0]
    await app.ready()
    await supertest(app.server)
      .delete('/api/posts/' + postId)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(200)
      .then(response => {
        postIds.pop()
      })
  })

  test('user', async () => {
    const postId = postIds.slice(-1)[0]
    await app.ready()
    await supertest(app.server)
      .delete('/api/posts/' + postId)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send()
      .expect(401)
  })

  
  test('all post from a user', async () => {
    await app.ready()
    await supertest(app.server)
      .delete('/api/posts/user/2')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send()
      .expect(200)
  })
})
