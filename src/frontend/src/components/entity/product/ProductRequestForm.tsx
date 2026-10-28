import { useState, FormEvent } from 'react';
import axios from 'axios';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface Confirmation {
  reference: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProductRequestForm() {
  const { darkMode } = useTheme();
  const [contactEmail, setContactEmail] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [preferredBrandModel, setPreferredBrandModel] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const validate = (): string[] => {
    const found: string[] = [];
    if (!itemName.trim()) {found.push('Item name is required');}
    if (!description.trim()) {found.push('Description is required');}
    if (!contactEmail.trim()) {found.push('Contact email is required');}
    else if (!EMAIL_PATTERN.test(contactEmail.trim())) {found.push('Contact email must be a valid email address');}
    if (targetPrice.trim() && (!Number.isFinite(Number(targetPrice)) || Number(targetPrice) < 0)) {
      found.push('Target price must be a non-negative number');
    }
    return found;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (found.length > 0) {return;}

    setSubmitting(true);
    try {
      const { data } = await axios.post<Confirmation>(
        `${api.baseURL}${api.endpoints.productRequests}`,
        {
          contactEmail: contactEmail.trim(),
          itemName: itemName.trim(),
          description: description.trim(),
          preferredBrandModel: preferredBrandModel.trim() || undefined,
          targetPrice: targetPrice.trim() ? Number(targetPrice) : undefined,
        },
      );
      setConfirmation(data);
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.error?.message : undefined;
      setErrors([message || 'Could not submit your request. Please try again later.']);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setConfirmation(null);
    setContactEmail('');
    setItemName('');
    setDescription('');
    setPreferredBrandModel('');
    setTargetPrice('');
    setErrors([]);
  };

  const inputClass = `w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:outline-none`;
  const labelClass = `block text-sm font-medium mb-1 ${darkMode ? 'text-light' : 'text-gray-700'}`;

  return (
    <section
      aria-labelledby="product-request-heading"
      className={`rounded-lg p-6 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <h2
        id="product-request-heading"
        className={`text-xl font-bold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}
      >
        Can&apos;t find what you need?
      </h2>
      <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Tell us about a product that is not in our catalog. No account is required.
      </p>

      {confirmation ? (
        <div role="status" className={darkMode ? 'text-light' : 'text-gray-800'}>
          <p className="font-semibold">
            Request received. Your reference is{' '}
            <span data-testid="request-reference">{confirmation.reference}</span>
          </p>
          <p className="mt-2 text-sm">{confirmation.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {errors.length > 0 && (
            <ul role="alert" className="text-red-500 text-sm list-disc pl-5">
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
          <div>
            <label htmlFor="request-item-name" className={labelClass}>
              Item name *
            </label>
            <input
              id="request-item-name"
              className={inputClass}
              value={itemName}
              maxLength={200}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="request-description" className={labelClass}>
              Description *
            </label>
            <textarea
              id="request-description"
              className={inputClass}
              rows={3}
              value={description}
              maxLength={2000}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="request-brand-model" className={labelClass}>
                Preferred brand/model
              </label>
              <input
                id="request-brand-model"
                className={inputClass}
                value={preferredBrandModel}
                maxLength={200}
                onChange={(e) => setPreferredBrandModel(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="request-target-price" className={labelClass}>
                Target price
              </label>
              <input
                id="request-target-price"
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="request-contact-email" className={labelClass}>
              Contact email *
            </label>
            <input
              id="request-contact-email"
              type="email"
              className={inputClass}
              value={contactEmail}
              maxLength={254}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit request'}
          </button>
        </form>
      )}
    </section>
  );
}
