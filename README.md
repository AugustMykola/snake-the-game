# Snake Pixi

A Snake game built with [PixiJS v8](https://pixijs.com/), bundled with [Vite](https://vite.dev/).

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── main.js                          # Entry point — wires everything together
├── shared/constants/constants.js   # Grid size, cell size, canvas dimensions
│
├── core/                           # Pure game logic — no rendering
│   ├── classes/
│   │   ├── Food.js                 # Food entity (x, y) with occupies(x, y)
│   │   ├── Scene.js                # Abstract PixiJS Container-based scene
│   │   ├── Sequence.js             # Generic async step-runner (continuation-passing)
│   │   └── Snake.js                # Snake body, movement, growth
│   ├── engine/
│   │   └── GameEngine.js           # Board state + game-loop tick
│   ├── mechanics/
│   │   ├── ClassicMechanic.js      # Die on walls and self
│   │   ├── GodMechanic.js          # Pass through walls and self
│   │   ├── WallsMechanic.js        # Food spawns a wall cell
│   │   ├── PortalMechanic.js       # Two foods — eat to teleport
│   │   └── SpeedMechanic.js        # +10% speed per food eaten
│   ├── scenes/
│   │   ├── SceneManager.js         # Manages scene transitions with fade
│   │   └── SceneSequence.js        # Drives scene flow — composes Sequence
│   └── services/
│       ├── BestScoreStore.js       # Persists best score in localStorage
│       ├── InputController.js      # Keyboard → snake direction
│       ├── StateMachine.js         # Generic single-active-state machine
│       └── TickLoop.js             # PixiJS Ticker-based game tick loop
│
├── components/                     # PixiJS visual components
│   ├── renderer/
│   │   └── Renderer.js             # Draws grid, walls, food, snake
│   ├── scenes/
│   │   ├── GameScene.js            # In-game scene (renderer + HUD)
│   │   ├── MenuScene.js            # Main menu with mode selector
│   │   └── theme.js                # Design tokens (colors, fonts)
│   └── ui/
│       ├── Button.js               # FancyButton wrapper (primary/secondary/danger)
│       ├── GameUI.js               # HUD panel — score + menu/exit buttons
│       ├── MenuBackground.js       # Dark background + panel for menu
│       ├── RadioGroup.js           # @pixi/ui radio group wrapper — used for mode selection
│       └── ScoreLabel.js           # Score display widget
│
└── helpers/
    ├── make-bg.helper.js           # Creates rounded-rect Graphics for buttons
    └── utils.js                    # Vec2, DIR, randomCell, oppositeDir
```

## Game modes

| Mode    | Description                                  |
|---------|----------------------------------------------|
| Classic | Die on boundary walls and self-collision     |
| God     | Pass through boundaries and self             |
| Walls   | Each food eaten spawns an extra wall cell    |
| Portal  | Two foods on board — eating one teleports the snake to the other |
| Speed   | Each food eaten increases speed by 10%       |

## Architecture

### Game loop

`TickLoop` hooks into the PixiJS `Ticker` (rAF-based) and accumulates `deltaMS` each frame. A game tick fires only when the accumulated time exceeds `GameEngine.interval` — decoupling snake movement speed from the frame rate. The `SpeedMechanic` reduces `interval` to increase pace. Each tick calls `GameEngine.tick()` which returns a `TickEvent` (`'moved' | 'ate' | 'gameover' | null`). The main entry reacts to the event to update the HUD and renderer.

### State machine

`StateMachine<S>` holds one active state at a time and calls `exit()` / `enter()` on transitions. `GameEngine` uses it internally to switch between `PlayingEngineState` and `GameOverEngineState`.

### Mechanic system

Each mechanic declares four boolean flags (`passThrough`, `selfDeath`, `boundaryDeath`, `wallDeath`) and a `getFoodEatenSteps()` method that returns a list of step callbacks. `PlayingEngineState` checks the flags during collision detection and runs the steps via `Sequence` when food is eaten.

### Scene flow

`SceneManager` handles animated fade transitions between PixiJS `Scene` containers. `SceneSequence` composes the generic `Sequence` step-runner so `main.js` can declare the full screen flow as an ordered list of factory functions.
