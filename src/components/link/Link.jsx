import { Link as RouterLink } from 'react-router'; // ==============================================================

// ==============================================================
export default function Link({
  ref,
  href,
  ...others
}) {
  return <RouterLink ref={ref} to={href} {...others} />;
}