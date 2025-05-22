
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EncarteData } from '@/types/product';
import { templates } from '@/data/templates';
import { toast } from 'sonner';
import { Download, Share2 } from 'lucide-react';

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

    try {
      // Configurações do canvas
      canvas.width = 600;
      canvas.height = 800;

      const template = templates.find(t => t.id === encarteData.template);
      if (!template) return;

      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background com gradiente ou branco para o template branco
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

      // Header da empresa - adaptado para cada template
      if (template.id === 'escuro') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      }
      ctx.fillRect(0, 0, canvas.width, 80);
      
      ctx.fillStyle = template.id === 'escuro' ? '#FFFFFF' : template.colors.primary;
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DISCAR DISTRIBUIDORA', canvas.width / 2, 35);
      
      ctx.font = '16px Arial';
      ctx.fillText('Produtos Ambev - Qualidade Garantida', canvas.width / 2, 60);

      // Área do produto
      const productAreaY = 100;
      const productAreaHeight = 500;
      
      // Fundo para área do produto
      if (template.id === 'branco') {
        ctx.fillStyle = 'rgba(249, 250, 251, 0.95)'; // Cinza muito claro
      } else if (template.id === 'escuro') {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.95)'; // Azul escuro
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      }
      ctx.fillRect(20, productAreaY, canvas.width - 40, productAreaHeight);

      // Carregar e desenhar imagem do produto
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          // Calcular proporções para manter aspecto
          let imgWidth = img.width;
          let imgHeight = img.height;
          const maxSize = 250; // Tamanho máximo em qualquer dimensão
          
          if (imgWidth > imgHeight) {
            if (imgWidth > maxSize) {
              imgHeight = (imgHeight * maxSize) / imgWidth;
              imgWidth = maxSize;
            }
          } else {
            if (imgHeight > maxSize) {
              imgWidth = (imgWidth * maxSize) / imgHeight;
              imgHeight = maxSize;
            }
          }
          
          // Centralizar na área do produto
          const imgX = (canvas.width - imgWidth) / 2;
          const imgY = productAreaY + 20;
          
          // Se for para remover o fundo e não for o template branco
          if (encarteData.imagemSemFundo && template.id !== 'branco') {
            try {
              // Aqui seria implementado um algoritmo de remoção de fundo
              // Esta é uma simulação simplificada - na implementação real, usaríamos uma biblioteca como ml5.js ou RemoveBg API
              
              // 1. Criar um canvas temporário
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = imgWidth;
              tempCanvas.height = imgHeight;
              const tempCtx = tempCanvas.getContext('2d');
              
              if (tempCtx) {
                // 2. Desenhar a imagem no canvas temporário
                tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
                
                // 3. Desenhamos com transparência "fake" em torno da parte central
                // Nota: isto é apenas uma simulação, não uma real remoção de fundo
                ctx.save();
                ctx.beginPath();
                ctx.arc(imgX + imgWidth/2, imgY + imgHeight/2, Math.min(imgWidth, imgHeight)/2 - 10, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
                ctx.restore();
              } else {
                // Fallback se não conseguir criar o contexto temporário
                ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
              }
            } catch (error) {
              console.error('Erro ao processar imagem sem fundo:', error);
              ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            }
          } else {
            // Desenho normal
            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
          }
          
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
      if (template.id === 'escuro') {
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.fillStyle = '#1f2937';
      }
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      
      // Quebrar texto se for muito longo
      const maxWidth = canvas.width - 80;
      const words = encarteData.product.nome.split(' ');
      let line = '';
      let y = productAreaY + 300;
      
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
      const seloY = y + 40;
      ctx.fillStyle = template.colors.secondary;
      ctx.fillRect(50, seloY, canvas.width - 100, 60);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('OFERTA IMPERDÍVEL!', canvas.width / 2, seloY + 40);

      // Preços
      const precosY = seloY + 80;
      
      // Preço original (riscado)
      ctx.fillStyle = template.id === 'escuro' ? '#BFDBFE' : '#6b7280';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      const precoOrigText = `DE R$ ${encarteData.precoOriginal.toFixed(2).replace('.', ',')}`;
      ctx.fillText(precoOrigText, canvas.width / 2, precosY);
      
      // Linha riscando o preço original
      const textWidth = ctx.measureText(precoOrigText).width;
      ctx.strokeStyle = template.id === 'escuro' ? '#BFDBFE' : '#6b7280';
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

      // Informações adicionais (se existirem)
      if (encarteData.informacoesAdicionais) {
        const infoY = precosY + 100;
        ctx.fillStyle = template.id === 'escuro' ? '#D1D5DB' : '#4B5563';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        // Quebrar texto de informações adicionais
        const infoWords = encarteData.informacoesAdicionais.split(' ');
        let infoLine = '';
        let infoLineY = infoY;
        
        for (let n = 0; n < infoWords.length; n++) {
          const testLine = infoLine + infoWords[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(infoLine, canvas.width / 2, infoLineY);
            infoLine = infoWords[n] + ' ';
            infoLineY += 20;
          } else {
            infoLine = testLine;
          }
        }
        ctx.fillText(infoLine, canvas.width / 2, infoLineY);
      }

      // Footer
      const footerY = canvas.height - 100;
      if (template.id === 'escuro') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      }
      ctx.fillRect(0, footerY, canvas.width, 100);
      
      ctx.fillStyle = template.id === 'escuro' ? '#FFFFFF' : template.colors.primary;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      
      // Texto de validade
      if (encarteData.validade) {
        ctx.fillText(`Válido até ${encarteData.validade}`, canvas.width / 2, footerY + 30);
      } else {
        ctx.fillText('Válido enquanto durarem os estoques', canvas.width / 2, footerY + 30);
      }
      
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

  const shareEncarte = async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      
      // Converter canvas para blob
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
      
      // Verificar se a API de compartilhamento está disponível
      if (navigator.share) {
        const file = new File([blob], 'encarte.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Encarte Promocional Discar',
          text: `Confira esta oferta: ${encarteData?.product.nome} por apenas R$ ${encarteData?.precoPromocional.toFixed(2).replace('.', ',')}!`,
          files: [file]
        });
        
        toast.success('Encarte compartilhado com sucesso!');
      } else {
        // Fallback se o navegador não suportar a API Web Share
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
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">Prévia do Encarte</p>
          <p>Preencha os dados do produto para gerar o encarte</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-scale-in bg-white border border-blue-200 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
          Encarte Gerado
        </h3>
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600 mt-2">Gerando encarte...</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => downloadEncarte('png')}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar PNG
        </Button>
        <Button
          onClick={() => downloadEncarte('jpg')}
          disabled={isGenerating}
          variant="outline"
          className="border-blue-300 hover:bg-blue-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar JPG
        </Button>
        <Button
          onClick={shareEncarte}
          disabled={isGenerating}
          className="col-span-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white mt-2"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar Encarte
        </Button>
      </div>
    </Card>
  );
};
