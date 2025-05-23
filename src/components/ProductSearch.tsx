
import React, { useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

interface ProductSearchProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
}

export const ProductSearch = ({ products, selectedProduct, onProductSelect }: ProductSearchProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    
    const searchTerm = search.toLowerCase();
    return products.filter(product => 
      product.nome.toLowerCase().includes(searchTerm) ||
      product.codigo.toLowerCase().includes(searchTerm)
    );
  }, [products, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 text-left border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 bg-white"
        >
          {selectedProduct ? (
            <div className="flex items-center gap-3">
              <img 
                src={selectedProduct.urlImagem} 
                alt={selectedProduct.nome}
                className="w-8 h-8 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNmM2Y0ZjYiIHJ4PSI0Ii8+PHBhdGggZD0iTTE2IDE0YzEuMTA1IDAgMi0uODk1IDItMnMtLjg5NS0yLTItMi0yIC44OTUtMiAyIC44OTUgMiAyIDJ6bTYgMUgxMHY2aDhWMThoNHYtM0gxNnYtMXptLTEyIDBoMXYxSDI0di0xSDEweiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==';
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{selectedProduct.nome}</p>
                <p className="text-sm text-gray-500">{selectedProduct.codigo}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Search size={16} />
              <span>Pesquisar produto...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-2 border-blue-100">
        <Command>
          <CommandInput 
            placeholder="Digite o nome ou código do produto..." 
            value={search}
            onValueChange={setSearch}
            className="border-0 focus:ring-0"
          />
          <CommandList className="max-h-64">
            <CommandEmpty>
              <div className="text-center py-6">
                <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">Nenhum produto encontrado</p>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.codigo}
                  value={`${product.codigo} ${product.nome}`}
                  onSelect={() => {
                    onProductSelect(product);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <img 
                    src={product.urlImagem} 
                    alt={product.nome}
                    className="w-10 h-10 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmM2Y0ZjYiIHJ4PSI0Ii8+PHBhdGggZD0iTTIwIDE4YzEuMTA1IDAgMi0uODk1IDItMnMtLjg5NS0yLTItMi0yIC44OTUtMiAyIC44OTUgMiAyIDJ6bTggMUgxMnY4aDEwVjIyaDZ2LTNIMjB2LTF6bS0xNiAwaDJ2MkgzMHYtMkgxMnoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{product.nome}</p>
                    <p className="text-sm text-gray-500">{product.codigo}</p>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-blue-600",
                      selectedProduct?.codigo === product.codigo ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
