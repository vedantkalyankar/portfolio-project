import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  changeTimer: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }
    const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

    let animationFrame: number;
    let particles: Particle[] = [];

    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.35 + 0.2,
      changeTimer: Math.random() * 200,
    });

    const createParticles = () => {
      const count = Math.min(
        70,
        Math.max(
          35,
          Math.floor(
            (window.innerWidth * window.innerHeight) / 14000,
          ),
        ),
      );

      particles = Array.from(
        { length: count },
        createParticle,
      );
    };

    const resize = () => {
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      );

      createParticles();
    };

    const animate = () => {
      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight,
      );

      for (const particle of particles) {
        particle.changeTimer -= 1;

        if (particle.changeTimer <= 0) {
          particle.speedX +=
            (Math.random() - 0.5) * 0.04;

          particle.speedY +=
            (Math.random() - 0.5) * 0.04;

          const maxSpeed = 0.5;

          particle.speedX = Math.max(
            -maxSpeed,
            Math.min(maxSpeed, particle.speedX),
          );

          particle.speedY = Math.max(
            -maxSpeed,
            Math.min(maxSpeed, particle.speedY),
          );

          particle.changeTimer =
            80 + Math.random() * 180;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < -10) {
          particle.x = window.innerWidth + 10;
        }

        if (particle.x > window.innerWidth + 10) {
          particle.x = -10;
        }

        if (particle.y < -10) {
          particle.y = window.innerHeight + 10;
        }

        if (particle.y > window.innerHeight + 10) {
          particle.y = -10;
        }

        context.beginPath();

        context.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2,
        );

        context.fillStyle = `rgba(156, 163, 175, ${particle.opacity})`;

        context.fill();
      }

      animationFrame = requestAnimationFrame(animate);
    };

   resize();

if (!reducedMotion) {
  animate();
}

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}