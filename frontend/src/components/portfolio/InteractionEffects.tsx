import { useEffect, useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function InteractionEffects() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      setRipples((current) => [
        ...current,
        {
          id: Date.now() + Math.random(),
          x: event.clientX,
          y: event.clientY,
        },
      ]);
    };

    window.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, []);

  const removeRipple = (id: number) => {
    setRipples((current) =>
      current.filter((ripple) => ripple.id !== id),
    );
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-500 animate-[clickRipple_700ms_ease-out_forwards]"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          onAnimationEnd={() =>
            removeRipple(ripple.id)
          }
        />
      ))}
    </div>
  );
}