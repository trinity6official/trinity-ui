import { IntentPrompt } from '@/components/intent-prompt';

const principles = [
  ['Explore', 'Understand meaningful systems, objects, and relationships visually.'],
  ['Learn', 'Use guided explanations and simulations instead of passive feature pages.'],
  ['Build', 'Turn goals into projects with Trinity as the intelligence layer.'],
] as const;

export default function Home() {
  return (
    <main className="shell">
      <header className="siteHeader">
        <a className="brand" href="/" aria-label="Trinity6 home">TRINITY6</a>
        <span className="phase">Foundation</span>
      </header>
      <section className="hero" aria-labelledby="hero-title">
        <div className="heroInner">
          <p className="eyebrow">Interactive digital world</p>
          <h1 id="hero-title">Explore. Learn. Build.</h1>
          <p className="intro">Trinity6 is becoming an interactive environment for understanding technology and turning ideas into real work. The first world is a company you can explore, question, and learn from.</p>
          <IntentPrompt />
          <div className="pillRow" aria-label="Example goals">
            <span className="pill">Learn cybersecurity</span><span className="pill">Understand AI</span><span className="pill">Explore cloud</span><span className="pill">Start an AI business</span>
          </div>
          <div className="principles" aria-label="Product pillars">
            {principles.map(([title, copy]) => <article className="principle" key={title}><h2>{title}</h2><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
    </main>
  );
}
