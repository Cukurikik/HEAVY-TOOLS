import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

async function getMarketplacePlugins() {
  const res = await fetch('http://localhost:3000/api/plugins/marketplace', { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data;
}

export default async function MarketplacePage() {
  const plugins = await getMarketplacePlugins();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Plugin Marketplace</h2>
          <p className="text-muted-foreground">Jelajahi dan instal ekstensi komunitas untuk Omni-Tool</p>
        </div>
        <Button>Upload ZIP Berbayar</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin: any) => (
          <Card key={plugin.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{plugin.name}</CardTitle>
                {plugin.is_official && <Badge variant="default">Official</Badge>}
              </div>
              <CardDescription>Oleh {plugin.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-foreground/80">{plugin.description}</p>
              <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <span className="mr-1">⬇️</span> {plugin.downloads}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">⭐</span> {Number(plugin.average_rating).toFixed(1)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <form action="/api/plugins/install" method="POST" className="w-full">
                {/* Note: In a real app we'd use a client side form or real fetch to /api/plugins/marketplace/[id]/download and pipe to install. */}
                <Button className="w-full" variant={plugin.price > 0 ? 'secondary' : 'default'} disabled>
                  {plugin.price > 0 ? `Beli ($${plugin.price})` : 'Instal via Web'}
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
        {plugins.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada plugin di marketplace saat ini.</p>
        )}
      </div>
    </div>
  );
}
