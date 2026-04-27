/** @vitest-environment jsdom */
import { render } from '@testing-library/react';
import { CloudBackground } from '../components/ui/CloudBackground';
import { describe, it, expect } from 'vitest';

/**
 * CloudBackground Unit Tests
 */

describe('CloudBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<CloudBackground />);
    const background = container.querySelector('#cloud-background');
    expect(background).not.toBeNull();
  });

  it('contains at least 3 layers of clouds', () => {
    const { container } = render(<CloudBackground />);
    
    // Check for our 3 layer classes
    const farClouds = container.getElementsByClassName('animate-cloud-far');
    const midClouds = container.getElementsByClassName('animate-cloud-mid');
    const nearClouds = container.getElementsByClassName('animate-cloud-near');

    expect(farClouds.length).toBeGreaterThan(0);
    expect(midClouds.length).toBeGreaterThan(0);
    expect(nearClouds.length).toBeGreaterThan(0);
  });

  it('layers have will-change: transform for performance', () => {
    const { container } = render(<CloudBackground />);
    const clouds = container.querySelectorAll('.will-change-transform');
    
    // Based on implementation, we have 4 far, 3 mid, 3 near = 10 clouds
    expect(clouds.length).toBe(10);
  });

  it('has position fixed and z-index 0', () => {
    const { container } = render(<CloudBackground />);
    const background = container.firstChild as HTMLElement;
    
    expect(background).not.toBeNull();
    expect(background.classList.contains('fixed')).toBe(true);
    expect(background.classList.contains('z-0')).toBe(true);
  });
});
