import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReloadPrompt from '../ReloadPrompt';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Re-mock locally to control states
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: vi.fn(),
}));

describe('ReloadPrompt', () => {
  const mockUpdateServiceWorker = vi.fn();
  const mockSetOfflineReady = vi.fn();
  const mockSetNeedRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no update or offline readiness is detected', () => {
    (useRegisterSW as any).mockReturnValue({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    const { container } = render(<ReloadPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('shows update available modal when needRefresh is true', () => {
    (useRegisterSW as any).mockReturnValue({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [true, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    
    expect(screen.getByText('Actualización Disponible')).toBeInTheDocument();
    expect(screen.getByText(/Hay una nueva versión de BULLBOX disponible/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Actualizar/i })).toBeInTheDocument();
  });

  it('shows offline ready modal when offlineReady is true', () => {
    (useRegisterSW as any).mockReturnValue({
      offlineReady: [true, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    
    expect(screen.getByText('App Lista para usar Offline')).toBeInTheDocument();
    expect(screen.getByText(/La aplicación se ha descargado completamente/i)).toBeInTheDocument();
  });

  it('calls updateServiceWorker and broadcasts message when Actualizar is clicked', () => {
    const postMessageSpy = vi.spyOn(BroadcastChannel.prototype, 'postMessage');
    
    (useRegisterSW as any).mockReturnValue({
      offlineReady: [false, mockSetOfflineReady],
      needRefresh: [true, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    
    const updateButton = screen.getByRole('button', { name: /Actualizar/i });
    fireEvent.click(updateButton);
    
    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
    expect(postMessageSpy).toHaveBeenCalledWith('reload');
    
    postMessageSpy.mockRestore();
  });

  it('closes modal when Cerrar is clicked', () => {
    (useRegisterSW as any).mockReturnValue({
      offlineReady: [true, mockSetOfflineReady],
      needRefresh: [false, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    });

    render(<ReloadPrompt />);
    
    const closeButton = screen.getByRole('button', { name: /Cerrar/i });
    fireEvent.click(closeButton);
    
    expect(mockSetOfflineReady).toHaveBeenCalledWith(false);
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
  });
});
