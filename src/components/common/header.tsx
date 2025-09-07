"use client";

import {
  Home,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  Package,
  Search,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";
import SearchCommand from "./search-command";

const NAV = [
  { href: "/category/t-shirt", label: "T-shirts" },
  { href: "/category/bermuda-cales", label: "Bermudas" },
  { href: "/category/calas", label: "Calças" },
  { href: "/category/casacos-sweatshirts", label: "Casacos & Sweatshirts" },
  { href: "/category/sapatilhas", label: "Sapatilhas" },
  { href: "/category/acessrios", label: "Acessórios" },
];

export const Header = () => {
  const { data: session } = authClient.useSession();
  const [openSearch, setOpenSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const goToSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    setOpenSearch(false);
    router.push(`/busca/${encodeURIComponent(q)}`);
  };

  // helper para saber se a rota atual pertence ao link (ex.: /category/calcas/...)
  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        {/* barra principal */}
        <div className="grid grid-cols-3 items-center py-3 md:py-4">
          {/* esquerda: menu mobile + saudação/usuário desktop */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl md:hidden"
                  aria-label="Abrir menu"
                >
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[86vw] max-w-sm rounded-r-3xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pl-1">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label="Fechar"
                      />
                    </SheetClose>
                  </div>

                  {/* bloco login mobile */}
                  {session?.user ? (
                    <div className="flex items-center justify-between rounded-2xl border bg-slate-50 p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={session.user.image ?? ""} />
                          <AvatarFallback>
                            {session.user?.name?.split(" ")?.[0]?.[0]}
                            {session.user?.name?.split(" ")?.[1]?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">
                            Olá, {session.user.name?.split(" ")?.[0]}
                          </p>
                          <span className="text-xs text-slate-500">
                            {session.user.email}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => authClient.signOut()}
                        aria-label="Sair"
                      >
                        <LogOutIcon />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-2xl border bg-slate-50 p-3">
                      <p className="text-sm font-semibold">
                        Olá. Faça seu login!
                      </p>
                      <Button asChild className="rounded-full">
                        <Link href="/authentication">
                          Login <LogInIcon className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  <nav className="space-y-1">
                    <Link
                      href="/"
                      className={`flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 ${
                        isActive("/") && pathname === "/" ? "text-primary" : ""
                      }`}
                    >
                      <Home className="h-4 w-4" /> Início
                    </Link>
                    <Link
                      href="/my-orders"
                      className={`flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 ${
                        isActive("/my-orders") ? "text-primary" : ""
                      }`}
                    >
                      <Package className="h-4 w-4" /> Os Meus Pedidos
                    </Link>

                    <Separator className="my-2" />
                    {NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-xl p-3 hover:bg-slate-50 ${
                          isActive(item.href) ? "text-primary" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* desktop: nome clicável com ícone de user e dropdown */}
            <div className="hidden md:block">
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 hover:text-black">
                    <User2 className="h-4 w-4" />
                    Olá,{" "}
                    <span className="font-semibold">
                      {session.user.name?.split(" ")?.[0]}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={session.user.image ?? ""} />
                          <AvatarFallback>
                            {session.user?.name?.split(" ")?.[0]?.[0]}
                            {session.user?.name?.split(" ")?.[1]?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate text-sm">
                          {session.user.email}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/my-orders">Os Meus pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => authClient.signOut()}
                      className="cursor-pointer text-red-600 focus:text-red-700"
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" /> Sair da conta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 hover:text-black">
                    <User2 className="h-4 w-4" />
                    Fazer login
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/authentication">
                        <LogInIcon className="mr-2 h-4 w-4" /> Fazer login
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* centro: logo */}
          <div className="flex items-center justify-center">
            <Link href="/" aria-label="BEWEAR">
              <Image
                src="/logo.svg"
                alt="BEWEAR"
                width={110}
                height={28}
                priority
              />
            </Link>
          </div>

          {/* direita: ações */}
          <div className="flex items-center justify-end gap-2">
            {/* Lupa abre a busca (mobile + desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer rounded-2xl"
              aria-label="Portfolio"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Cart />
          </div>
        </div>

        {/* nav desktop */}
        <nav className="hidden items-center justify-center gap-6 pb-3 text-sm text-slate-700 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-2 py-1 hover:text-black ${
                  active ? "text-primary" : ""
                }`}
              >
                <span
                  className={`inline-block pb-1 ${
                    active
                      ? "border-primary border-b-2"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <Separator />

      {/* Dialog de Busca */}
      <SearchCommand
        open={openSearch}
        onOpenChange={setOpenSearch}
        onSubmit={goToSearch}
      />
    </header>
  );
};
