// tests/AuthBox.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthBox from '../components/AuthBox';
import * as encryption from '../../../shared/src/encryptionFrontend';

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ sessionId: 'abc123' }),
  })
) as jest.Mock;

describe('AuthBox registration', () => {
  it('sends encrypted zID and zPass to backend', async () => {
    const spyEncrypt = jest.spyOn(encryption, 'encryptData');
    spyEncrypt.mockImplementation(async (text) => `encrypted(${text})`);

    render(<AuthBox />);

    fireEvent.change(screen.getByPlaceholderText('z1234567'), {
      target: { value: 'z1234567' },
    });
    fireEvent.change(screen.getByPlaceholderText('●●●●●●●●●●●●'), {
      target: { value: 'hunter2' },
    });

    fireEvent.click(screen.getByText('Continue'));

    // Wait for async operations to settle
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zID: 'encrypted(z1234567)',
          zPass: 'encrypted(hunter2)',
        }),
      }));
    });
  });
});
