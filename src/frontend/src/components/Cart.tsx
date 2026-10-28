import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { darkMode } = useTheme();
  const text = darkMode ? 'text-light' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className={`text-3xl font-bold ${text}`}>Shopping Cart</h1>
        {items.length === 0 ? (
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-10 text-center shadow`}
            role="status"
          >
            <p className={`${text} text-lg font-medium`}>Your cart is empty</p>
            <Link to="/products" className="text-primary hover:text-accent mt-2 inline-block">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow flex items-center gap-4`}
                >
                  <img
                    src={`/${item.imgName}`}
                    alt={item.name}
                    className="h-20 w-20 object-contain"
                  />
                  <div className="flex-grow">
                    <h2 className={`font-semibold ${text}`}>{item.name}</h2>
                    <p className={muted}>${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-8 h-8 ${text} hover:text-primary`}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span className={`${text} min-w-[2rem] text-center`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={`w-8 h-8 ${text} hover:text-primary`}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className={`${text} w-24 text-right font-semibold`}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-400"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <button onClick={clearCart} className={`${muted} hover:text-primary`}>
                Clear cart
              </button>
              <p className={`text-xl font-bold ${text}`}>
                Total: <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
