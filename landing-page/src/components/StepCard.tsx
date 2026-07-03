

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="neo-box flex-col-mobile" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div 
        className="step-circle"
        style={{ 
          width: '60px', 
          height: '60px', 
          minWidth: '60px',
          borderRadius: '50%', 
          backgroundColor: '#000', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '2rem', 
          fontWeight: 800 
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>{title}</h3>
        <p style={{ margin: 0, fontWeight: 500 }}>{description}</p>
      </div>
    </div>
  );
}
