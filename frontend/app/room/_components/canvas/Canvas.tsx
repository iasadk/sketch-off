'use client'
import React, { useEffect, useRef } from 'react'
import Toolbar from './Toolbar'
import { Color, Stroke, StrokeWidth, Tool } from '@/lib/types'
import { useSocket } from '@/provider/websocket'
import { cn, getSessionStorage } from '@/lib/util'
import { useGameStore } from '@/store/room'
import { useShallow } from 'zustand/shallow'

type Props = {}

const Canvas = (props: Props) => {
  const { artistId } = useGameStore(useShallow((state) => ({ artistId: state.artistId })))
  const player_unique_uuid = getSessionStorage("UUID")
  const { sendMessage, subscribe } = useSocket()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef<Color>("#000000")
  const strokeWidthRef = useRef<StrokeWidth>(5)
  const isDrawing = useRef<boolean>(false);
  const toolRef = useRef<Tool>("brush");
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastBrushCoordinates = useRef<{ x: number, y: number }>({
    x: 0,
    y: 0
  });
  const isNotArtist = !player_unique_uuid || player_unique_uuid !== artistId
  const setupContext = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = strokeWidthRef.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (toolRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = colorRef.current;
    }
  };

  const setCavasResolution = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const stroke: Stroke = {
      tool: toolRef.current,
      color: colorRef.current,
      width: strokeWidthRef.current,
      points: []
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Canvas not initialized")
      return
    }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      alert("Canvas Not Initialized");
      return;
    }
    const x = event.clientX - rect?.left;
    const y = event.clientY - rect?.top;

    drawDot(x, y, canvasRef.current!);
    const normalizedPoint = normalizePoint(x, y, canvas);

    stroke.points.push(normalizedPoint);
    currentStrokeRef.current = stroke;
    lastBrushCoordinates.current = { x, y };
  }
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Canvas not initialized")
      return
    }
    const prevX = lastBrushCoordinates.current.x;
    const prevY = lastBrushCoordinates.current.y;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      alert("Canvas Not Initialized");
      return;
    }

    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    drawPath(prevX, prevY, currentX, currentY, canvasRef.current!);

    const normalizedPoint = normalizePoint(currentX, currentY, canvas);

    currentStrokeRef.current?.points.push(normalizedPoint);
    lastBrushCoordinates.current = {
      x: currentX,
      y: currentY,
    };
  }
  const handlePointerUp = () => {
    isDrawing.current = false;
    if (currentStrokeRef.current) strokesRef.current.push(currentStrokeRef.current);
    currentStrokeRef.current = null;

    sendMessage({ type: "DRAW", content: { stokes: strokesRef.current } })
    // console.log(strokesRef.current)
  }

  const drawPath = (prevX: number, prevY: number, currentX: number, currentY: number, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setupContext(ctx);
    ctx.beginPath();
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

  }

  const drawDot = (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setupContext(ctx);
    const strokeWidth = strokeWidthRef.current;
    ctx.beginPath();
    ctx.arc(x, y, strokeWidth / 2, 0, Math.PI * 2);
    if (toolRef.current !== "eraser") {
      ctx.fillStyle = colorRef.current;
    }
    ctx.fill();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // strokesRef.current = [];
    // currentStrokeRef.current = null
    // setTimeout(() => {
    //   redrawCanvas();
    // }, 1000);
  };

  const handleToolChange = (tool: Tool) => {
    toolRef.current = tool;
  }

  const redrawCanvas = (strokes: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
      if (stroke.points.length === 0) continue;

      ctx.globalCompositeOperation = stroke.tool === 'brush' ? 'source-over' : 'destination-out';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const firstPoint = stroke.points[0];
      const { x, y } = denormalizePoint(firstPoint, canvas)
      if (stroke.points.length === 1) {
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          stroke.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = stroke.color;
        ctx.fill();
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        const { x, y } = denormalizePoint(point, canvas)

        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  const normalizePoint = (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ) => {
    return {
      x: x / canvas.clientWidth,
      y: y / canvas.clientHeight,
    };
  };

  const denormalizePoint = (
    point: { x: number; y: number },
    canvas: HTMLCanvasElement
  ) => {
    return {
      x: point.x * canvas.clientWidth,
      y: point.y * canvas.clientHeight,
    };
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setCavasResolution(canvas);
  }, [])

  useEffect(() => {
    const unsubscribe = subscribe("DRAW", (data) => {
      console.log(`Receiving ${data.type} event with following data:  ${JSON.stringify(data.content)}`)
      redrawCanvas(data.content.stokes)
    })

    return unsubscribe
  }, [subscribe])


  return (
    <div className={cn('flex flex-col gap-y-2', {
      "cursor-not-allowed pointer-events-none": isNotArtist
    })}>
      <div className='bg-white w-full h-150  text-center font-semibold rounded-sm'>
        <canvas
          ref={canvasRef}
          className='bg-white-500 w-full h-full'
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
      <div className={cn({
        "opacity-80": isNotArtist
      })}>
        <Toolbar
          onColorChange={(color: Color) => colorRef.current = color}
          onStrokeWidthChange={(width) => strokeWidthRef.current = width}
          onClear={handleClear}
          onToolChange={(tool) => handleToolChange(tool)}
        />
      </div>
    </div>
  )
}

export default Canvas