import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('Enterprise ERP Application Suite', () => {
  it('renders application brand header', () => {
    render(<App />);
    expect(screen.getByText('NEXUS')).toBeTruthy();
    expect(screen.getByText('ERP')).toBeTruthy();
  });

  it('renders enterprise dashboard overview tab by default', () => {
    render(<App />);
    expect(screen.getByText('Enterprise Overview')).toBeTruthy();
    expect(screen.getByText('Total Revenue')).toBeTruthy();
  });

  it('displays active customer metrics card', () => {
    render(<App />);
    expect(screen.getByText('Active Customers')).toBeTruthy();
  });
});
