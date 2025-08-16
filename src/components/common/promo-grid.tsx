import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

/**
 * Gradientes:
 * - Azul (jacket):  #A0CBE9 -> #EAEFFA
 * - Preto (shoe):   #B9BBCA -> #EEEFF6
 * - Roxo (shoe):    #B0B1F0 -> #EAEFFA
 *
 * Imagens:
 * - /promo/shoe-black.png   (1026x614)
 * - /promo/shoe-purple.png  (1026x614)
 * - /promo/jacket-blue.png  (1630x1276)
 */

export default function PromoGrid() {
  return (
    <section className="mx-2 grid grid-cols-1 gap-4 md:mx-5 md:grid-cols-3">
      {/* Coluna esquerda: 2 cards (tênis) */}
      <div className="grid gap-4">
        <PromoCard
          title="Nike Therma FIT Headed Preto"
          gradient="bg-[linear-gradient(180deg,#B9BBCA_0%,#EEEFF6_100%)]"
          img={{ src: "/promo/shoe-black.png", width: 1026, height: 614 }}
          ratio="aspect-[1026/614]"
          link="/produto/tenis-preto"
        />

        <PromoCard
          title="Nike Therma FIT Headed Roxo"
          gradient="bg-[linear-gradient(180deg,#B0B1F0_0%,#EAEFFA_100%)]"
          img={{ src: "/promo/shoe-purple.png", width: 1026, height: 614 }}
          ratio="aspect-[1026/614]"
          link="/produto/tenis-roxo"
        />
      </div>

      {/* Card grande: jaqueta azul */}
      <PromoCard
        className="md:col-span-2"
        title="Nike Therma FIT Headed Azul"
        gradient="bg-[linear-gradient(180deg,#A0CBE9_0%,#EAEFFA_100%)]"
        img={{ src: "/promo/jacket-blue.png", width: 1630, height: 1276 }}
        ratio="aspect-[1630/1276]"
        link="/produto/jaqueta-azul"
      />
    </section>
  );
}

type PromoCardProps = {
  title: string;
  gradient: string;
  img: { src: string; width: number; height: number };
  ratio: string;
  link: string; // nova prop
  className?: string;
};

function PromoCard({
  title,
  gradient,
  img,
  ratio,
  className,
  link,
}: PromoCardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl p-5",
        "shadow-sm transition",
        gradient,
        className ?? "",
      ].join(" ")}
    >
      <h4 className="z-10 mb-2 text-xl font-semibold text-white drop-shadow md:text-2xl">
        {title}
      </h4>

      <div className={`relative ${ratio} w-full`}>
        <Image
          src={img.src}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-contain"
        />
      </div>

      <Button
        asChild
        className="absolute right-4 bottom-3 rounded-full bg-white px-6 py-5 text-lg text-slate-900 hover:bg-white/90"
      >
        <Link href={link}>Comprar</Link>
      </Button>
    </div>
  );
}
