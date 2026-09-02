import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Crumb, SectionHead } from '../components/royale';

export function AddressDetails() {

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const addressLabels: Record<string, string> = {
    addressLine1: "Address Line 1",
    addressLine2: "Address Line 2",
    city: "City",
    state: "State",
    country: "Country",
    pinCode: "PIN Code"
  };

  const [address, setAddress] = useState({
    addressId:0,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pinCode: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setLoading(true);

    api.get("api/user/address")
      .then((res) => {
        const d = Array.isArray(res.data)
            ? (res.data[0] || {})
            : (res.data || {});

        setAddress({
          addressId: d.addressId || 0,
          addressLine1: d.addressLine1 || "",
          addressLine2: d.addressLine2 || "",
          city: d.city || "",
          state: d.state || "",
          country: d.country || "",
          pinCode: d.pinCode || ""
        });

        // Enable edit automatically if no address exists
        if (!d.addressLine1) {
          setIsEditing(true);
        }
      })
      .catch(() => {
        setIsEditing(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setLoading(true);
    const payload = JSON.parse(JSON.stringify(address));
    if (payload.addressId === 0) {
      delete payload?.addressId;
    }
    api.post("api/user/address", payload)
      .then(() => {
        setIsEditing(false);
        if (from) {
          navigate(from);
        } else {
          navigate("/profile");
        }
      })
      .catch(() => {
        alert("Failed to save address. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <PageShell>
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Profile', to: '/profile' },
          { label: 'My Address' },
        ]}
      />

      <SectionHead
        tag="Prasad Delivery"
        title="My Address"
        lede="Where your prasad, temple receipt and sankalpa keepsakes should be delivered."
      />

      <div className="card min-h-[300px]">

        {loading && (
          <p className="py-8 text-center text-muted-foreground">Loading address...</p>
        )}

        {!loading && (
          <>
            <span className="tag">Delivery Address</span>
            <div className="grid2">
            {Object.keys(address)
            .filter((key) => key !== "addressId")
            .map((key) => (
              <div key={key} className="field">
                <label>{addressLabels[key] ?? formatLabel(key)}</label>

                <input
                  value={(address as any)[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={!isEditing}
                  placeholder={addressLabels[key] ?? formatLabel(key)}
                />
              </div>
            ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-4">
              {isEditing ? (
                <>
                  <button
                    disabled={loading}
                    onClick={handleSave}
                    className="btn-primary shimmer flex-1"
                  >
                  {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary shimmer w-full"
                >
                  Edit Address
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}