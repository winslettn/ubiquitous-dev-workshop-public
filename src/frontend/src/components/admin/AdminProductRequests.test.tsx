import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AdminProductRequests from './AdminProductRequests';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const request = {
  productRequestId: 1,
  reference: 'PR-AAAA1111',
  contactEmail: 'c@example.com',
  itemName: 'Drill',
  description: 'Cordless',
  preferredBrandModel: null,
  targetPrice: null,
  status: 'new',
  productId: null,
  notes: [{ noteId: 7, note: 'internal remark' }],
};

function LoginAs({ email }: { email: string }) {
  const { login, isAdmin } = useAuth();
  return <button onClick={() => login(email, 'pw')}>login {String(isAdmin)}</button>;
}

async function renderAs(email: string) {
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <LoginAs email={email} />
          <AdminProductRequests />
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByRole('button', { name: /login/ }));
}

describe('AdminProductRequests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
    mockedAxios.isAxiosError.mockReturnValue(true);
  });

  it('does not render the queue or call the API for non-admin users', async () => {
    await renderAs('user@example.com');
    expect(screen.queryByText('Product Requests')).not.toBeInTheDocument();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('loads the queue with the staff token and manages status, notes and linking', async () => {
    mockedAxios.get.mockImplementation(async (url: string) => ({
      data: url.endsWith('/1') ? request : [request],
    }));
    mockedAxios.put.mockResolvedValue({ data: {} });
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedAxios.delete.mockResolvedValue({});
    await renderAs('staff@github.com');

    await userEvent.type(screen.getByLabelText(/staff token/i), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /load queue/i }));
    await userEvent.click(await screen.findByRole('button', { name: /view PR-AAAA1111/i }));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/product-requests'),
      { headers: { Authorization: 'Bearer secret' } },
    );
    expect(await screen.findByText('internal remark')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /mark reviewing/i }));
    await waitFor(() =>
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/1/status'),
        { status: 'reviewing' },
        { headers: { Authorization: 'Bearer secret' } },
      ),
    );

    await userEvent.type(screen.getByLabelText(/new note/i), 'follow up');
    await userEvent.click(screen.getByRole('button', { name: /add note/i }));
    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/1/notes'),
        { note: 'follow up' },
        expect.anything(),
      ),
    );

    await userEvent.click(screen.getByRole('button', { name: /delete note/i }));
    await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalled());
  });

  it('shows an authorization error when the server rejects the token', async () => {
    mockedAxios.get.mockRejectedValue({ response: { status: 403 } });
    await renderAs('staff@github.com');
    await userEvent.type(screen.getByLabelText(/staff token/i), 'bad');
    await userEvent.click(screen.getByRole('button', { name: /load queue/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/authorization failed/i);
  });

  it('offers product linking only for fulfilled requests', async () => {
    const fulfilled = { ...request, status: 'fulfilled', productId: 5 };
    mockedAxios.get.mockImplementation(async (url: string) => ({
      data: url.endsWith('/1') ? fulfilled : [fulfilled],
    }));
    mockedAxios.put.mockResolvedValue({ data: {} });
    await renderAs('staff@github.com');
    await userEvent.type(screen.getByLabelText(/staff token/i), 's');
    await userEvent.click(screen.getByRole('button', { name: /load queue/i }));
    await userEvent.click(await screen.findByRole('button', { name: /view PR-AAAA1111/i }));
    expect(await screen.findByText(/linked product: 5/i)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/catalog product id/i), '9');
    await userEvent.click(screen.getByRole('button', { name: /link product/i }));
    await waitFor(() =>
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/1/product'),
        { productId: 9 },
        expect.anything(),
      ),
    );
  });
});
