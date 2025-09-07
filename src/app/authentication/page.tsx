import { Header } from "@/components/common/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authentication = async () => {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-6 md:px-4">
        <section className="grid gap-6 md:grid-cols-12 md:gap-8">
          {/* Coluna esquerda: abas + forms */}
          <div className="md:col-span-7 lg:col-span-6">
            <Tabs defaultValue="sign-in" className="w-full">
              <TabsList className="w-full justify-start rounded-2xl">
                <TabsTrigger
                  value="sign-in"
                  className="cursor-pointer rounded-xl px-4"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="sign-up"
                  className="cursor-pointer rounded-xl px-4"
                >
                  Criar conta
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="sign-in" className="w-full">
                  <div className="mx-auto max-w-md md:max-w-lg">
                    <SignInForm />
                  </div>
                </TabsContent>

                <TabsContent value="sign-up" className="w-full">
                  <div className="mx-auto max-w-md md:max-w-lg">
                    <SignUpForm />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Coluna direita: painel visual (desktop only) */}
          <aside className="hidden md:col-span-5 md:block lg:col-span-6">
            <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#D9D6FF_0%,#F3F5FF_100%)] p-8">
              <div className="max-w-md">
                <h2 className="text-2xl leading-tight font-semibold">
                  Bem-vindo(a) à BEWEAR
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Acesse sua conta para acompanhar pedidos, salvar moradas e
                  aproveitar uma experiência de compra personalizada.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li>• Checkout rápido com moradas salvas</li>
                  <li>• Histórico e status de pedidos</li>
                  <li>• Ofertas e novidades personalizadas</li>
                </ul>
              </div>

              {/* “Decor” opcional */}
              <div className="pointer-events-none absolute top-[-20%] right-[-20%] aspect-square w-[70%] rounded-full bg-white/40 blur-3xl" />
            </div>
          </aside>
        </section>
      </main>
    </>
  );
};

export default Authentication;
