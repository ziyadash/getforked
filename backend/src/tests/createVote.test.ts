import request from 'supertest';
import app from '../app';
import { clear, createAndStoreSession } from '../data/dataStore';

describe('POST /createVoteSession', () => {
  beforeEach(() => {
    clear();
  });

  it('Should create a vote session successfully', async () => {
    const mockUserId = 'test-user-123';

    console.log("Mock user ID: " + mockUserId);

    const sessionId = createAndStoreSession(mockUserId);

    console.log("mock session id: " + sessionId);

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
    
    console.log("received status: " + res.statusCode);



    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBeDefined();
  });
});
