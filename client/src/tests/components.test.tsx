
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../components/hero-section';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

describe('UI Components', () => {
  it('renders Button component', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeDefined();
  });

  it('renders Card component', () => {
    render(
      <Card>
        <div>Test Card Content</div>
      </Card>
    );
    expect(screen.getByText('Test Card Content')).toBeDefined();
  });
});
