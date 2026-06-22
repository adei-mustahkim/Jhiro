import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Building2, MapPin, Shield } from "lucide-react";
import { PasswordChangeForm } from "@/components/portal/password-change-form";

async function getClientData(userId: string) {
  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      user: {
        select: { name: true, email: true, createdAt: true },
      },
      _count: {
        select: { projects: { where: { deletedAt: null } } },
      },
    },
  });

  return client;
}

export default async function PortalProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN" || session.user.role === "PROJECT_MANAGER") {
    redirect("/dashboard");
  }

  const clientData = await getClientData(session.user.id);

  if (!clientData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profil</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Data profil tidak ditemukan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi profil Anda
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{clientData.companyName}</h2>
              <p className="text-muted-foreground">{session.user.email}</p>
              <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Klien
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {clientData._count.projects} Proyek
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
            <CardDescription>
              Informasi kontak perusahaan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input id="name" defaultValue={session.user.name || ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue={session.user.email || ""} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input id="phone" defaultValue={clientData.phone || ""} placeholder="+62 xxx xxxx xxxx" />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="company">Nama Perusahaan</Label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Input id="company" defaultValue={clientData.companyName} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industri</Label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Input id="industry" defaultValue={clientData.industry || ""} placeholder="Contoh: Teknologi, Fashion" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input id="address" defaultValue={clientData.address || ""} placeholder="Alamat perusahaan" />
              </div>
            </div>
            <Button className="w-full" disabled title="Pembaruan profil segera tersedia">Simpan Perubahan</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Info Akun</CardTitle>
              <CardDescription>
                Informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Peran</span>
                <Badge>Klien</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Anggota Sejak</span>
                <span className="text-sm">{formatDate(clientData.user.createdAt)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Proyek</span>
                <span className="text-sm font-medium">{clientData._count.projects}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>
                Pengaturan keamanan akun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
