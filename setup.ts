@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

@layer base {
  :root {
    --background: 220 20% 4%;
    --foreground: 210 20% 92%;

    --card: 220 18% 8%;
    --card-foreground: 210 20% 92%;

    --popover: 220 18% 8%;
    --popover-foreground: 210 20% 92%;

    --primary: 24 95% 53%;
    --primary-foreground: 0 0% 100%;

    --secondary: 220 15% 14%;
    --secondary-foreground: 210 20% 85%;

    --muted: 220 14% 12%;
    --muted-foreground: 215 15% 50%;

    --accent: 263 70% 52%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 14% 16%;
    --input: 220 14% 16%;
    --ring: 24 95% 53%;

    --radius: 0.75rem;

    --emerald: 160 84% 39%;
    --glow-orange: 24 95% 53%;
    --glow-violet: 263 70% 52%;
    --glow-emerald: 160 84% 39%;
    --deep-base: 220 20% 4%;
    --panel-dark: 220 18% 8%;
    --card-depth: 218 20% 11%;

    --sidebar-background: 220 20% 4%;
    --sidebar-foreground: 210 20% 92%;
    --sidebar-primary: 24 95% 53%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 14% 12%;
    --sidebar-accent-foreground: 210 20% 92%;
    --sidebar-border: 220 14% 16%;
    --sidebar-ring: 24 95% 53%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
  }

  html {
    scroll-behavior: auto;
  }
}

@layer utilities {
  .text-gradient-primary {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  }

  .text-gradient-subtle {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--muted-foreground)));
  }

  .glass-panel {
    @apply bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl;
  }

  .glass-panel-elevated {
    @apply bg-card/60 backdrop-blur-2xl border border-primary/20 rounded-2xl;
    box-shadow: 0 0 40px -10px hsl(var(--primary) / 0.15),
                0 0 80px -20px hsl(var(--accent) / 0.1);
  }

  .glow-border {
    position: relative;
  }

  .glow-border::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.3), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .section-padding {
    @apply px-6 md:px-12 lg:px-24 py-24 md:py-32 lg:py-40;
  }

  .heading-xl {
    @apply text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight leading-[0.9];
  }

  .heading-lg {
    @apply text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1];
  }

  .heading-md {
    @apply text-xl md:text-2xl lg:text-3xl font-light tracking-tight;
  }

  .body-lg {
    @apply text-base md:text-lg text-muted-foreground font-light leading-relaxed tracking-wide;
  }

  .label-sm {
    @apply text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground;
  }
}
