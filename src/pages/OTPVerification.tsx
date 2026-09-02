import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { api } from '@/api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/Backbutton.tsx';
import { clearPersistedState } from '../hooks/usePersistedState.ts';

export function OTPVerification() {
  
  const location = useLocation();
  const navigate = useNavigate();

  const phoneNumber = location.state?.phoneNumber;
  const countryCode = location.state?.countryCode;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    // if (otpValue.length === 6) {
    //   onVerified();
    // }
    // const respoObj = {
    //   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicGhvbmUiOiI5MTk5NjQ1ODc5ODkiLCJyb2xlIjoiVVNFUiIsInZlciI6IjEiLCJleHAiOjE3ODIzMTk5OTcsImlzcyI6IkJvb2tNeVRlbXBsZXMiLCJhdWQiOiJCb29rTXlUZW1wbGVzVXNlcnMifQ.t8D0VaznNCa0ss6FccgKGe-uSgBovXuvh-eQAZ13owY",
    //   "expiresIn": 0,
    //   "user": {
    //     "id": 3,
    //     "phone": "919964587989",
    //     "name": "",
    //     "role": "USER"
    //   },
    //   "newUser":true
    // }
    if (otpValue.length !== 6 || loading) return;
    setLoading(true)
    await api.post('api/auth/verify-otp/', {
      phone: `${phoneNumber}`,
      countryCode: `${countryCode}`,
      otp: otpValue,
    }).then( response => {
      console.log(response.data);
      localStorage.setItem('token',response.data.accessToken);
            // Login succeeded — the phone number no longer needs to hang
      // around for a "go back and re-edit" scenario.
      clearPersistedState([
        'loginForm:phoneValue',
        'loginForm:countryCode',
        'loginForm:phoneNumber',
      ]);

      if(response.data.newUser){
        localStorage.setItem('profileCompleted','false');
        navigate('/profileDetails');
      }else{
        localStorage.setItem('profileCompleted','true');
        navigate('/home')
      }
    }).catch(err => {
      if (err.response?.status === 401) {
        alert(err?.response?.data?.message || 'Invalid OTP');
      } else {
        alert('Something went wrong. Try again.');
      }
      setOtp(['', '', '', '', '', '']);
    }).finally(() => {
      setLoading(false);
    })
  };

  const handleResend = async () => {
    setLoading(true);
    await api.post('api/auth/generate-otp', {
      phone: `${phoneNumber}`,
      countryCode: `+${countryCode}`,
    }).then( response =>{
      console.log('response ',response)
    }).catch( err => {
      console.log('err ',err)
      if (err.response?.status === 429) {
        alert(err?.response?.data?.message || 'Too many requests. Please wait before trying again.');
      } else {
        alert('Something went wrong. Try again.');
      }
    }).finally(() => {
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
       setLoading(false);
    });
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 lg:items-center lg:py-16">
        <div className="w-full lg:max-w-md">
                    <BackButton fallback="/login" className="mb-6" />


          <div className="card shimmer p-7 lg:p-10">
            <div className="mb-8">
              <span className="tag">Verification</span>
              <h1 className="page-title">Verify OTP</h1>
              <p className="lede mt-2">
                Enter the 6-digit code sent to<br />
                <span className="text-foreground">{phoneNumber}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex gap-2.5 justify-center sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                     ref={(el) => {inputRefs.current[index] = el}}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-14 w-11 rounded-xl border-2 border-input bg-surface-2 text-center text-xl text-foreground outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 sm:w-12"
                  />
                ))}
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in <span className="text-gold-soft">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-gold-soft hover:text-foreground hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={otp.join('').length !== 6}
              >
                Verify & Continue
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
