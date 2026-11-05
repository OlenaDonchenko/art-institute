import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Card from '../../components/Card';

// fake artwork to show in the card
const artwork = {
  id: 1,
  title: 'Water Lilies',
  creators: [{ description: 'Claude Monet' }],
  images: { web: { url: 'lilies.jpg' } },
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <Card e={artwork} setFav={() => {}} fav={[]} />
    </MemoryRouter>
  );

describe('Card', () => {
  it('shows the artwork title and image', () => {
    renderCard();

    expect(screen.getByText(/Water Lilies/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'lilies.jpg');
  });

  it('saves the artwork in localStorage when "Add to fav" is clicked', async () => {
    renderCard();

    // userEvent acts like a real user clicking
    await userEvent.click(screen.getByText('Add to fav'));

    const saved = JSON.parse(localStorage.getItem('fav')!);
    expect(saved[0].title).toBe('Water Lilies');
  });
});
