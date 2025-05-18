import React, { useEffect, useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoData } from '../../types';
import { Select } from '../ui/Select';

interface CryptoWidgetProps {
  id: string;
  title: string;
  size: 'sm' | 'md' | 'lg';
}

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;


export const CryptoWidget: React.FC<CryptoWidgetProps> = ({ id, title, size }) => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<string[]>(() => {
    const saved = localStorage.getItem(`cryptoCoins-${id}`);
    return saved ? JSON.parse(saved) : ['bitcoin', 'ethereum', 'solana'];
  });

  const coinOptions = [
    { value: '', label: 'Add coin...' },
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'solana', label: 'Solana (SOL)' },
    { value: 'cardano', label: 'Cardano (ADA)' },
    { value: 'polkadot', label: 'Polkadot (DOT)' },
    { value: 'binancecoin', label: 'Binance Coin (BNB)' },
  ].filter(coin => coin.value === '' || !selectedCoins.includes(coin.value));

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const coinIds = selectedCoins.join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`,
          {
            headers: {
              'accept': 'application/json',
              'x-cg-demo-api-key': API_KEY
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch crypto data');
        }

        const data = await response.json();
        
        const cryptoData: CryptoData[] = selectedCoins.map(coinId => ({
          id: coinId,
          name: coinOptions.find(coin => coin.value === coinId)?.label.split(' ')[0] || coinId,
          symbol: coinOptions.find(coin => coin.value === coinId)?.label.match(/\(([^)]+)\)/)?.[1] || coinId.toUpperCase(),
          price: data[coinId].usd,
          change24h: data[coinId].usd_24h_change || 0,
          image: getCoinImage(coinId),
        }));

        setCryptos(cryptoData);
      } catch (err) {
        setError('Failed to fetch crypto data. Please try again later.');
        console.error('Crypto widget error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); 
    return () => clearInterval(interval);
  }, [selectedCoins]);

  const handleCoinSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    
    const newSelectedCoins = [...selectedCoins, value];
    setSelectedCoins(newSelectedCoins);
    localStorage.setItem(`cryptoCoins-${id}`, JSON.stringify(newSelectedCoins));
  };

  const removeCoin = (coinId: string) => {
    if (selectedCoins.length > 1) {
      const newSelectedCoins = selectedCoins.filter(id => id !== coinId);
      setSelectedCoins(newSelectedCoins);
      localStorage.setItem(`cryptoCoins-${id}`, JSON.stringify(newSelectedCoins));
    }
  };

  const getCoinImage = (coinId: string): string => {
    const imageMap: Record<string, string> = {
      'bitcoin': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      'ethereum': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'solana': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      'cardano': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      'polkadot': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
      'binancecoin': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    };
    return imageMap[coinId] || imageMap['bitcoin'];
  };

  return (
    <BaseWidget id={id} title={title} size={size}>
      <div className="p-4">
        <div className="mb-4">
          <Select
            options={coinOptions}
            value=""
            onChange={handleCoinSelection}
          />
        </div>

        {loading && (
          <div className="flex h-32 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-error/10 p-4 text-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-md border border-theme">
            <table className="w-full">
              <thead className="bg-theme-subtle text-xs uppercase text-theme-secondary">
                <tr>
                  <th className="px-4 py-2 text-left">Coin</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">24h</th>
                  <th className="px-4 py-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme">
                {cryptos.map((crypto) => (
                  <tr key={crypto.id} className="text-sm bg-theme-paper">
                    <td className="px-4 py-3 flex items-center">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name}
                        className="h-6 w-6 mr-2"
                      />
                      <div>
                        <p className="font-medium text-theme-primary">{crypto.name}</p>
                        <p className="text-xs text-theme-secondary">{crypto.symbol}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-theme-primary">
                      ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      crypto.change24h >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      <div className="flex items-center justify-end">
                        {crypto.change24h >= 0 ? (
                          <TrendingUp size={14} className="mr-1" />
                        ) : (
                          <TrendingDown size={14} className="mr-1" />
                        )}
                        {Math.abs(crypto.change24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeCoin(crypto.id)}
                        className="text-theme-secondary hover:text-error transition-colors"
                        disabled={selectedCoins.length <= 1}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};