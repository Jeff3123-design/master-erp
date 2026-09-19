import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('Buzz ERP Application Suite', () => {
  it('renders Buzz ERP brand header', () => {
    render(<App />);
    expect(screen.getByText('BUZZ')).toBeTruthy();
    expect(screen.getByText('ERP')).toBeTruthy();
  });

  it('renders enterprise dashboard overview tab by default', () => {
    render(<App />);
    expect(screen.getByText('Enterprise Overview')).toBeTruthy();
    expect(screen.getByText('Total Revenue')).toBeTruthy();
  });

  it('displays active customer metrics card and Buzz App Suite Launcher', () => {
    render(<App />);
    expect(screen.getByText('Active Customers')).toBeTruthy();
    expect(screen.getByText('Buzz App Suite Launcher')).toBeTruthy();
  });

  it('renders AI Co-Pilot button and currency switcher in header', () => {
    render(<App />);
    expect(screen.getByText('AI Co-Pilot')).toBeTruthy();
    expect(screen.getByText('USD ($)')).toBeTruthy();
  });

  it('renders Supabase DB connection status pill in header', () => {
    render(<App />);
    expect(screen.getByText('Supabase DB')).toBeTruthy();
  });
});
