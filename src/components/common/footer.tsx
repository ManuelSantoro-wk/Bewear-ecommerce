const Footer = () => {
  return (
    <footer className="bg-accent w-full border-t px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 text-center md:flex-row md:justify-between md:gap-4 md:text-left">
        <div>
          <p className="text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} BEWEAR
          </p>
          <p className="text-muted-foreground text-xs font-medium">
            Todos os direitos reservados.
          </p>
        </div>

        <nav className="mt-3 flex gap-4 md:mt-0">
          <a
            href="/privacy"
            className="text-muted-foreground hover:text-primary text-xs transition-colors"
          >
            Política de Privacidade
          </a>
          <a
            href="/terms"
            className="text-muted-foreground hover:text-primary text-xs transition-colors"
          >
            Termos de Uso
          </a>
          <a
            href="/contact"
            className="text-muted-foreground hover:text-primary text-xs transition-colors"
          >
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
