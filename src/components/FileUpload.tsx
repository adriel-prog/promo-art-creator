
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseCSV } from '@/utils/csvParser';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface FileUploadProps {
  onProductsLoaded: (products: Product[]) => void;
}

export const FileUpload = ({ onProductsLoaded }: FileUploadProps) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const products = parseCSV(content);
        
        if (products.length === 0) {
          toast.error('Nenhum produto encontrado na planilha');
          return;
        }

        onProductsLoaded(products);
        setIsUploaded(true);
        setFileName(file.name);
        toast.success(`${products.length} produtos carregados com sucesso!`);
      } catch (error) {
        toast.error('Erro ao processar arquivo. Verifique o formato CSV.');
        console.error('Erro ao processar CSV:', error);
      }
    };
    reader.readAsText(file);
  }, [onProductsLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const resetUpload = () => {
    setIsUploaded(false);
    setFileName('');
    onProductsLoaded([]);
  };

  if (isUploaded) {
    return (
      <Card className="p-6 bg-green-50 border-green-200 animate-scale-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Arquivo carregado!</h3>
              <p className="text-sm text-green-600">{fileName}</p>
            </div>
          </div>
          <Button variant="outline" onClick={resetUpload} size="sm">
            Alterar arquivo
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover-scale animate-fade-in">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
          isDragActive 
            ? 'border-promo-orange bg-orange-50' 
            : 'border-gray-300 hover:border-promo-orange hover:bg-orange-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {isDragActive ? (
              <Upload className="w-12 h-12 text-promo-orange animate-bounce" />
            ) : (
              <FileSpreadsheet className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? 'Solte o arquivo aqui' : 'Faça upload da planilha'}
          </h3>
          <p className="text-gray-600 mb-4">
            Arraste e solte ou clique para selecionar um arquivo CSV ou Excel
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium mb-2">Formato esperado:</p>
            <div className="text-left">
              <p>• <strong>Coluna 1:</strong> Código do produto</p>
              <p>• <strong>Coluna 2:</strong> Nome do produto</p>
              <p>• <strong>Coluna 3:</strong> URL da imagem</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
