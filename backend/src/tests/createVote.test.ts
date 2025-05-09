import request from 'supertest';
import app from '../app';
import { clear, createAndStoreSession } from '../data/dataStore';

describe('POST /createVoteSession', () => {
  beforeEach(() => {
    clear();
  });

  it('Should create a vote session successfully', async () => {
    const mockUserId = 'test-user-123';
    const sessionId = createAndStoreSession(mockUserId);

    const res = await request(app)
      .post('/api/auth/createVoteSession')
      .set('x-session-id', sessionId)
      .send({
        title: "Test Election",
        description: "This is a test election",
        images: [],
        startDate: new Date(),
        endDate: new Date(),
        zid_requirement: false,
        locationOfVote: "library"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBeDefined();
  });
});
