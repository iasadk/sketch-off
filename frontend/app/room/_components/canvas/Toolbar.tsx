"use client";

import React, { useState } from "react";
import {
  Pencil,
  PaintBucket,
  Undo2,
  Trash2,
  Eraser,
} from "lucide-react";
import { COLORS, STROKE_WIDTHS } from "@/lib/constants";
import { Color, StrokeWidth, Tool } from "@/lib/types";


type Props = {
  onToolChange?: (tool: Tool) => void;
  onColorChange?: (color: Color) => void;
  onStrokeWidthChange?: (width: StrokeWidth) => void;
  onUndo?: () => void;
  onClear?: () => void;
};

const Toolbar = ({
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onClear,
}: Props) => {
  const [activeTool, setActiveTool] = useState<Tool>("brush");
  const [activeColor, setActiveColor] = useState<Color>("#000000");
  const [activeStrokeWidth, setActiveStrokeWidth] =
    useState<StrokeWidth>(5);

  const selectTool = (tool: Tool) => {
    setActiveTool(tool);
    onToolChange?.(tool);
  };

  const selectColor = (color: Color) => {
    setActiveColor(color);
    onColorChange?.(color);
  };

  const selectStrokeWidth = (width: StrokeWidth) => {
    setActiveStrokeWidth(width);
    onStrokeWidthChange?.(width);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border-2 border-gray-300 bg-white p-1 shadow-lg">
      {/* Brush */}
      <button
        type="button"
        onClick={() => selectTool("brush")}
        title="Brush"
        className={`flex h-12 w-12 items-center justify-center rounded-md transition ${
          activeTool === "brush"
            ? "bg-purple-500 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Pencil size={24} />
      </button>

      {/* Fill */}
      <button
        type="button"
        onClick={() => selectTool("fill")}
        title="Fill"
        className={`flex h-12 w-12 items-center justify-center rounded-md transition ${
          activeTool === "fill"
            ? "bg-purple-500 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <PaintBucket size={24} />
      </button>

      {/* Eraser */}
      <button
        type="button"
        onClick={() => selectTool("eraser")}
        title="Eraser"
        className={`flex h-12 w-12 items-center justify-center rounded-md transition ${
          activeTool === "eraser"
            ? "bg-purple-500 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Eraser size={24}/>
      </button>

      <div className="mx-1 h-8 w-px bg-gray-300" />

      {/* Colors */}
      <div className="flex items-center gap-1 px-1">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => selectColor(color)}
            className={`h-5 w-5 rounded-full border-2 transition hover:scale-110 ${
              activeColor === color
                ? "border-purple-500 ring-2 ring-purple-200"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="mx-1 h-8 w-px bg-gray-300" />

      {/* Stroke Width */}
      <div className="flex items-center gap-1 px-1">
        {STROKE_WIDTHS.map((width) => (
          <button
            key={width}
            type="button"
            title={`${width}px`}
            onClick={() => selectStrokeWidth(width)}
            className={`flex h-10 w-10 items-center justify-center rounded-md transition ${
              activeStrokeWidth === width
                ? "bg-purple-100 ring-2 ring-purple-500"
                : "hover:bg-gray-100"
            }`}
          >
            <span
              className="rounded-full bg-gray-800"
              style={{
                width: `${width}px`,
                height: `${width}px`,
              }}
            />
          </button>
        ))}
      </div>

      <div className="mx-1 h-8 w-px bg-gray-300" />

      {/* Undo */}
      <button
        type="button"
        onClick={onUndo}
        title="Undo"
        className="flex h-12 w-12 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100"
      >
        <Undo2 size={24} />
      </button>

      {/* Clear */}
      <button
        type="button"
        onClick={onClear}
        title="Clear canvas"
        className="flex h-12 w-12 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
      >
        <Trash2 size={24} />
      </button>
    </div>
  );
};

export default Toolbar;