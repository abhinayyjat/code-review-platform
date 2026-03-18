export default function LoadingSkeleton({ height, width, borderRadius }) {
  return (
    <div style={{
      height:       height       || 20,
      width:        width        || '100%',
      borderRadius: borderRadius || 6,
      background:   'linear-gradient(90deg, #1a2540 25%, #1e2d4a 50%, #1a2540 75%)',
      backgroundSize: '200% 100%',
      animation:    'shimmer 1.5s infinite',
    }} />
  );
}
