
import { Product } from '../types/product';

export const parseCSV = (content: string): Product[] => {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const products: Product[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length >= 3) {
      const product: Product = {
        codigo: values[headers.indexOf('codigo') || headers.indexOf('código') || 0] || values[0],
        nome: values[headers.indexOf('nome') || headers.indexOf('produto') || 1] || values[1],
        urlImagem: values[headers.indexOf('urlimagem') || headers.indexOf('url') || headers.indexOf('imagem') || 2] || values[2]
      };
      
      products.push(product);
    }
  }
  
  return products;
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
