import React from 'react';
import { render, screen } from '@testing-library/react';
import Bounce from './Bounce';

describe('Bounce', () => {
  it('renders children', () => {
    render(
      <Bounce>
        <span>Test Bounce</span>
      </Bounce>
    );
    expect(screen.getByText('Test Bounce')).toBeInTheDocument();
  });
}); 