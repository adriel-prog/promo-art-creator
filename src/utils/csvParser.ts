
import { Product } from '../types/product';

export const parseCSV = (content: string): Product[] => {
  // First determine the delimiter by checking the first line
  const firstLine = content.trim().split('\n')[0];
  // Check if the line contains tabs
  const delimiter = firstLine.includes('\t') ? '\t' : ',';
  
  const lines = content.trim().split('\n');
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
  
  // Log para debug
  console.log('Headers detectados:', headers);
  
  const products: Product[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(delimiter).map(v => v.trim());
    console.log(`Linha ${i}:`, values);
    
    if (values.length >= 3) {
      // Encontrar índices para cada coluna
      const codigoIndex = headers.findIndex(h => 
        h === 'codigo' || h === 'código' || h === 'cod' || h === 'code');
      const nomeIndex = headers.findIndex(h => 
        h === 'nome' || h === 'produto' || h === 'nome do produto' || h === 'product' || h === 'descrição');
      const urlIndex = headers.findIndex(h => 
        h === 'urlimagem' || h === 'url' || h === 'imagem' || h === 'url da imagem' || 
        h === 'url da im' || h === 'image' || h === 'link');
      
      console.log('Índices encontrados:', { codigoIndex, nomeIndex, urlIndex });
      
      // Use os índices encontrados ou use posições padrão (0, 1, 2)
      const product: Product = {
        codigo: values[codigoIndex !== -1 ? codigoIndex : 0],
        nome: values[nomeIndex !== -1 ? nomeIndex : 1],
        urlImagem: values[urlIndex !== -1 ? urlIndex : 2]
      };
      
      console.log('Produto processado:', product);
      
      // Only add the product if it has valid data
      if (product.codigo && product.nome && product.urlImagem) {
        products.push(product);
      }
    }
  }
  
  console.log(`Total de produtos processados: ${products.length}`);
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

export const downloadTemplateCSV = () => {
  const headers = 'Código,Nome do Produto,URL da Imagem\n';
  const exampleData = '1234,Cerveja Brahma 350ml,https://site.com/imagens/brahma350.jpg\n' +
                      '5678,Skol Pilsen 1L,https://site.com/imagens/skol1l.jpg\n' +
                      '9012,Antarctica Original 600ml,https://site.com/imagens/antarctica600.jpg';
  
  const content = headers + exampleData;
  
  downloadFile(content, 'template_encartes_discar.csv', 'text/csv;charset=utf-8');
};

export const generateExampleProducts = (): Product[] => {
  return [
    {
      codigo: '1234',
      nome: 'Cerveja Brahma 350ml',
      urlImagem: 'https://i.imgur.com/2dYJZ0D.jpg'
    },
    {
      codigo: '5678',
      nome: 'Skol Pilsen 1L',
      urlImagem: 'https://i.imgur.com/Gi9qBx5.jpg'
    },
    {
      codigo: '9012',
      nome: 'Antarctica Original 600ml',
      urlImagem: 'https://i.imgur.com/UQ0eF9B.jpg'
    }
  ];
};
