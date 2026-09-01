import React, { type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = { children: ReactNode };
type AppErrorBoundaryState = { failed: boolean };

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Page rendering failed', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f3eb] px-5 py-24 text-center text-venetian-brown">
        <div className="max-w-lg border-t border-venetian-brown pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-venetian-terracotta">Al Gobbo di Rialto</p>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.9]">La pagina non si è caricata.</h1>
          <p className="mt-5 text-base leading-7 text-venetian-brown/75">La connessione potrebbe essersi interrotta. Ricarica la pagina per riprovare.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-8 inline-flex min-h-12 items-center justify-center bg-venetian-brown px-7 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-venetian-terracotta">
            Ricarica la pagina
          </button>
        </div>
      </main>
    );
  }
}
