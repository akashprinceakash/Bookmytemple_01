import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Crumb, SectionHead } from '../components/royale';
// import type { Page } from '../App';

// interface PrasadamTrackingProps {
//   navigate: (page: Page) => void;
// }

export function PrasadamTracking() {

  const orderStatus = [
    { status: 'Order Confirmed', time: '10:30 AM', completed: true },
    { status: 'Being Prepared', time: '11:00 AM', completed: true },
    { status: 'Out for Delivery', time: '2:30 PM', completed: true },
    { status: 'Delivered', time: 'Expected by 4:00 PM', completed: false }
  ];

  return (
    <PageShell>
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Prasadam', to: '/prasadam' },
          { label: 'Tracking' },
        ]}
      />

      <SectionHead
        tag="On its way"
        title="Prasadam Tracking"
        lede="Follow your prasad from the sanctum to your doorstep."
      />

      <div>
        {/* Order ID */}
        <div className="card mb-[18px]">
          <span className="tag" style={{ marginBottom: 2 }}>Order ID</span>
          <h3 className="serif text-[22px] text-gold-soft">BMT{Date.now().toString().slice(-8)}</h3>
        </div>

        {/* Delivery Status */}
        <div className="card mb-[18px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-gold-soft" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">Out for Delivery</h3>
              <p className="text-sm text-muted-foreground">Expected delivery by 4:00 PM</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {orderStatus.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-success'
                      : 'bg-surface-2'
                  }`}>
                    {step.completed && <CheckCircle className="w-5 h-5 text-primary-foreground" />}
                  </div>
                  {index < orderStatus.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      step.completed ? 'bg-success' : 'bg-surface-2'
                    }`}></div>
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <p className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.status}
                  </p>
                  <small className="text-muted-foreground">{step.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card mb-[18px]">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gold-soft mt-0.5" />
            <div className="flex-1">
              <h3 className="mb-2">Delivery Address</h3>
              <p className="text-sm text-muted-foreground">
                Rajesh Kumar<br />
                123, MG Road, Andheri West,<br />
                Mumbai, Maharashtra - 400001<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card mb-[18px]">
          <h3 className="mb-4">Order Items</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tirupati Laddu × 2</span>
              <span>₹100</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peda × 1</span>
              <span>₹100</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span>Total</span>
              <span className="text-gold-soft">₹200</span>
            </div>
          </div>
        </div>

        {/* Delivery Person Info */}
        <div className="rounded-[18px] bg-gradient-gold p-5 text-primary-foreground shadow-gold">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-foreground/15 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <small className="text-primary-foreground/80">Delivery Partner</small>
              <p>Amit Sharma</p>
              <small className="text-primary-foreground/80">+91 98765 12345</small>
            </div>
            <button className="px-4 py-2 bg-surface text-gold-soft rounded-lg hover:bg-surface-2 transition-colors">
              Call
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
