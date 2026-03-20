# Grid based RPG Dev Guide:

## 1. Overworld

First of all, we use a 2d array to render our game world. Simplified:

    const MAP_DATA = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1], // 2 might represent a Tree
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    ];

    // Legend: 0 = Grass, 1 = Wall/Water, 2 = Tree

Then, we map through this data to produce a visual grid using CSS:

    const Map = () => {
    return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${MAP_WIDTH}, 32px)`,
      gridTemplateRows: `repeat(${MAP_HEIGHT}, 32px)`,
    }}>
      {MAP_DATA.flat().map((tileType, i) => (
        <div key={i} className={`tile tile-${tileType}`} />
      ))}
    </div>
    );
    };

- We do not use inline styles in our project, we use classes.

The world will be built with layers like so:

- Layer 1 (bottom): The Ground (grass,dirt...)
- Layer 2 (middle): The Objects (Trees/rocks...)
- Layer 3 (top): The player

simple implementation:

    return (
    <div className="world-container" style={{ position: 'relative', width: '640px', height: '640px' }}>

      {/* Layer 1: Always at the bottom */}
      <div className="layer ground-layer" style={{ position: 'absolute', zIndex: 1 }}>
         {/* Map through GROUND_ARRAY and render 32px tiles */}
      </div>

      {/* Layer 2: Sits on top of grass */}
      <div className="layer object-layer" style={{ position: 'absolute', zIndex: 2 }}>
         {/* Map through OBJECT_ARRAY. If a cell is 0, render nothing (transparent) */}
      </div>

      {/* Layer 3: The Player */}
      <div className="player" style={{ position: 'absolute', zIndex: 3, left: x * 32, top: y * 32 }}>
         {/* Player Sprite */}
      </div>

    </div>
    );
    };
