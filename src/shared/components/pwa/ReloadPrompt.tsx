import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';
import { RefreshIcon } from '@/shared/components/ui/Icons';

const ReloadPrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    // Sincronización multi-pestaña usando BroadcastChannel
    React.useEffect(() => {
        const bc = new BroadcastChannel('pwa-update');
        bc.onmessage = (event) => {
            if (event.data === 'reload') {
                window.location.reload();
            }
        };
        return () => bc.close();
    }, []);

    // Fallback crítico para iOS (Safari) en modo standalone
    React.useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
        
        if (isIOS && isStandalone) {
            const interval = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    window.location.reload();
                }
            }, 1000 * 60 * 30); // Cada 30 minutos
            return () => clearInterval(interval);
        }
    }, []);

    const handleUpdate = () => {
        const bc = new BroadcastChannel('pwa-update');
        bc.postMessage('reload');
        updateServiceWorker(true);
    };

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    const isOpen = needRefresh || offlineReady;

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            title={needRefresh ? "Actualización Disponible" : "App Lista para usar Offline"}
            size="sm"
            footer={
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={close}>
                        Cerrar
                    </Button>
                    {needRefresh && (
                        <Button 
                            variant="primary" 
                            onClick={handleUpdate}
                            icon={<RefreshIcon className="w-4 h-4" />}
                        >
                            Actualizar
                        </Button>
                    )}
                </div>
            }
        >
            <div className="text-(--muted-text) leading-relaxed">
                {needRefresh 
                    ? "Hay una nueva versión de BULLBOX disponible con mejoras y correcciones. ¿Quieres actualizar ahora?"
                    : "La aplicación se ha descargado completamente y ahora puede funcionar sin conexión a internet."
                }
            </div>
        </Modal>
    );
};

export default ReloadPrompt;
