import request from 'supertest';
import app from '../app'

describe('POST /createVoteSession', () => {
  it('Should create a vote session successfully', async () => {
    const res = await request(app)
    .post('/api/auth/createVoteSession')
    .set('x-session-id', 'validSession123')
    .send({
      userSessionId: "asdasdlkj",
      title: "Test Election",
      description: "this is a test elec",
      images:[],
      startDate: new Date(),
      endDate: new Date(),
      zid_requirement: false,
      locationOfVote: "library"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBeDefined();
  })
})