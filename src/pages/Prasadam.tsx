import { useState } from 'react';
import { ShoppingCart, Plus, Minus, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
// import type { Page } from '../App';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Crumb, SectionHead } from '../components/royale';

// interface PrasadamProps {
//   navigate: (page: Page) => void;
// }

interface CartItem {
  id: string;
  quantity: number;
}

const prasadamItems = [
  {
    id: '1',
    name: 'Tirupati Laddu',
    temple: 'Tirupati Balaji',
    price: 50,
    image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwcmFzYWRhbSUyMGZvb2R8ZW58MXx8fHwxNzY1MTA2NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Sacred sweet prasadam from Tirupati'
  },
  {
    id: '2',
    name: 'Peda',
    temple: 'Shirdi Sai Baba',
    price: 100,
    image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwcmFzYWRhbSUyMGZvb2R8ZW58MXx8fHwxNzY1MTA2NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Blessed milk sweet from Shirdi'
  },
  {
    id: '3',
    name: 'Sacred Rice',
    temple: 'Golden Temple',
    price: 75,
    image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwcmFzYWRhbSUyMGZvb2R8ZW58MXx8fHwxNzY1MTA2NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Blessed rice prasadam'
  },
  {
    id: '4',
    name: 'Modak',
    temple: 'Siddhivinayak',
    price: 120,
    image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwcmFzYWRhbSUyMGZvb2R8ZW58MXx8fHwxNzY1MTA2NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Lord Ganesha\'s favorite sweet'
  }
];

export function Prasadam() {

  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);

  const getItemQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0;
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== id);
        }
        return prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
      } else if (change > 0) {
        return [...prev, { id, quantity: 1 }];
      }
      return prev;
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const prasadam = prasadamItems.find(p => p.id === item.id);
      return total + (prasadam?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Prasadam' }]} />

      <SectionHead
        tag="Blessed Offerings"
        title="Prasadam"
        lede="Temple prasadam packed at the sanctum and dispatched to your door within 2–4 days."
      />

      {/* Delivery Location */}
      <div className="card mb-[18px]">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-gold-soft" />
          <div className="flex-1">
            <span className="tag" style={{ marginBottom: 2 }}>Deliver to</span>
            <p className="text-sm">Mumbai, Maharashtra 400001</p>
          </div>
          <button className="btn-ghost">Change</button>
        </div>
      </div>

      {/* Prasadam Items */}
      <div className="space-y-[18px]">
        {prasadamItems.map(item => {
          const quantity = getItemQuantity(item.id);
          
          return (
            <div key={item.id} className="card overflow-hidden">
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground mb-1">{item.name}</h3>
                  <small className="text-muted-foreground block mb-2">{item.temple}</small>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-gold-soft">₹{item.price}</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                {quantity === 0 ? (
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="btn-ghost block w-full"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-gold text-primary-foreground rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary-foreground/10 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary-foreground/10 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary - Fixed Bottom */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-surface border-t border-border p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-gold-soft" />
                <span className="text-sm">{getTotalItems()} items</span>
              </div>
              <span className="text-gold-soft">₹{getTotalAmount()}</span>
            </div>
            <Button 
              fullWidth
              onClick={() => navigate('/prasadam-tracking')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
