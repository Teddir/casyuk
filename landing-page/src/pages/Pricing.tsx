import { Check, X, HelpCircle } from 'lucide-react';
import { NeoButton } from '../components/NeoButton';
import { useState } from 'react';

const PAYMENT_LINKS: Record<string, { dodo: string, lemon: string }> = {
  Professional: {
    dodo: "https://test.checkout.dodopayments.com/buy/pdt_0NiqyoSJwCz4jpFxPNKSb?quantity=1",
    lemon: "#"
  },
  'Power User': {
    dodo: "#", // Update with Dodo Power User link later
    lemon: "#"
  },
  Team: {
    dodo: "#", // Update with Dodo Team link later
    lemon: "#"
  }
};

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const openModal = (e: React.MouseEvent, plan: string) => {
    e.preventDefault();
    setSelectedPlan(plan);
  };

  const closeModal = () => setSelectedPlan(null);

  return (
    <>
    <div className="pattern-dots-faded hero-mask" style={{ padding: '180px 0 120px' }}>
      <div className="container">

        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div className="neo-box" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '50px', fontWeight: '700', marginBottom: '24px', backgroundColor: 'var(--accent-purple)', fontSize: '0.9rem', boxShadow: '3px 3px 0px var(--border-color)' }}>
            Transparent Pricing
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Simple Pricing for Power Users</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Choose the license that fits your needs. No hidden fees or recurring subscriptions.</p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '100px' }}>

          {/* Personal */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Personal</h2>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '24px' }}>Essential battery monitoring.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>$0</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} color="var(--accent-green)" strokeWidth={3} /> <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Basic Notifications</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><X size={18} color="var(--accent-red)" strokeWidth={3} /> <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Meme Overlays</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><X size={18} color="var(--accent-red)" strokeWidth={3} /> <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Smart 80% Limit</span></div>
            </div>
            <NeoButton href="/#download" variant="secondary" style={{ width: '100%' }}>Download Free</NeoButton>
          </div>

          {/* Professional */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: '#fff', color: '#000', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Professional</h2>
            <p style={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: '24px' }}>Lifetime Updates.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem', marginRight: '8px', fontWeight: 600 }}>$15</span>
              $5
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 800, marginLeft: '12px', padding: '4px 8px', border: '2px solid var(--accent-red)', borderRadius: '4px', transform: 'rotate(-2deg)' }}>66% OFF</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Everything in Personal</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Meme Overlays</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Smart 80% Limit</span></div>
            </div>
            <NeoButton href="#" onClick={(e) => openModal(e, 'Professional')} style={{ width: '100%', backgroundColor: '#000', color: '#fff' }}>Get Professional</NeoButton>
          </div>

          {/* Power User */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--accent-green)', color: '#000', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', zIndex: 10 }}>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, alignSelf: 'flex-start', marginBottom: '16px' }}>MOST POPULAR</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Power User</h2>
            <p style={{ fontWeight: 600, color: 'rgba(0,0,0,0.7)', marginBottom: '24px' }}>Pay once, yours forever.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ textDecoration: 'line-through', color: 'rgba(0,0,0,0.4)', fontSize: '1.5rem', marginRight: '8px', fontWeight: 600 }}>$35</span>
              $12
              <span style={{ fontSize: '0.8rem', color: '#000', fontWeight: 800, marginLeft: '12px', padding: '4px 8px', border: '2px solid #000', borderRadius: '4px', transform: 'rotate(2deg)' }}>65% OFF</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Everything in Professional</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Up to 3 Devices</span></div>
            </div>
            <NeoButton href="#" onClick={(e) => openModal(e, 'Power User')} style={{ width: '100%', backgroundColor: '#000', color: 'var(--accent-green)' }}>Get Power User</NeoButton>
          </div>

          {/* Team */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--accent-blue)', color: '#000', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Team</h2>
            <p style={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: '24px' }}>For agencies and studios.</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem', marginRight: '8px', fontWeight: 600 }}>$99</span>
              $39
              <span style={{ fontSize: '0.8rem', color: '#000', backgroundColor: 'var(--accent-purple)', fontWeight: 800, marginLeft: '12px', padding: '4px 8px', border: '2px solid #000', borderRadius: '4px', transform: 'rotate(-1deg)' }}>SAVE $60</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Up to 10 Devices</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Lifetime Updates</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} strokeWidth={3} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Priority Support</span></div>
            </div>
            <NeoButton href="#" onClick={(e) => openModal(e, 'Team')} style={{ width: '100%', backgroundColor: '#000', color: '#fff' }}>Get Team License</NeoButton>
          </div>

        </div>

        {/* Detailed Comparison Table */}
        <div style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Detailed Comparison</h2>
          <div className="neo-box" style={{ padding: 0, overflowX: 'auto', backgroundColor: 'var(--card-bg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '3px solid var(--border-color)', backgroundColor: 'var(--primary-color)' }}>
                  <th style={{ padding: '24px', fontSize: '1.2rem' }}>Features</th>
                  <th style={{ padding: '24px', fontSize: '1.2rem', textAlign: 'center' }}>Personal</th>
                  <th style={{ padding: '24px', fontSize: '1.2rem', textAlign: 'center' }}>Professional</th>
                  <th style={{ padding: '24px', fontSize: '1.2rem', textAlign: 'center', backgroundColor: 'var(--accent-green)', color: '#000' }}>Power User</th>
                  <th style={{ padding: '24px', fontSize: '1.2rem', textAlign: 'center' }}>Team</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 600 }}>Battery Monitoring</td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center', backgroundColor: 'rgba(168, 255, 178, 0.1)' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 600 }}>Meme Video Alerts</td>
                  <td style={{ textAlign: 'center' }}><X size={20} color="var(--text-muted)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center', backgroundColor: 'rgba(168, 255, 178, 0.1)' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 600 }}>Hardware SMC 80% Limit</td>
                  <td style={{ textAlign: 'center' }}><X size={20} color="var(--text-muted)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center', backgroundColor: 'rgba(168, 255, 178, 0.1)' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={20} color="var(--accent-green)" style={{ margin: '0 auto' }} /></td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 600 }}>License Type</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>1 Device</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>1 Device</td>
                  <td style={{ textAlign: 'center', backgroundColor: 'rgba(168, 255, 178, 0.1)', fontWeight: 600, color: 'var(--text-main)' }}>Up to 3</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>Up to 10</td>
                </tr>
                <tr>
                  <td style={{ padding: '20px 24px', fontWeight: 600 }}>Updates Included</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>None</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Lifetime</td>
                  <td style={{ textAlign: 'center', backgroundColor: 'rgba(168, 255, 178, 0.1)', fontWeight: 600, color: 'var(--text-main)' }}>Lifetime</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>Lifetime</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

            <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <HelpCircle size={28} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>What does "Lifetime Updates" mean?</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>It means exactly that! You pay once (even for the $5 tier) and never pay again. You will receive all future major and minor updates of CasYuk, including new meme alerts, indefinitely.</p>
                </div>
              </div>
            </div>


            <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <HelpCircle size={28} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Can I upgrade from Professional to Power User?</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Yes! If you purchase the Professional tier and decide you want to upgrade to Power User for more devices within the first 30 days, we will prorate the cost. Just email our support team.</p>
                </div>
              </div>
            </div>

            <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <HelpCircle size={28} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>How does the Team License work?</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>The Team License grants you a single master license key that can be activated on up to 10 distinct devices. Perfect for small studios or design agencies who want to protect their hardware investments.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    {/* Payment Merchant Selection Modal */}
    {selectedPlan && (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
      }} onClick={closeModal}>
        <div className="neo-box" style={{
          backgroundColor: 'var(--card-bg)', width: '90%', maxWidth: '400px',
          padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px'
        }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 900 }}>Get {selectedPlan}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>Choose your preferred merchant to complete the purchase.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <NeoButton href={PAYMENT_LINKS[selectedPlan]?.dodo} style={{ 
              width: '100%', backgroundColor: '#000', color: '#fff', 
              fontSize: '1.1rem', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 7V17H13.5C15.9853 17 18 14.7614 18 12C18 9.23858 15.9853 7 13.5 7H8Z" stroke="#00D084" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Buy via Dodo Payments
            </NeoButton>
            
            <NeoButton href={PAYMENT_LINKS[selectedPlan]?.lemon} variant="secondary" style={{ 
              width: '100%', backgroundColor: '#7047EB', color: '#fff', border: '3px solid #000',
              fontSize: '1.1rem', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 3.5C14.5 3.5 19 3 20 4C21 5 20.5 9.5 20.5 9.5C20.5 9.5 22 14.5 18 18.5C14 22.5 9.5 21 9.5 21C9.5 21 4.5 20.5 3.5 19.5C2.5 18.5 3 14 3 14C3 14 2.5 9 6.5 5C10.5 1 14.5 3.5 14.5 3.5Z" fill="#FFC233" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Buy via Lemon Squeezy
            </NeoButton>
          </div>
          
          <button 
            onClick={closeModal} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', marginTop: '16px', fontWeight: 800, fontSize: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    </>
  );
}
