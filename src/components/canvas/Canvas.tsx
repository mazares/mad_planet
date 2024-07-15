import "./Canvas.css";
import { useRef, useEffect } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.devicePixelRatio > 1) {
      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;
      if (ctx) {
        ctx.scale(2, 2);
      }
    } else {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }

    let width = canvas.clientWidth; // Width of the canvas
    let height = canvas.clientHeight; // Height of the canvas
    let rotation = 0; // Rotation of the globe
    let dots: Dot[] = []; // Every dots in an array

    const DOTS_AMOUNT = 1000; // Amount of dots on the screen
    const DOT_RADIUS = 4; // Radius of the dots
    let GLOBE_RADIUS = width * 0.7; // Radius of the globe
    let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
    let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
    let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
    let FIELD_OF_VIEW = width * 0.8;

    interface Dot {
      x: number;
      y: number;
      z: number;
      xProject: number;
      yProject: number;
      sizeProjection: number;
      project: (sin: number, cos: number) => void;
      draw: (sin: number, cos: number) => void;
    }

    function createDots() {
      dots.length = 0;
      for (let i = 0; i < DOTS_AMOUNT; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = GLOBE_RADIUS * Math.cos(phi) + GLOBE_CENTER_Z;
        dots.push({
          x,
          y,
          z,
          xProject: 0,
          yProject: 0,
          sizeProjection: 0,
          project(sin: number, cos: number) {
            const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
            const rotZ =
              -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
            this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
            this.xProject = rotX * this.sizeProjection + PROJECTION_CENTER_X;
            this.yProject = this.y * this.sizeProjection + PROJECTION_CENTER_Y;
          },
          draw(sin: number, cos: number) {
            this.project(sin, cos);
            if (ctx) {
              ctx.beginPath();
              ctx.fillStyle = `hsl(${
                ((this.yProject / height) * 360) / this.sizeProjection +
                rotation * 10
              }, 100%, 50%)`;
              ctx.arc(
                this.xProject,
                this.yProject,
                DOT_RADIUS * this.sizeProjection,
                0,
                Math.PI * 2
              );
              ctx.closePath();
              ctx.fill();
            }
          },
        });
      }
    }

    function render(a: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      rotation = a * 0.0004;
      const sineRotation = Math.sin(rotation);
      const cosineRotation = Math.cos(rotation);
      for (var i = 0; i < dots.length; i++) {
        dots[i].draw(sineRotation, cosineRotation);
      }
      window.requestAnimationFrame(render);
    }

    function afterResize() {
      if (!canvasRef.current) return;

      width = canvasRef.current.offsetWidth;
      height = canvasRef.current.offsetHeight;
      if (window.devicePixelRatio > 1) {
        canvasRef.current.width = canvasRef.current.clientWidth * 2;
        canvasRef.current.height = canvasRef.current.clientHeight * 2;

        if (ctx) {
          return ctx.scale(2, 2);
        }

        width *= 2;
        height *= 2;

        GLOBE_RADIUS = width * 0.7;
        GLOBE_CENTER_Z = -GLOBE_RADIUS;
        PROJECTION_CENTER_X = width / 2;
        PROJECTION_CENTER_Y = height / 2;
        FIELD_OF_VIEW = width * 0.8;
        createDots();

        return;
      } else {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      GLOBE_RADIUS = width * 0.7;
      GLOBE_CENTER_Z = -GLOBE_RADIUS;
      PROJECTION_CENTER_X = width / 2;
      PROJECTION_CENTER_Y = height / 2;
      FIELD_OF_VIEW = width * 0.8;
      createDots();
    }

    let resizeTimeout: number;

    function onResize() {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(afterResize, 500);
    }
    window.addEventListener("resize", onResize);

    createDots();
    window.requestAnimationFrame(render);
  }, []);

  return <canvas style={{}} ref={canvasRef} className="canvas" />;
}
