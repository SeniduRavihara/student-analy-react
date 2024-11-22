import React, { useEffect } from "react";
import "./Background.css";

const MIN_SPEED = 1.5;
const MAX_SPEED = 2.5;

function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class Blob {
  el: HTMLElement;
  size: number;
  initialX: number;
  initialY: number;
  vx: number;
  vy: number;
  x: number;
  y: number;

  constructor(el: HTMLElement) {
    this.el = el;
    const boundingRect = this.el.getBoundingClientRect();
    this.size = boundingRect.width;
    this.initialX = randomNumber(0, window.innerWidth - this.size);
    this.initialY = randomNumber(0, window.innerHeight - this.size);
    this.el.style.top = `${this.initialY}px`;
    this.el.style.left = `${this.initialX}px`;
    this.vx =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
    this.vy =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
    this.x = this.initialX;
    this.y = this.initialY;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size;
      this.vx *= -1;
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size;
      this.vy *= -1;
    }
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy *= -1;
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${
      this.y - this.initialY
    }px)`;
  }
}

const Background: React.FC = () => {
  function initBlobs() {
    const blobEls = document.querySelectorAll<HTMLElement>(".bouncing-blob");
    const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl)); // Assert as HTMLElement

    let animationFrameId: number;

    function update() {
      animationFrameId = requestAnimationFrame(update);
      blobs.forEach((blob) => {
        blob.update();
        blob.move();
      });
    }

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId); // Cleanup on unmount
    };
  }

  useEffect(() => {
    const cleanup = initBlobs();
    return cleanup; // Cleanup on unmount
  }, []);

  return (
    <div className="bouncing-blobs-container w-screen h-screen z-50">
      <div className="bouncing-blobs-glass"></div>
      <div className="bouncing-blobs">
        {/* Uncomment to add more blobs */}
        <div className="bouncing-blob bouncing-blob--purple"></div>
        <div className="bouncing-blob bouncing-blob--pink"></div>
      </div>
    </div>
  );
};

export default Background;
