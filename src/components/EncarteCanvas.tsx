
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EncarteData } from '@/types/product';
import { templates } from '@/data/templates';
import { toast } from 'sonner';

interface EncarteCanvasProps {
  encarteData: EncarteData | null;
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

    // Configurações do canvas
    canvas.width = 600;
    canvas.height = 800;

    const template = templates.find(t => t.id === encarteData.template);
    if (!template) return;

    try {
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background com gradiente
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, template.colors.primary);
      gradient.addColorStop(1, template.colors.secondary);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header da empresa
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, 0, canvas.width, 80);
      
      ctx.fillStyle = template.colors.primary;
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DISCAR DISTRIBUIDORA', canvas.width / 2, 35);
      
      ctx.font = '16px Arial';
      ctx.fillText('Produtos Ambev - Qualidade Garantida', canvas.width / 2, 60);

      // Área do produto
      const productAreaY = 100;
      const productAreaHeight = 500;
      
      // Fundo branco para área do produto
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(20, productAreaY, canvas.width - 40, productAreaHeight);

      // Carregar e desenhar imagem do produto
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          // Desenhar imagem centralizada
          const imgSize = 200;
          const imgX = (canvas.width - imgSize) / 2;
          const imgY = productAreaY + 20;
          
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          resolve();
        };
        
        img.onerror = () => {
          // Desenhar placeholder se imagem falhar
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect((canvas.width - 200) / 2, productAreaY + 20, 200, 200);
          ctx.fillStyle = '#9ca3af';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Imagem não', canvas.width / 2, productAreaY + 110);
          ctx.fillText('disponível', canvas.width / 2, productAreaY + 130);
          resolve();
        };
        
        img.src = encarteData.product.urlImagem;
      });

      // Nome do produto
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      
      // Quebrar texto se for muito longo
      const maxWidth = canvas.width - 80;
      const words = encarteData.product.nome.split(' ');
      let line = '';
      let y = productAreaY + 260;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Selo de oferta
      const seloY = productAreaY + 320;
      ctx.fillStyle = template.colors.secondary;
      ctx.fillRect(50, seloY, canvas.width - 100, 60);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('OFERTA IMPERDÍVEL!', canvas.width / 2, seloY + 40);

      // Preços
      const precosY = seloY + 80;
      
      // Preço original (riscado)
      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      const precoOrigText = `DE R$ ${encarteData.precoOriginal.toFixed(2).replace('.', ',')}`;
      ctx.fillText(precoOrigText, canvas.width / 2, precosY);
      
      // Linha riscando o preço original
      const textWidth = ctx.measureText(precoOrigText).width;
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo((canvas.width - textWidth) / 2, precosY - 8);
      ctx.lineTo((canvas.width + textWidth) / 2, precosY - 8);
      ctx.stroke();

      // Preço promocional
      ctx.fillStyle = template.colors.primary;
      ctx.font = 'bold 48px Arial';
      ctx.fillText(`R$ ${encarteData.precoPromocional.toFixed(2).replace('.', ',')}`, canvas.width / 2, precosY + 60);

      // Calcular desconto
      const desconto = Math.round(((encarteData.precoOriginal - encarteData.precoPromocional) / encarteData.precoOriginal) * 100);
      
      // Badge de desconto
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(canvas.width - 120, productAreaY + 40, 100, 40);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`-${desconto}%`, canvas.width - 70, productAreaY + 65);

      // Footer
      const footerY = canvas.height - 100;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, footerY, canvas.width, 100);
      
      ctx.fillStyle = template.colors.primary;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Válido enquanto durarem os estoques', canvas.width / 2, footerY + 30);
      
      ctx.font = '14px Arial';
      ctx.fillText('Discar Distribuidora - Parceira oficial Ambev', canvas.width / 2, footerY + 55);
      ctx.fillText('www.discardistribuidora.com.br', canvas.width / 2, footerY + 75);

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
        // Para JPG, criar um canvas temporário com fundo branco
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Preencher com branco
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Desenhar o canvas original por cima
        tempCtx.drawImage(canvas, 0, 0);
        
        link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
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

  if (!encarteData) {
    return (
      <Card className="p-8 text-center bg-gray-50">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">Prévia do Encarte</p>
          <p>Preencha os dados do produto para gerar o encarte</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-scale-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Encarte Gerado</h3>
        <p className="text-gray-600">{encarteData.product.nome}</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-lg max-w-full h-auto"
          style={{ maxWidth: '400px' }}
        />
      </div>

      {isGenerating && (
        <div className="text-center mb-4">
          <p className="text-gray-600">Gerando encarte...</p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Button
          onClick={() => downloadEncarte('png')}
          disabled={isGenerating}
          className="bg-gradient-blue hover:opacity-90 text-white"
        >
          Baixar PNG
        </Button>
        <Button
          onClick={() => downloadEncarte('jpg')}
          disabled={isGenerating}
          variant="outline"
        >
          Baixar JPG
        </Button>
      </div>
    </Card>
  );
};
