import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

const loginMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: loginMock }),
}));
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

function renderLogin(url = '/login') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Login />
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe('Login', () => {
  it('renders known error codes as plain text messages', () => {
    renderLogin('/login?error=session_expired');
    expect(screen.getByRole('alert').textContent).toBe(
      'Your session has expired. Please log in again.',
    );
  });

  it('does not render arbitrary error query content as markup', () => {
    renderLogin('/login?error=' + encodeURIComponent('<img src=x onerror=alert(1)>'));
    const alert = screen.getByRole('alert');
    expect(alert.querySelector('img')).toBeNull();
    expect(alert.textContent).toBe('Login failed. Please try again.');
  });

  it('shows feedback when login fails and allows retry', async () => {
    loginMock.mockRejectedValueOnce(new Error('boom'));
    renderLogin();
    await userEvent.type(screen.getByLabelText('Email Address'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Password'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect((screen.getByLabelText('Email Address') as HTMLInputElement).value).toBe('a@b.com');
  });
});
