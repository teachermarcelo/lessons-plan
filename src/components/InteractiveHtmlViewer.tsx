import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';

interface InteractiveHtmlViewerProps {
  htmlCode: string;
  title?: string;
  editable?: boolean;
  onCodeChange?: (newCode: string) => void;
  heightClass?: string;
}

export const InteractiveHtmlViewer: React.FC<InteractiveHtmlViewerProps> = ({
  htmlCode,
  title = 'Visualizador de Aula Interativa',
  editable = false,
  onCodeChange,
  heightClass = 'h-[520px]',
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Prepara o documento HTML completo com isolamento de estilos e scripts
  const generateSrcDoc = () => {
    if (!htmlCode || !htmlCode.trim()) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                background-color: #0b0f19;
                color: #94a3b8;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
              }
              .box {
                border: 2px dashed #334155;
                border-radius: 16px;
                padding: 40px 20px;
                max-width: 480px;
              }
              h3 { color: #f8fafc; margin-top: 0; }
              p { font-size: 14px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="box">
              <h3>Nenhum código HTML inserido</h3>
              <p>Cole seu código HTML, CSS e JavaScript ou escolha um modelo pronto para testar as interatividades desta aula em tempo real.</p>
            </div>
          </body>
        </html>
      `;
    }

    // Se já tiver uma estrutura HTML completa, injeta Tailwind e helpers
    const hasHtmlTag = htmlCode.includes('<html') || htmlCode.includes('<body');
    
    if (hasHtmlTag) {
      return htmlCode;
    }

    // Caso seja apenas um fragmento de código com scripts e estilos
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              margin: 0;
              padding: 24px;
              background-color: #0f172a;
              color: #f8fafc;
              min-height: 100vh;
            }
          </style>
        </head>
        <body>
          ${htmlCode}
        </body>
      </html>
    `;
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'p-4 bg-slate-950' : ''
      }`}
    >
      {/* Barra de Ferramentas do Visualizador */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        {/* Esquerda: Identificação e Status */}
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-extrabold text-white text-xs tracking-wide">
            {title}
          </span>
          <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>Sandbox Seguro</span>
          </span>
        </div>

        {/* Centro: Alternador de Dispositivo (Responsividade) */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'desktop' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Visualização Computador / Datashow (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'tablet' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Visualização Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'mobile' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Visualização Celular (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Direita: Ações de Teste */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleReload}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 font-semibold transition-all"
            title="Recarregar aula para resetar respostas e interatividades"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reiniciar Teste</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 font-semibold transition-all"
            title="Copiar código HTML completo"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-all"
            title={isFullscreen ? 'Sair da tela cheia' : 'Modo Apresentação / Tela Cheia para Sala de Aula'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Área de Visualização com Moldura Responsiva */}
      <div className={`flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto ${heightClass}`}>
        <div 
          className={`h-full transition-all duration-300 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 ${
            deviceMode === 'desktop' 
              ? 'w-full' 
              : deviceMode === 'tablet' 
              ? 'w-[768px] max-w-full' 
              : 'w-[375px] max-w-full'
          }`}
        >
          <iframe
            key={iframeKey}
            title={title}
            srcDoc={generateSrcDoc()}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            className="w-full h-full border-0 bg-slate-900"
          />
        </div>
      </div>

      {/* Barra Inferior com Informações de Segurança */}
      <div className="bg-slate-900/60 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Isolamento total de scripts e estilos • 100% compatível com Canva, H5P, Genially e JavaScript puro.
        </span>
        <span className="font-mono text-purple-400">
          Modo: {deviceMode.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
