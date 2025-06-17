import request from 'supertest';
import app from '../server.js';

let token;
let testUserId;

const testUser = {
  name: 'Aditi Tester',
  email: 'aditi.test@example.com',
  password: 'test12345',
};

describe('Temporary', () => {
  it('should pass', () => {
    expect(1).toBe(1);
  });
});


describe('🧪 Secure Deletion API', () => {

  // REGISTER
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  // LOGIN
  it('should log in the user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  // DEACTIVATE
  it('should deactivate the user', async () => {
    const res = await request(app)
      .patch('/api/user/deactivate')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deactivated/i);
  });

  // REACTIVATE
  it('should reactivate the user', async () => {
    const res = await request(app)
      .patch('/api/user/reactivate')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/reactivated/i);
  });

  // DELETE ACCOUNT
  it('should delete the user account', async () => {
    const res = await request(app)
      .delete('/api/user/delete')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  // ADMIN LOG ACCESS (optional test if admin user exists)
  it('should block non-admin from viewing deletion logs', async () => {
    const res = await request(app)
      .get('/api/admin/deletions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/admin/i);
  });
});
