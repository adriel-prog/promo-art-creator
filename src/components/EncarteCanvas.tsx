import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EncarteData } from '@/types/product';
import { ImageTransform } from '@/components/ImageEditor';
import { templates } from '@/data/templates';
import { toast } from 'sonner';
import { Download, Share2, Sparkles } from 'lucide-react';

interface EncarteCanvasProps {
  encarteData: (EncarteData & { imageTransform?: ImageTransform }) | null;
}

export const EncarteCanvas = ({ encarteData }: EncarteCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (encarteData && canvasRef.current) {
      generateEncarte();
    }
  }, [encarteData]);

  const generateEncarte = async () => {
    if (!encarteData || !canvasRef.current) return;
    
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Configurações iniciais do canvas
      const canvasWidth = 800;
      let canvasHeight = 1000; // Altura inicial que será ajustada

      const template = templates.find(t => t.id === encarteData.template);
      if (!template) return;

      // Função auxiliar para medir altura do texto quebrado
      const measureTextHeight = (text: string, font: string, maxWidth: number, lineHeight: number = 25) => {
        ctx.font = font;
        const words = text.split(' ');
        let lines = 0;
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            lines++;
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines++; // Última linha
        
        return lines * lineHeight;
      };

      // Calcular altura necessária para todas as informações
      let calculatedHeight = 120; // Header
      calculatedHeight += 420; // Área da imagem
      calculatedHeight += 80; // Nome do produto
      
      // Altura do nome do produto (quebrado)
      const nameHeight = measureTextHeight(encarteData.product.nome, 'bold 32px Arial', canvasWidth - 100, 40);
      calculatedHeight += nameHeight;
      
      calculatedHeight += 80; // Selo de oferta
      calculatedHeight += 80; // Preço original
      calculatedHeight += 80; // Preço promocional
      
      // Altura das informações adicionais (se existirem)
      if (encarteData.informacoesAdicionais && encarteData.informacoesAdicionais.trim() !== '') {
        const infoHeight = measureTextHeight(encarteData.informacoesAdicionais, 'bold 20px Arial', canvasWidth - 120, 25);
        calculatedHeight += infoHeight + 60; // 60px para padding e background
      }
      
      calculatedHeight += 120; // Footer
      calculatedHeight += 50; // Margem de segurança

      // Usar a altura calculada
      canvasHeight = Math.max(canvasHeight, calculatedHeight);

      // Configurar canvas com altura dinâmica
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background com gradiente moderno
      if (template.id === 'branco') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, template.colors.primary);
        gradient.addColorStop(1, template.colors.secondary);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Header moderno da empresa
      const headerHeight = 100;
      if (template.id === 'escuro') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      }
      ctx.fillRect(0, 0, canvas.width, headerHeight);
      
      // Logo/Nome da empresa
      ctx.fillStyle = template.id === 'escuro' ? '#FFFFFF' : template.colors.primary;
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DISCAR DISTRIBUIDORA', canvas.width / 2, 45);
      
      ctx.font = '18px Arial';
      ctx.fillText('Produtos Ambev - Qualidade Garantida', canvas.width / 2, 75);

      // Área central do produto
      const productAreaY = headerHeight + 20;
      
      // Carregar e desenhar imagem do produto
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          // Área central para a imagem
          const imageAreaWidth = canvas.width - 100;
          const imageAreaHeight = 400;
          const imageAreaX = 50;
          const imageAreaY = productAreaY + 20;
          
          // Fundo sutil para a imagem
          ctx.fillStyle = template.id === 'branco' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(imageAreaX - 20, imageAreaY - 20, imageAreaWidth + 40, imageAreaHeight + 40);

          // Calcular tamanho da imagem mantendo proporção
          let imgWidth = img.width;
          let imgHeight = img.height;
          const maxImageSize = Math.min(imageAreaWidth, imageAreaHeight) * 0.8;
          
          if (imgWidth > imgHeight) {
            if (imgWidth > maxImageSize) {
              imgHeight = (imgHeight * maxImageSize) / imgWidth;
              imgWidth = maxImageSize;
            }
          } else {
            if (imgHeight > maxImageSize) {
              imgWidth = (imgWidth * maxImageSize) / imgHeight;
              imgHeight = maxImageSize;
            }
          }

          // Aplicar transformações do editor
          const transform = encarteData.imageTransform || { scale: 1, x: 0, y: 0, rotation: 0 };
          
          // Centralizar imagem base
          let imgX = imageAreaX + (imageAreaWidth - imgWidth) / 2;
          let imgY = imageAreaY + (imageAreaHeight - imgHeight) / 2;
          
          // Aplicar escala e posição
          imgWidth *= transform.scale;
          imgHeight *= transform.scale;
          imgX += transform.x;
          imgY += transform.y;

          // Salvar contexto para rotação
          ctx.save();
          
          // Se há rotação, aplicar
          if (transform.rotation !== 0) {
            const centerX = imgX + imgWidth / 2;
            const centerY = imgY + imgHeight / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate((transform.rotation * Math.PI) / 180);
            ctx.translate(-centerX, -centerY);
          }

          // Desenhar imagem com efeito de sombra
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
          
          ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
          
          // Restaurar contexto
          ctx.restore();
          ctx.shadowColor = 'transparent';
          
          resolve();
        };
        
        img.onerror = () => {
          // Placeholder se imagem falhar
          const placeholderX = (canvas.width - 300) / 2;
          const placeholderY = productAreaY + 50;
          
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(placeholderX, placeholderY, 300, 300);
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.strokeRect(placeholderX, placeholderY, 300, 300);
          
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Imagem não', canvas.width / 2, placeholderY + 140);
          ctx.fillText('disponível', canvas.width / 2, placeholderY + 170);
          resolve();
        };
        
        img.src = encarteData.product.urlImagem;
      });

      // Nome do produto - posição dinâmica
      let currentY = productAreaY + 460;
      ctx.fillStyle = template.id === 'escuro' ? '#FFFFFF' : '#1e293b';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      
      // Quebrar texto do nome do produto
      const maxWidth = canvas.width - 100;
      const words = encarteData.product.nome.split(' ');
      let line = '';
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, currentY);
          line = words[n] + ' ';
          currentY += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, currentY);
      currentY += 50;

      // Selo de oferta moderno
      const seloHeight = 80;
      
      const seloGradient = ctx.createLinearGradient(0, currentY, canvas.width, currentY + seloHeight);
      seloGradient.addColorStop(0, '#ef4444');
      seloGradient.addColorStop(1, '#dc2626');
      
      ctx.fillStyle = seloGradient;
      ctx.fillRect(50, currentY, canvas.width - 100, seloHeight);
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('OFERTA IMPERDÍVEL!', canvas.width / 2, currentY + 50);
      
      ctx.shadowColor = 'transparent';
      currentY += seloHeight + 20;

      // Preços
      // Preço original (riscado)
      ctx.fillStyle = template.id === 'escuro' ? '#94a3b8' : '#64748b';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      const precoOrigText = `DE R$ ${encarteData.precoOriginal.toFixed(2).replace('.', ',')}`;
      ctx.fillText(precoOrigText, canvas.width / 2, currentY);
      
      // Linha riscando o preço original
      const textWidth = ctx.measureText(precoOrigText).width;
      ctx.strokeStyle = template.id === 'escuro' ? '#94a3b8' : '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo((canvas.width - textWidth) / 2, currentY - 10);
      ctx.lineTo((canvas.width + textWidth) / 2, currentY - 10);
      ctx.stroke();
      currentY += 60;

      // Preço promocional
      ctx.fillStyle = template.id === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(34, 197, 94, 0.1)';
      ctx.fillRect(100, currentY - 40, canvas.width - 200, 80);
      
      ctx.fillStyle = template.id === 'escuro' ? '#ffffff' : '#22c55e';
      ctx.font = 'bold 56px Arial';
      ctx.fillText(`R$ ${encarteData.precoPromocional.toFixed(2).replace('.', ',')}`, canvas.width / 2, currentY);
      currentY += 70;

      // Badge de desconto
      const desconto = Math.round(((encarteData.precoOriginal - encarteData.precoPromocional) / encarteData.precoOriginal) * 100);
      
      const badgeSize = 120;
      const badgeX = canvas.width - badgeSize - 30;
      const badgeY = productAreaY + 30;
      
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(badgeX + badgeSize/2, badgeY + badgeSize/2, badgeSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`-${desconto}%`, badgeX + badgeSize/2, badgeY + badgeSize/2 + 10);
      ctx.shadowColor = 'transparent';

      // Informações adicionais (garantindo que apareçam completamente)
      if (encarteData.informacoesAdicionais && encarteData.informacoesAdicionais.trim() !== '') {
        console.log('Renderizando informações adicionais:', encarteData.informacoesAdicionais);
        
        // Calcular altura necessária para o background
        const infoTextHeight = measureTextHeight(encarteData.informacoesAdicionais, 'bold 20px Arial', canvas.width - 120, 25);
        const bgHeight = infoTextHeight + 30; // 15px padding top/bottom
        
        // Background sutil para as informações
        ctx.fillStyle = template.id === 'escuro' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(30, currentY - 15, canvas.width - 60, bgHeight);
        
        ctx.fillStyle = template.id === 'escuro' ? '#E5E7EB' : '#374151';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        
        // Quebrar texto das informações adicionais
        const infoWords = encarteData.informacoesAdicionais.split(' ');
        let infoLine = '';
        
        for (let n = 0; n < infoWords.length; n++) {
          const testLine = infoLine + infoWords[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > canvas.width - 120 && n > 0) {
            ctx.fillText(infoLine.trim(), canvas.width / 2, currentY);
            infoLine = infoWords[n] + ' ';
            currentY += 25;
          } else {
            infoLine = testLine;
          }
        }
        
        if (infoLine.trim()) {
          ctx.fillText(infoLine.trim(), canvas.width / 2, currentY);
          currentY += 25;
        }
        
        currentY += 30; // Espaço após as informações
      }

      // Footer - sempre no final
      currentY += 20; // Margem antes do footer
      
      if (template.id === 'escuro') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      }
      ctx.fillRect(0, currentY, canvas.width, 120);
      
      ctx.fillStyle = template.id === 'escuro' ? '#FFFFFF' : template.colors.primary;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      
      if (encarteData.validade) {
        ctx.fillText(`Válido até ${encarteData.validade}`, canvas.width / 2, currentY + 35);
      } else {
        ctx.fillText('Válido enquanto durarem os estoques', canvas.width / 2, currentY + 35);
      }
      
      ctx.font = '16px Arial';
      ctx.fillText('Discar Distribuidora - Parceira oficial Ambev', canvas.width / 2, currentY + 65);
      ctx.fillText('www.discardistribuidora.com.br', canvas.width / 2, currentY + 90);

    } catch (error) {
      console.error('Erro ao gerar encarte:', error);
      toast.error('Erro ao gerar encarte');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadEncarte = (format: 'png' | 'jpg') => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      
      if (format === 'jpg') {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);
        
        link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
      } else {
        link.href = canvas.toDataURL('image/png');
      }
      
      const fileName = `encarte_${encarteData?.product.codigo}_${Date.now()}.${format}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Encarte baixado como ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Erro ao baixar encarte:', error);
      toast.error('Erro ao baixar encarte');
    }
  };

  const shareEncarte = async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Falha ao criar blob'));
            }
          },
          'image/png',
          1.0
        );
      });
      
      if (navigator.share) {
        const file = new File([blob], 'encarte.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Encarte Promocional Discar',
          text: `Confira esta oferta: ${encarteData?.product.nome} por apenas R$ ${encarteData?.precoPromocional.toFixed(2).replace('.', ',')}!`,
          files: [file]
        });
        
        toast.success('Encarte compartilhado com sucesso!');
      } else {
        toast.info('Este navegador não suporta compartilhamento direto. Faça o download e compartilhe manualmente.');
        downloadEncarte('png');
      }
    } catch (error) {
      console.error('Erro ao compartilhar encarte:', error);
      toast.error('Erro ao compartilhar encarte');
    }
  };

  if (!encarteData) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-100 shadow-lg">
        <div className="text-gray-500">
          <Sparkles className="mx-auto h-16 w-16 text-blue-400 mb-4 animate-pulse" />
          <p className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Prévia do Encarte
          </p>
          <p className="text-gray-600">Preencha os dados do produto para gerar o encarte</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Encarte Gerado
          </h3>
        </div>
        <p className="text-gray-600 font-medium">{encarteData.product.nome}</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-200 rounded-xl shadow-lg max-w-full h-auto group-hover:shadow-2xl transition-shadow duration-300"
            style={{ maxWidth: '400px' }}
          />
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="text-gray-700 mt-2 font-medium">Gerando encarte...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => downloadEncarte('png')}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-4 h-4 mr-2" />
          PNG
        </Button>
        <Button
          onClick={() => downloadEncarte('jpg')}
          disabled={isGenerating}
          variant="outline"
          className="border-2 border-blue-300 hover:bg-blue-50 font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-4 h-4 mr-2" />
          JPG
        </Button>
        <Button
          onClick={shareEncarte}
          disabled={isGenerating}
          className="col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold mt-2 transition-all duration-300 transform hover:scale-105"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar Encarte
        </Button>
      </div>
    </Card>
  );
};
