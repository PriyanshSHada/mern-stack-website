const gradients = {
  'red-pink': 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
  'purple-blue': 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
  'purple': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
};

const Card = ({ children, gradient = false, gradientKey = '', style = {} }) => {
  const baseStyle = {
    background: gradient ? (gradients[gradientKey] || gradients['purple-blue']) : 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    ...style
  };
  
  return (
    <div style={baseStyle}>
      {children}
    </div>
  );
};

export default Card;
