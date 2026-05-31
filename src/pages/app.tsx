import { SearchPage } from '@pages';
import { Navigate, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<SearchPage />} />

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
