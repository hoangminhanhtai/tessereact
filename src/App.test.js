import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Simple test
test('Renders the subtitle text of the page', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/The OCR app made with React and Tesseract/i);
  expect(linkElement).toBeInTheDocument();
});
