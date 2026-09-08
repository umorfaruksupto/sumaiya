'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Heart, Sparkles, RotateCcw } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  emoji: string;
}

interface Sparkle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  glyph: string;
}

const HEART_EMOJIS = ['💖', '💗', '✨', '🌸', '💞'];

const PRAISES = [
  {
    label: 'Your smile',
    text: 'It arrives before you say anything, and somehow it already answers everything.',
  },
  {
    label: 'Your eyes',
    text: 'There is a quiet warmth in them. The kind that makes a room feel safer just by looking up.',
  },
  {
    label: 'Your laugh',
    text: 'It is the most ordinary sound in the world and my favourite one at the same time.',
  },
  {
    label: 'Your voice',
    text: 'Even the smallest sentence sounds gentler when it comes from you.',
  },
  {
    label: 'The way you carry yourself',
    text: 'Soft, but never small. You take up space in the world the way flowers do.',
  },
  {
    label: 'Your kindness',
    text: 'You are gentle with people who could never repay it. That says everything about you.',
  },
  {
    label: 'Your mind',
    text: 'You notice things other people walk straight past. I love the way you think.',
  },
  {
    label: 'Your patience',
    text: 'You give people room to be human. Not everyone knows how to do that.',
  },
  {
    label: 'The little things you do',
    text: 'The small, unnoticed kindnesses. Those are the ones I notice most.',
  },
  {
    label: 'Your presence',
    text: 'Nothing has to happen. You are simply there, and the day turns softer.',
  },
  {
    label: 'Your strength',
    text: 'You keep going on the days it would be easier not to. That is a quiet kind of brave.',
  },
  {
    label: 'Just you',
    text: 'Not one part of you. All of it, exactly as it already is.',
  },
];

const LETTER_GREETING = 'Dear you,';

/** Adds `is-visible` to any [data-reveal] element once it scrolls into view. */
function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      document
        .querySelectorAll('[data-reveal]')
        .forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
    );

    const scan = () =>
      document
        .querySelectorAll('[data-reveal]:not(.is-visible)')
        .forEach((el) => observer.observe(el));

    scan();
    const interval = window.setInterval(scan, 800);

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, []);
}

/** Types out `full` once `ref` scrolls into view. */
function useTypewriter(full: string, ref: React.RefObject<HTMLElement | null>) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finish = () => {
      setTyped(full);
      setDone(true);
    };

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window) ||
      !ref.current
    ) {
      finish();
      return;
    }

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        let i = 0;
        timer = window.setInterval(() => {
          i += 1;
          setTyped(full.slice(0, i));
          if (i >= full.length) {
            window.clearInterval(timer);
            setDone(true);
          }
        }, 95);
      },
      { threshold: 0.15 },
    );

    observer.observe(ref.current);

    return () => {
      if (timer) window.clearInterval(timer);
      observer.disconnect();
    };
  }, [full, ref]);

  return { typed, done };
}

