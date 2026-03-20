# CSS Adventure Game - Complete Guide

This guide explains every concept you need to understand the CSS game. No SVG, no Canvas—just HTML divs and CSS positioning.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [How the Code Works](#how-the-code-works)
3. [The World Data Structure](#the-world-data-structure)
4. [The Game Loop](#the-game-loop)
5. [Collision Detection](#collision-detection)
6. [The Camera System](#the-camera-system)
7. [Rendering](#rendering)
8. [How to Modify It](#how-to-modify-it)
9. [Troubleshooting](#troubleshooting)

---

## Core Concepts

### Concept 1: The Game Grid

Your game world is a **grid of cells**. Think of a checkerboard.

```
40 cells wide
|---------------------------------------|
24 cells tall ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┤
             ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
             ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
             ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
```

Each cell:
- Is identified by coordinates: (x, y)
- (0, 0) is top-left
- (39, 0) is top-right
- (0, 23) is bottom-left
- (39, 23) is bottom-right

### Concept 2: Each Cell is 32 Pixels

When we render, each grid cell becomes a 32×32 pixel div on screen.

```javascript
const UNIT_SIZE = 32;  // Each cell is 32 pixels
```

So cell (5, 3) on screen is at:
```
screenX = 5 * 32 = 160 pixels from left
screenY = 3 * 32 = 96 pixels from top
```

### Concept 3: The Camera

You can't see the entire 40×24 grid at once. The **camera** shows only a window of it.

```
Full world (40×24)    Camera view (20×12)
┌──────────────────┐  ┌────────────┐
│ ☒ CAMERA HERE    │  │  🧑        │ ← What player sees
│ ┌────────────┐   │  │  grass     │
│ │ 🧑        │   │  │  trees     │
│ │ grass     │   │  └────────────┘
│ │ trees     │   │
│ └────────────┘   │
└──────────────────┘
```

```javascript
const CAMERA_WIDTH = 20;   // Can see 20 cells wide
const CAMERA_HEIGHT = 12;  // Can see 12 cells tall
```

The camera follows the player and keeps them centered.

### Concept 4: Data vs. Display

**Two different things:**

**Data coordinates** (the game world):
- Player is at world position (15, 10)
- This never changes except when moving

**Screen coordinates** (what you see):
- Player appears at screen position (160, 96)
- This changes when the camera moves

The conversion is:
```javascript
screenX = (worldX - cameraX) * UNIT_SIZE
screenY = (worldY - cameraY) * UNIT_SIZE
```

---

## How the Code Works

### The Overall Flow

1. **Player presses a key** (Up, Down, Left, Right, or WASD)
2. **We calculate where they'd move** (x + 1, y + 0, etc.)
3. **We check if that cell is walkable** (collision detection)
4. **If yes:** Update player position
5. **If no:** Show "blocked" message
6. **Update camera** to follow player
7. **Render** the visible area

### React State

```javascript
const [playerPos, setPlayerPos] = useState({ x: 5, y: 5 });
const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
const [message, setMessage] = useState('Use arrow keys to move!');
const [isMoving, setIsMoving] = useState(false);
```

**playerPos**: Where the player actually is in the grid
**cameraPos**: What's the top-left cell of the camera view
**message**: UI text (like "Blocked!" or "Found treasure!")
**isMoving**: Are we currently animating a move? (true while moving, false when stopped)

---

## The World Data Structure

### Three 2D Arrays

The world is defined by **three 2D arrays**. Each is a 24×40 grid of numbers.

#### Array 1: Floor

```javascript
floor: Array(GRID_HEIGHT).fill(null).map((_, row) => 
  Array(GRID_WIDTH).fill(null).map((_, col) => {
    // Return 0, 1, or 2
  })
)
```

Values:
- **0 = Grass** (walkable, green)
- **1 = Water** (walkable, blue, visual only)
- **2 = Stone** (walkable, gray, visual only)

Floor is **visual only**. It doesn't block movement.

#### Array 2: Objects

```javascript
objects: Array(GRID_HEIGHT).fill(null).map((_, row) =>
  Array(GRID_WIDTH).fill(null).map((_, col) => {
    // Return 0, 1, 2, or 3
  })
)
```

Values:
- **0 = Empty** (walkable)
- **1 = Tree** (blocks movement)
- **2 = House** (blocks movement)
- **3 = Rock** (blocks movement)

Objects **block movement**. If `objects[y][x] !== 0`, you can't go there.

#### Array 3: Interactive

```javascript
interactive: Array(GRID_HEIGHT).fill(null).map((_, row) =>
  Array(GRID_WIDTH).fill(null).map((_, col) => {
    // Return 0, 1, or 2
  })
)
```

Values:
- **0 = Nothing** (empty)
- **1 = Chest** (treasure, interactive)
- **2 = NPC** (person, interactive)

When you walk on these, something happens (message appears).

### Reading the Arrays

```javascript
// Get what's at position (5, 3)
const floorType = WORLD_DATA.floor[3][5];      // 0, 1, or 2
const objectType = WORLD_DATA.objects[3][5];   // 0, 1, 2, or 3
const interactiveType = WORLD_DATA.interactive[3][5];  // 0, 1, or 2

// Note: it's [row][column] = [y][x], not [x][y]!
```

### Creating Regions

**A water region:**
```javascript
if ((row >= 6 && row <= 8 && col >= 8 && col <= 12)) return 1;
```

This creates a 5×5 rectangle of water at rows 6-8, columns 8-12.

**A single tree:**
```javascript
if ((row === 5 && col === 6)) return 1;
```

This places one tree at position (6, 5).

**Multiple individual items:**
```javascript
if ((row === 2 && col === 3) || (row === 5 && col === 6) || (row === 10 && col === 4)) return 1;
```

This places trees at three locations.

---

## The Game Loop

### The Move Sequence

When you press a key:

```
1. handleMove(dx, dy) is called
   ↓
2. Check: isMoving? If yes, buffer input and return
   ↓
3. Calculate: newX = playerPos.x + dx
             newY = playerPos.y + dy
   ↓
4. Check: canMoveTo(newX, newY)?
   ├─ If NO: Show "blocked" message, return
   ├─ If YES: Continue ↓
   ↓
5. Update state:
   - setPlayerPos({ x: newX, y: newY })
   - setIsMoving(true)
   ↓
6. Start 150ms animation timer
   ↓
7. Check what's interactive at (newX, newY)
   - 1 = chest → show "found treasure"
   - 2 = npc → show "met someone"
   - 0 = nothing → show nothing
   ↓
8. After 150ms: setIsMoving(false)
   ↓
9. Check: Is there buffered input?
   ├─ If YES: handleMove() again with buffered input
   └─ If NO: Wait for next key press
```

### Input Buffering

If you press keys rapidly while moving:

```
Frame 1: Press Up
  isMoving = false → handleMove(0, -1)
  isMoving = true (animation starts)

Frame 2: Press Down (while animating)
  isMoving = true → store in inputBuffer
  return (don't move yet)

Frame 3: Press Right (while animating)
  isMoving = true → overwrite inputBuffer
  return (new input replaces old)

Frame N: Animation finishes
  setIsMoving(false)
  inputBuffer is not null
  → handleMove with buffered input
```

**Result:** Feels responsive. Rapid key presses don't get lost.

---

## Collision Detection

### The canMoveTo Function

```javascript
const canMoveTo = (x, y) => {
  // Check 1: Out of bounds?
  if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
  
  // Check 2: Is there a solid object there?
  if (WORLD_DATA.objects[y]?.[x] !== 0) return false;
  
  // Made it through all checks
  return true;
};
```

**This is the proposal system from your guide:**
1. Test before committing
2. Return true/false
3. Only update state if true

### The ?. Operator

```javascript
WORLD_DATA.objects[y]?.[x]
```

This means: "Get [x] from [y], but if [y] is undefined, return undefined instead of crashing."

Without the `?.`, accessing an undefined array would crash the game.

### How Collision Works

```
Player at (5, 5) wants to move right to (6, 5)

Check: WORLD_DATA.objects[5][6]
  ├─ If value is 0 → Empty → Move allowed
  ├─ If value is 1 → Tree → Move blocked
  ├─ If value is 2 → House → Move blocked
  └─ If value is 3 → Rock → Move blocked
```

You can only walk on cells where `objects[y][x] === 0`.

---

## The Camera System

### Following the Player

```javascript
useEffect(() => {
  const cameraCenterX = CAMERA_WIDTH / 2;   // 10 cells
  const cameraCenterY = CAMERA_HEIGHT / 2;  // 6 cells
  
  let newCamX = playerPos.x - cameraCenterX;
  let newCamY = playerPos.y - cameraCenterY;
  
  // ... clamp ...
  setCameraPos({ x: newCamX, y: newCamY });
}, [playerPos]);
```

This runs whenever `playerPos` changes.

**The math:**
- If player is at (15, 10)
- Camera center should be at (15, 10)
- Camera top-left should be at (15 - 10, 10 - 6) = (5, 4)
- Camera shows cells (5, 4) to (24, 15)

### Clamping to Bounds

```javascript
newCamX = Math.max(0, Math.min(newCamX, GRID_WIDTH - CAMERA_WIDTH));
newCamY = Math.max(0, Math.min(newCamY, GRID_HEIGHT - CAMERA_HEIGHT));
```

**What this does:**
```
Math.min(newCamX, GRID_WIDTH - CAMERA_WIDTH)
├─ If newCamX is too big: use GRID_WIDTH - CAMERA_WIDTH
├─ If newCamX is okay: use newCamX
│
Math.max(0, result)
├─ If result is negative: use 0
└─ If result is positive: use result
```

**Examples:**
```javascript
// World is 40 wide, camera is 20 wide
// Valid camera X values: 0 to 20

playerPos.x = 5   → cameraX = 0   (clamped, player at left)
playerPos.x = 15  → cameraX = 5   (normal)
playerPos.x = 35  → cameraX = 20  (clamped, player at right)
```

---

## Rendering

### The Render Process

```javascript
const tiles = [];

// 1. Add floor tiles
for (let y = renderStartY; y < renderEndY; y++) {
  for (let x = renderStartX; x < renderEndX; x++) {
    // Create a div for this floor tile
    tiles.push(<div ... />);
  }
}

// 2. Add object tiles (trees, houses, rocks)
for (let y = renderStartY; y < renderEndY; y++) {
  for (let x = renderStartX; x < renderEndX; x++) {
    // Create a div for this object (if not empty)
    tiles.push(<div ... />);
  }
}

// 3. Add interactive tiles (chests, NPCs)
for (let y = renderStartY; y < renderEndY; y++) {
  for (let x = renderStartX; x < renderEndX; x++) {
    // Create a div for this interactive (if not empty)
    tiles.push(<div ... />);
  }
}

// 4. Add player
tiles.push(<div key="player" ... />);

// 5. Return all divs in a container
return <div> {tiles} </div>;
```

### Only Rendering Visible Tiles

```javascript
const renderStartX = Math.max(0, Math.floor(cameraPos.x));
const renderEndX = Math.min(GRID_WIDTH, Math.ceil(cameraPos.x + CAMERA_WIDTH));
const renderStartY = Math.max(0, Math.floor(cameraPos.y));
const renderEndY = Math.min(GRID_HEIGHT, Math.ceil(cameraPos.y + CAMERA_HEIGHT));
```

If camera is at (5, 4) showing a 20×12 area:
- renderStartX = 5
- renderEndX = 25
- renderStartY = 4
- renderEndY = 16

We only create divs for cells (5-24, 4-15).

**Why?** If we created divs for all 960 cells, it would lag. By only creating visible ones, it stays fast.

### Screen Position Calculation

```javascript
const screenX = (x - cameraPos.x) * UNIT_SIZE;
const screenY = (y - cameraPos.y) * UNIT_SIZE;
```

**Example:**
```javascript
// World cell (15, 10)
// Camera at (5, 4)
// UNIT_SIZE = 32

screenX = (15 - 5) * 32 = 10 * 32 = 320 pixels
screenY = (10 - 4) * 32 = 6 * 32 = 192 pixels
```

The div appears at 320 pixels from left, 192 pixels from top.

### The Div Styling

```javascript
<div style={{
  position: 'absolute',        // Position anywhere in parent
  left: screenX,               // X position in pixels
  top: screenY,                // Y position in pixels
  width: UNIT_SIZE,            // 32 pixels
  height: UNIT_SIZE,           // 32 pixels
  backgroundColor: bgColor,    // The color
  border: '1px solid #333',    // Grid lines
  boxSizing: 'border-box',     // Don't add border to size
  ...otherStyles
}} />
```

`position: 'absolute'` means the div positions itself relative to the parent container (the game viewport).

`left` and `top` are in pixels. The browser places the div at that exact pixel position.

### Z-Ordering (Layering)

Floor divs are created first, so they're behind.
Object divs are created next, so they're in front of floor.
Interactive divs are created next.
Player div is created last with `zIndex: 100`, so it's always on top.

```javascript
// Created first → behind
<div key={`floor-${x}-${y}`} ... />

// Created second → in front of floor
<div key={`tree-${x}-${y}`} ... />

// Created third
<div key={`chest-${x}-${y}`} ... />

// Created last → in front of everything
<div key="player" style={{ ..., zIndex: 100 }} ... />
```

---

## How to Modify It

### Change the World Size

```javascript
const GRID_WIDTH = 60;   // Make it wider
const GRID_HEIGHT = 40;  // Make it taller
const CAMERA_WIDTH = 25; // See more at once
const CAMERA_HEIGHT = 15;
```

The world data arrays automatically adjust.

### Add More Trees

Find the objects array generation:

```javascript
if ((row === 2 && col === 3) || (row === 5 && col === 6) || ...) return 1;
```

Add more conditions:

```javascript
if ((row === 2 && col === 3) || 
    (row === 5 && col === 6) || 
    (row === 9 && col === 11) ||    // NEW TREE
    (row === 15 && col === 20)) {   // NEW TREE
  return 1;
}
```

### Add a Water Region

```javascript
// Somewhere in the floor generation
if ((row >= 10 && row <= 12 && col >= 15 && col <= 18)) return 1; // water
```

### Add an NPC

```javascript
// In the interactive generation
if ((row === 7 && col === 12)) return 2;  // NPC at (12, 7)
```

Then in the render section for interactive tiles, add the emoji:

```javascript
else if (intType === 2) {
  // NPC
  tiles.push(
    <div key={`npc-${x}-${y}`} ...>
      🧙
    </div>
  );
}
```

### Change Emojis

Just find the emoji and replace it:

```javascript
// Tree
🌲

// House
🏠

// Rock
🪨

// Chest
📦

// NPC
🧙

// Player
🧑
```

Replace with any emoji you want. Game continues working.

### Change Colors

```javascript
const bgColor = floorType === 0 ? '#4a7c59' : '#2a5a7f';
```

Change the hex codes:
- `#4a7c59` is grass green
- `#2a5a7f` is water blue

Find a color: [color-picker.com](https://htmlcolorcodes.com/)

### Change Movement Speed

```javascript
setTimeout(() => {
  setIsMoving(false);
}, 150);  // 150 milliseconds
```

Make it smaller for faster, larger for slower.

Also update the CSS transition:

```javascript
<div style={{
  transition: isMoving ? 'none' : 'left 0.15s, top 0.15s',
  // Change 0.15s to match the duration above
}}>
```

---

## Troubleshooting

### "I press a key but nothing happens"

Check:
1. Is the target cell empty in the `objects` array?
2. Is it within world bounds? (0-39 X, 0-23 Y)
3. Check browser console for errors (F12)

### "The player is stuck in the corner"

The camera clamping might be wrong. Check:
```javascript
Math.max(0, Math.min(newCamX, GRID_WIDTH - CAMERA_WIDTH))
```

Make sure `GRID_WIDTH - CAMERA_WIDTH` is correct.

### "Objects and player overlap weirdly"

Check the z-ordering. Player should be created last and have `zIndex: 100`.

### "Rendering is slow"

Check:
1. Are you rendering more than 300 tiles? (Try reducing world size)
2. Is your renderStart/renderEnd calculation wrong? (Might be rendering off-screen)

### "The emoji doesn't look right"

Emojis render at different sizes depending on font. Use these sizes:
- `fontSize: '24px'` for 32px tiles (usually looks good)
- Adjust if needed

---

## Complete Code Reference

### State Management

```javascript
const [playerPos, setPlayerPos] = useState({ x: 5, y: 5 });
const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
const [message, setMessage] = useState('Use arrow keys to move!');
const [isMoving, setIsMoving] = useState(false);
```

### Constants

```javascript
const UNIT_SIZE = 32;          // Pixels per tile
const GRID_WIDTH = 40;         // World width in tiles
const GRID_HEIGHT = 24;        // World height in tiles
const CAMERA_WIDTH = 20;       // Viewport width in tiles
const CAMERA_HEIGHT = 12;      // Viewport height in tiles
```

### Key Functions

```javascript
canMoveTo(x, y)          // Returns true if walkable
getInteractiveAt(x, y)   // Returns 0, 1, or 2
handleMove(dx, dy)       // Called on key press
```

### Key Effects

```javascript
useEffect(() => { ... }, [playerPos])  // Update camera when player moves
useEffect(() => { ... }, [isMoving, playerPos])  // Handle keyboard
```

---

## Performance Notes

With CSS divs:
- **Up to 300 tiles visible:** Very smooth (60fps)
- **300-500 tiles:** Still smooth
- **500-1000 tiles:** Starts to lag
- **1000+ tiles:** Noticeable lag

The game creates about 20×12 = 240 divs at a time (camera view), so you're well within the performant range.

If you ever want to optimize further:
- Use Canvas (much faster)
- Use a game library like Phaser

But for an MVP, CSS is perfectly fine.

---

## Next Steps

You now have:
- A working game in pure CSS
- Complete collision detection
- Smooth camera following
- Input buffering for responsiveness
- An understanding of every line of code

**What to build next:**
1. Add NPC dialogue
2. Add inventory system
3. Add quests
4. Add story/narrative

The rendering won't change. You'll just add more game logic on top.

Good luck! 🚀
