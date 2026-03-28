import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pluginDb } from '@/lib/db';
import Link from 'next/link';

// Taking direct DB approach for server component strictly for Installed plugins 
// to avoid circular fetches.
async function getInstalledPlugins() {
  const userId = 'system-admin'; 
  const query = `
    SELECT i.id as install_id, i.version_installed, p.id, p.name, p.description, p.author
    FROM installed_plugins i
    JOIN plugins p ON i.plugin_id = p.id
    WHERE i.user_id = $1
  `;
  try {
    const plugins = await pluginDb.select(query, [userId]);
    return plugins;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function InstalledPluginsPage() {
  const installed = await getInstalledPlugins();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Plugin Terinstal</h2>
          <p className="text-muted-foreground">Kelola ekstensi aktif di environment lokal Omni-Tool Anda.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {installed.map((plugin: any) => (
          <Card key={plugin.install_id} className="flex flex-col border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{plugin.name}</CardTitle>
                <Badge variant="outline">v{plugin.version_installed}</Badge>
              </div>
              <CardDescription>Oleh {plugin.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-foreground/80">{plugin.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <form action={`/api/plugins/install/${plugin.id}`} method="POST">
                 <input type="hidden" name="_method" value="DELETE" />
                 <Button variant="destructive" size="sm" type="button" disabled>Hapus</Button>
              </form>
              <Link href={`/plugins/run/${plugin.id}`}>
                <Button size="sm">Jalankan</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {installed.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed">
            Belum ada plugin yang terinstal. Cek Marketplace!
          </div>
        )}
      </div>
    </div>
  );
}
