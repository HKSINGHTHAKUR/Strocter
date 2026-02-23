export default function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-xs">S</span>
          </div>
          <span className="text-sm text-muted-foreground">Strocter</span>
        </div>
        <p className="text-xs text-muted-foreground/50">
          © 2026 Strocter. Behavioral Finance AI Platform.
        </p>
        <div className="flex gap-8">
          {['Privacy', 'Terms', 'Contact'].map((item) => (
            <a key={item} href="#" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
