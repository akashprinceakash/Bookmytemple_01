import { useState } from 'react';
import { Play, Heart, Share2, Volume2, VolumeX, Maximize, IndianRupee, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
// import type { Page } from '../App';
import { PageShell } from '../components/PageShell';
import { Crumb } from '../components/royale';

// interface LiveDarshanProps {
//   navigate: (page: Page) => void;
// }

export function LiveDarshan() {

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(0);

  const donationPresets = [51, 101, 251, 501, 1001];

  const handleDonation = () => {
    if (donationAmount > 0) {
      alert(`Thank you for your donation of ₹${donationAmount}!`);
      setShowDonation(false);
      setDonationAmount(0);
    }
  };

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Live Darshan' }]} />

      {/* Video Player */}
      <div className="relative aspect-video overflow-hidden rounded-[26px] border border-border bg-black shadow-panel">
        <img 
          src="https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHRlbXBsZXxlbnwxfHx8fDE3NjUxMDY1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Book Darshan"
          className="w-full h-full object-cover"
        />
        
        {/* Live Badge */}
        <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-surface rounded-full animate-pulse"></div>
          <small className="text-white">LIVE</small>
        </div>

        {/* Viewers Count */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
          <small className="text-white">👁️ 2.4k watching</small>
        </div>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button 
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-surface transition-colors"
            >
              <Play className="w-8 h-8 text-gold-soft ml-1" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? (
                <div className="w-4 h-4 flex gap-1">
                  <div className="w-1.5 bg-white"></div>
                  <div className="w-1.5 bg-white"></div>
                </div>
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Maximize className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Temple Info */}
      <div className="mt-6">
        <div className="card">
          <span className="tag">Live Darshan · Morning Seva</span>
          <h2 className="sec">Tirupati Balaji Temple</h2>
          
          <div className="flex items-center gap-4 mt-4">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-gold-soft transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">1.2k</span>
            </button>
            
            <button className="flex items-center gap-2 text-muted-foreground hover:text-gold-soft transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Donation Section */}
        <div className="p-4">
          {!showDonation ? (
            <Button 
              fullWidth
              onClick={() => setShowDonation(true)}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Offer Donation
              </span>
            </Button>
          ) : (
            <div className="card">
              <h3 className="mb-4 text-center">Offer Your Donation</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {donationPresets.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`py-3 rounded-lg border-2 transition-all ${
                      donationAmount === amount
                        ? 'border-gold bg-gold/10 text-gold-soft'
                        : 'border-border hover:border-gold'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      <span className="text-sm">{amount}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2">Custom Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={donationAmount || ''}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-[rgba(15,27,60,.75)] py-3 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowDonation(false);
                    setDonationAmount(0);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  fullWidth
                  onClick={handleDonation}
                  disabled={donationAmount === 0}
                >
                  Donate
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Sevas */}
        <div className="p-4 border-t border-border">
          <h3 className="mb-4">Upcoming Sevas Today</h3>
          
          <div className="space-y-3">
            {[
              { time: '11:00 AM', name: 'Abhishekam' },
              { time: '1:00 PM', name: 'Archana' },
              { time: '6:00 PM', name: 'Evening Aarti' }
            ].map((seva, index) => (
              <div key={index} className="bg-surface rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm">{seva.name}</p>
                  <small className="text-muted-foreground">{seva.time}</small>
                </div>
                <button className="px-4 py-2 bg-gold text-white rounded-lg text-sm hover:bg-[var(--color-gold-deep)] transition-colors">
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
