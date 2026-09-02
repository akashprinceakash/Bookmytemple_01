import { useState } from 'react';
import PhoneInput, {
  parsePhoneNumber,
  isPossiblePhoneNumber
} from 'react-phone-number-input';

import 'react-phone-number-input/style.css';

import { Button } from '../components/Button';
import { api } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

const logoImg = '/assets/logo.png';

export function Login() {

  const navigate = useNavigate();

  const [phoneValue, setPhoneValue] = useState<string | undefined>();
  const [countryCode, setCountryCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isValidPhone =
    !!phoneValue && isPossiblePhoneNumber(phoneValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneValue) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);

      await api.post('api/auth/generate-otp', {
        countryCode,
        phone: phoneNumber,
      });

      navigate("/otp", {
        state: {
          phoneNumber,
          countryCode
        }
      });
    } catch (err: any) {
      if (err.response?.status === 429) {
        alert(
          err.response?.data?.message ||
            'Too many requests. Please try again later.'
        );
      } else {
        alert(
          err.response?.data?.message ||
            'Something went wrong. Try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 lg:items-center lg:py-16">
        <div className="w-full lg:max-w-md">
          <Link to="/home" className="mb-8 flex flex-col items-center gap-2.5 text-center">
            <span className="glow-gold grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_28%,#EFCB84,#C0954D_58%,#9A7639_100%)]">
              <img src={logoImg} alt="Book My Temples" className="h-10 w-10 object-contain" />
            </span>
            <span className="font-display text-[15px] tracking-[0.07em] text-foreground">Book My Temples</span>
          </Link>

          <div className="card shimmer p-7 lg:p-10">
            <div className="mb-8">
              <span className="tag">A Sacred Digital Sanctum</span>
              <h1 className="page-title">Welcome</h1>
              <p className="lede mt-2">
                Enter your WhatsApp number to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-[11.5px] uppercase tracking-[0.14em] text-gold-soft">
                  Phone Number
                </label>

                <div className="rounded-xl border border-input bg-surface-2 px-4 py-3 transition-colors focus-within:border-gold">
                  <PhoneInput
                    international={false}
                    defaultCountry="IN"
                    smartCaret={false}
                    value={phoneValue}
                    placeholder="Enter mobile number"
                    autoComplete="tel"
                    autoFocus={false}
                    className="phone-input w-full"

                    onChange={(value) => {
                      setPhoneValue(value);

                      if (!value) {
                        setPhoneNumber('');
                        setCountryCode('');
                        return;
                      }

                      const parsed = parsePhoneNumber(value);

                      if (parsed) {
                        setPhoneNumber(parsed.nationalNumber);
                        setCountryCode(
                          `+${parsed.countryCallingCode}`
                        );
                      }
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={!isValidPhone || loading}
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <span className="text-gold-soft">Terms of Service</span>{' '}
          and{' '}
          <span className="text-gold-soft">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
