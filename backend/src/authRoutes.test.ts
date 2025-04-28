import request from 'supertest';
import app from '../src/app'

describe('POST /createVoteSession', () => {
  it('Should create a vote session successfully', async () => {
    const res = await request(app)
    .post('/createVoteSession')
    .set('x-session-id', 'validSession123')
    .send({
      title: "Test Election",
      description: "this is a test elec",
      images:[],
      startDate: new Date(),
      endDate: new Date(),
      zid_requirements: false,
      locationOfVote: "library"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBeDefined;
  })
})