import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { PostList } from './pages/PostList';
import { PostDetail } from './pages/PostDetail';
import { QuoteList } from './pages/QuoteList';
import { QuoteDetail } from './pages/QuoteDetail';
import { QuoteEditor } from './pages/QuoteEditor';
import { QuotePoster } from './pages/QuotePoster';
import { Geo } from './pages/Geo';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/quotes" element={<QuoteList />} />
          <Route path="/quotes/new" element={<QuoteEditor />} />
          <Route path="/quotes/:slug" element={<QuoteDetail />} />
          <Route path="/quotes/:slug/edit" element={<QuoteEditor />} />
          <Route path="/quotes/:slug/poster" element={<QuotePoster />} />
          <Route path="/geo" element={<Geo />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
