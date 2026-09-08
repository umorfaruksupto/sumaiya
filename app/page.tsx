'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Heart, Sparkles } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export default function Home() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  const spawnHearts = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newHearts: FloatingHeart[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: clientX + (Math.random() - 0.5) * 60,
      y: clientY + (Math.random() - 0.5) * 30,
      size: 16 + Math.random() * 14,
      rotation: (Math.random() - 0.5) * 40,
    }));

    setHearts((prev) => [...prev.slice(-15), ...newHearts]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1400);
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

  return (
    <main id="top">
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
          💖
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
          <p className="eyebrow">
            <span /> ONE PERSON. A THOUSAND LITTLE FEELINGS.
          </p>
          <h1 id="hero-title">
            Some people<br />
            make the world<br />
            <em>more beautiful.</em>
          </h1>
          <p className="intro">For me, that person is you.</p>
          <p className="hero-description">
            So I made you a little corner of the universe.<br />
            A place where every detail says what my heart<br className="desktop-break" />{' '}
            has been trying to put into words.
          </p>
          <a className="letter-link" href="#letter">
            <span>A little letter for you</span>
            <ArrowUpRight size={19} />
          </a>
          <div className="hero-foot">
            <span>Especially you. Always you.</span>
            <a href="#little-things" aria-label="Discover more">
              <ArrowDown size={18} />
            </a>
          </div>
        </div>

        <div className="portrait-stage">
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
        <p className="eyebrow">IT’S THE LITTLE THINGS</p>
        <h2>
          More than a beautiful face.<br />
          <em>A beautiful reason to smile.</em>
        </h2>
        <div className="feelings">
          <article>
            <span className="number">01</span>
            <h3>The way you are.</h3>
            <p>
              You don’t have to do anything extraordinary to be special to me.
              Just being yourself is already more than enough.
            </p>
          </article>
          <article>
            <span className="number">02</span>
            <h3>The thought of you.</h3>
            <p>
              Somewhere in the middle of an ordinary day, you cross my mind — and
              suddenly, that day feels a little less ordinary.
            </p>
          </article>
          <article>
            <span className="number">03</span>
            <h3>The world with you in it.</h3>
            <p>
              I like knowing that, out of all the places and all the moments in
              the world, I get to be here, thinking of you.
            </p>
          </article>
        </div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-aside">
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
        <article className="letter">
          <span className="eyebrow">SOMETHING I WANTED YOU TO KNOW</span>
          <h2>Dear you,</h2>
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
