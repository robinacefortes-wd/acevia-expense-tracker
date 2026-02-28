import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

import { ThemeProvider } from '@/components/dashboard/ThemeContext';
import { ToastProvider } from '@/components/dashboard/ToastContext';
import ToastContainer from '@/components/dashboard/ToastContainer';
import { StateProvider } from '@/context/StateContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
    resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ThemeProvider>
                    <ToastProvider>
                        <StateProvider>
                            <App {...props} />
                            <ToastContainer />
                        </StateProvider>
                    </ToastProvider>
                </ThemeProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});