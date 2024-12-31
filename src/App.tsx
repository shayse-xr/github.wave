import GitHubGrid from './components/GitHubGrid';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <GitHubGrid />
      <Analytics />
    </>
  );
}

export default App;