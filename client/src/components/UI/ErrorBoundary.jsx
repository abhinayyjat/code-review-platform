import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding:40, textAlign:'center', color:'#e2e8f0' }}>
          <h2 style={{ color:'#ef4444', marginBottom:12 }}>Something went wrong</h2>
          <p style={{ color:'#6b7280', marginBottom:24 }}>{this.state.error && this.state.error.message}</p>
          <button onClick={function() { window.location.reload(); }}
            style={{ background:'#4F46E5', color:'#fff', border:'none',
                     borderRadius:6, padding:'10px 20px', cursor:'pointer' }}>
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
