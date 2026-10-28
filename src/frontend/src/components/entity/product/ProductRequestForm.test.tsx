import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ProductRequestForm from './ProductRequestForm';
import { ThemeProvider } from '../../../context/ThemeContext';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

function renderForm() {
  return render(
    <ThemeProvider>
      <ProductRequestForm />
    </ThemeProvider>,
  );
}

describe('ProductRequestForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows validation errors and does not submit invalid data', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/contact email/i), 'nope');
    await userEvent.click(screen.getByRole('button', { name: /submit request/i }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Item name is required');
    expect(alert).toHaveTextContent('Description is required');
    expect(alert).toHaveTextContent('valid email');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('rejects a negative target price', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/item name/i), 'Drill');
    await userEvent.type(screen.getByLabelText(/description/i), 'Cordless');
    await userEvent.type(screen.getByLabelText(/contact email/i), 'a@b.co');
    await userEvent.type(screen.getByLabelText(/target price/i), '-3');
    await userEvent.click(screen.getByRole('button', { name: /submit request/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('non-negative');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('submits and shows the reference with the no-promise confirmation', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { reference: 'PR-ABCD1234', message: 'Submitting does not guarantee anything.' },
    });
    renderForm();
    await userEvent.type(screen.getByLabelText(/item name/i), 'Drill');
    await userEvent.type(screen.getByLabelText(/description/i), 'Cordless');
    await userEvent.type(screen.getByLabelText(/contact email/i), 'a@b.co');
    await userEvent.type(screen.getByLabelText(/preferred brand/i), 'Acme');
    await userEvent.type(screen.getByLabelText(/target price/i), '50');
    await userEvent.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => expect(screen.getByTestId('request-reference')).toHaveTextContent('PR-ABCD1234'));
    expect(screen.getByText(/does not guarantee/i)).toBeInTheDocument();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/product-requests'),
      expect.objectContaining({
        contactEmail: 'a@b.co',
        itemName: 'Drill',
        preferredBrandModel: 'Acme',
        targetPrice: 50,
      }),
    );
  });

  it('shows the server error message on failure', async () => {
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAxios.post.mockRejectedValue({
      response: { data: { error: { message: 'Validation error: bad' } } },
    });
    renderForm();
    await userEvent.type(screen.getByLabelText(/item name/i), 'Drill');
    await userEvent.type(screen.getByLabelText(/description/i), 'Cordless');
    await userEvent.type(screen.getByLabelText(/contact email/i), 'a@b.co');
    await userEvent.click(screen.getByRole('button', { name: /submit request/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Validation error: bad');
  });
});
