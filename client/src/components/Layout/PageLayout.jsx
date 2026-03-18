import Navbar from './Navbar';

export default function PageLayout({ children }) {
  return (
    <div style={{ background:'#080c14', minHeight:'100vh' }}>
      <Navbar />
      <main style={{ maxWidth:960, margin:'0 auto', padding:'32px 24px' }}>
        {children}
      </main>
    </div>
  );
}