export default function Home() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [progress, setProgress] = useState(0);

  // Flashcard deck state
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [deckDone, setDeckDone] = useState(false);

  const letterHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const { typed: typedGreeting, done: greetingDone } = useTypewriter(
    LETTER_GREETING,
    letterHeadingRef,
  );

  useScrollReveal();

  // Ambient sparkles — generated client-side to avoid hydration mismatch.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const glyphs = ['✦', '✧', '·', '✵'];
    setSparkles(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 13 + Math.random() * 12,
        size: 7 + Math.random() * 11,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      })),
    );
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const spawnHearts = (e: React.MouseEvent | React.TouchEvent, count = 5) => {
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newHearts: FloatingHeart[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: clientX + (Math.random() - 0.5) * 70,
      y: clientY + (Math.random() - 0.5) * 34,
      size: 16 + Math.random() * 14,
      rotation: (Math.random() - 0.5) * 40,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    }));

    setHearts((prev) => [...prev.slice(-18), ...newHearts]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1400);
  };

  /** One tap: flip to reveal. Next tap: advance to the following card. */
  const handleDeckTap = (e: React.MouseEvent) => {
    if (!flipped) {
      setFlipped(true);
      setRevealedCount((c) => Math.max(c, cardIndex + 1));
      spawnHearts(e, 7);
      return;
    }

    if (cardIndex >= PRAISES.length - 1) {
      setDeckDone(true);
      spawnHearts(e, 14);
      return;
    }

    setFlipped(false);
    // Swap content only after the card has turned back over.
    setTimeout(() => setCardIndex((i) => i + 1), 320);
  };

  const resetDeck = (e: React.MouseEvent) => {
    setDeckDone(false);
    setFlipped(false);
    setCardIndex(0);
    setRevealedCount(0);
    spawnHearts(e, 6);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const b = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - b.left) / b.width - 0.5) * 10;
      const y = (0.5 - (e.clientY - b.top) / b.height) * 8;
      e.currentTarget.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  /** Subtle magnetic lift for the "little things" cards. */
  const handleMagnetMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width - 0.5) * 12;
    const y = ((e.clientY - b.top) / b.height - 0.5) * 12;
    e.currentTarget.style.transform = `translate(${x * 0.35}px, ${y * 0.35 - 4}px)`;
  };

  const handleMagnetLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  const activePraise = PRAISES[cardIndex];

  return (
    <main id="top">
      {/* Scroll progress */}
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />

      {/* Ambient drifting sparkles */}
      <div className="ambient-sparkles" aria-hidden="true">
        {sparkles.map((s) => (
          <span
            key={s.id}
            style={{
              left: `${s.left}%`,
              fontSize: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            {s.glyph}
          </span>
        ))}
      </div>

      {/* Floating interactive particles */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart-particle"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            fontSize: `${h.size}px`,
            transform: `rotate(${h.rotation}deg)`,
          }}
        >
          {h.emoji}
        </span>
      ))}

      <header className="site-header">
        <a className="brand" href="#top">
          a little world<span>just for you</span>
        </a>
        <button
          type="button"
          className="header-note"
          onClick={spawnHearts}
          aria-label="Tap for love"
        >
          <span className="header-note-text">Made with all my heart</span>
          <Heart size={15} className="heart-icon-pulse" />
        </button>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow reveal reveal-up" data-reveal>
            <span /> ONE PERSON. A THOUSAND LITTLE FEELINGS.
          </p>
          <h1 id="hero-title" className="reveal reveal-up shimmer-text" data-reveal style={{ '--d': '80ms' } as React.CSSProperties}>
            Some people<br />
            make the world<br />
            <em>more beautiful.</em>
          </h1>
          <p className="intro reveal reveal-up" data-reveal style={{ '--d': '180ms' } as React.CSSProperties}>
            For me, that person is you.
          </p>
          <p className="hero-description reveal reveal-up" data-reveal style={{ '--d': '260ms' } as React.CSSProperties}>
            So I made you a little corner of the universe.<br />
            A place where every detail says what my heart<br className="desktop-break" />{' '}
            has been trying to put into words.
          </p>
          <a
            className="letter-link reveal reveal-up"
            href="#letter"
            data-reveal
            style={{ '--d': '340ms' } as React.CSSProperties}
          >
            <span>A little letter for you</span>
            <ArrowUpRight size={19} />
          </a>
          <div className="hero-foot reveal reveal-up" data-reveal style={{ '--d': '420ms' } as React.CSSProperties}>
            <span>Especially you. Always you.</span>
            <a href="#little-things" aria-label="Discover more" className="scroll-cue">
              <ArrowDown size={18} />
            </a>
          </div>
        </div>

        <div className="portrait-stage reveal reveal-scale" data-reveal>
          <div className="portrait-aura" aria-hidden="true" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span aria-hidden="true" className="portrait-star star-one">
            ✦
          </span>
          <span aria-hidden="true" className="portrait-star star-two">
            ✧
          </span>

          <div
            className="portrait-card"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={spawnHearts}
          >
            <div className="portrait-image-wrapper">
              <Image
                src="/portrait.png"
                alt="A cinematic three-dimensional interpretation of you in your pink floral sari"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 480px"
                className="portrait-img"
              />
            </div>
            <span className="portrait-sheen" aria-hidden="true" />
            <div className="portrait-caption">
              <span>my favorite kind of magic</span>
              <Heart size={19} className="heart-icon-pulse" />
            </div>
          </div>

          <div className="floating-note" onClick={spawnHearts} role="button" tabIndex={0}>
            If beauty were a feeling,<br />
            <em>it would feel like you.</em>
          </div>
          <span className="image-index">01 / A LITTLE PIECE OF FOREVER</span>
        </div>
      </section>

      <section className="little-things" id="little-things">
        <p className="eyebrow eyebrow-center reveal reveal-up" data-reveal>
          <span /> IT’S THE LITTLE THINGS
        </p>
        <h2 className="reveal reveal-up" data-reveal style={{ '--d': '90ms' } as React.CSSProperties}>
          More than a beautiful face.<br />
          <em>A beautiful reason to smile.</em>
        </h2>
        <div className="feelings">
          {[
            {
              n: '01',
              h: 'The way you are.',
              p: 'You don’t have to do anything extraordinary to be special to me. Just being yourself is already more than enough.',
            },
            {
              n: '02',
              h: 'The thought of you.',
              p: 'Somewhere in the middle of an ordinary day, you cross my mind — and suddenly, that day feels a little less ordinary.',
            },
            {
              n: '03',
              h: 'The world with you in it.',
              p: 'I like knowing that, out of all the places and all the moments in the world, I get to be here, thinking of you.',
            },
          ].map((item, i) => (
            <article
              key={item.n}
              className="reveal reveal-up magnet"
              data-reveal
              style={{ '--d': `${i * 110}ms` } as React.CSSProperties}
              onPointerMove={handleMagnetMove}
              onPointerLeave={handleMagnetLeave}
            >
              <span className="number">{item.n}</span>
              <h3>{item.h}</h3>
              <p>{item.p}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="deck-section" id="deck" aria-labelledby="deck-title">
        <p className="eyebrow eyebrow-center reveal reveal-up" data-reveal>
          <span /> TWELVE THINGS I NEVER SAID OUT LOUD
        </p>
        <h2 id="deck-title" className="reveal reveal-up" data-reveal style={{ '--d': '90ms' } as React.CSSProperties}>
          Tap the card.<br />
          <em>One at a time.</em>
        </h2>
        <p className="deck-hint reveal reveal-up" data-reveal style={{ '--d': '170ms' } as React.CSSProperties}>
          {deckDone
            ? 'That’s all twelve. And still not everything.'
            : flipped
              ? 'Tap again for the next one.'
              : 'There’s something written on the other side.'}
        </p>

        <div className="deck-stage reveal reveal-scale" data-reveal style={{ '--d': '240ms' } as React.CSSProperties}>
          {deckDone ? (
            <div className="deck-finale">
              <Sparkles size={30} className="sparkle-icon" />
              <p className="deck-finale-line">
                Twelve reasons, and I could keep going.<br />
                <em>I just ran out of cards, not reasons.</em>
              </p>
              <button type="button" className="deck-reset" onClick={resetDeck}>
                <RotateCcw size={16} />
                <span>Read them again</span>
              </button>
            </div>
          ) : (
            <>
              <span className="deck-shadow deck-shadow-2" aria-hidden="true" />
              <span className="deck-shadow deck-shadow-1" aria-hidden="true" />

              <button
                type="button"
                className={`flash-card${flipped ? ' is-flipped' : ''}`}
                onClick={handleDeckTap}
                aria-label={
                  flipped
                    ? `${activePraise.label}. ${activePraise.text} Tap for the next card.`
                    : `Card ${cardIndex + 1} of ${PRAISES.length}. Tap to reveal.`
                }
              >
                <span className="flash-face flash-front">
                  <span className="flash-front-glyph">✦</span>
                  <span className="flash-front-label">tap me</span>
                  <span className="flash-front-sub">
                    {cardIndex + 1} / {PRAISES.length}
                  </span>
                  <span className="flash-shine" aria-hidden="true" />
                </span>

                <span className="flash-face flash-back">
                  <span className="flash-back-label">{activePraise.label}</span>
                  <span className="flash-back-text">{activePraise.text}</span>
                  <span className="flash-back-foot">
                    <Heart size={14} className="heart-icon-pulse" />
                    <span>
                      {cardIndex + 1} / {PRAISES.length}
                    </span>
                  </span>
                </span>
              </button>
            </>
          )}
        </div>

        <div className="deck-progress reveal reveal-up" data-reveal style={{ '--d': '320ms' } as React.CSSProperties}>
          {PRAISES.map((p, i) => (
            <span
              key={p.label}
              className={`deck-dot${i < revealedCount ? ' is-read' : ''}${
                i === cardIndex && !deckDone ? ' is-current' : ''
              }`}
            />
          ))}
        </div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-aside reveal reveal-up" data-reveal>
          <Sparkles size={24} className="sparkle-icon" />
          <p>
            A FEW WORDS,<br />
            FROM THE HEART.
          </p>
          <span>
            For you,<br />
            <em>with love.</em>
          </span>
        </div>
        <article className="letter reveal reveal-up" data-reveal style={{ '--d': '120ms' } as React.CSSProperties}>
          <span className="eyebrow">SOMETHING I WANTED YOU TO KNOW</span>
          <h2 ref={letterHeadingRef} className="letter-greeting">
            {typedGreeting || ' '}
            {!greetingDone && <span className="caret" aria-hidden="true" />}
          </h2>
          <p>
            I wanted to make something beautiful for you. Then I realized the most
            beautiful part was already there — you.
          </p>
          <p>
            There is a quiet kind of magic in the way you make me feel. The
            thought of you brings a softness to my day that I can’t quite explain,
            but never want to lose.
          </p>
          <p>
            If I could give you one thing, it would be a moment to see yourself
            through my eyes. You would understand why even the simplest picture of
            you can make me stop and smile.
          </p>
          <p>
            I hope life is gentle with you. I hope you have a hundred little
            reasons to laugh, people who listen, and room to become everything
            you dream of being. And I hope this little corner of the world
            reminds you that someone is very, very glad you exist.
          </p>
          <p className="letter-ending">
            You don’t need to be perfect.<br />
            <em>You being you is my favorite part.</em>
          </p>
          <button
            type="button"
            className="signature"
            onClick={spawnHearts}
            aria-label="Tap signature with love"
          >
            <span>With all my heart</span>
            <Heart size={20} className="heart-icon-pulse" />
          </button>
        </article>
      </section>

      <footer>
        <a href="#top">a little world, just for you.</a>
        <button
          type="button"
          className="footer-note-btn"
          onClick={spawnHearts}
          aria-label="Tap for love"
        >
          <span>Every word meant. Every detail, for you.</span>
          <Heart size={14} className="heart-icon-pulse" />
        </button>
      </footer>
    </main>
  );
}
