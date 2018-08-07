# UI elements to implement

The goal is to create a fluid UX that will enable freeform drawing. At all times dwell based elements are to be kept to a minimum. The focus should be on gaze only elements, with distinct single gaze routes that do not intersect. To ensure that activating one element does not cross the path of another, inadvertnely activating the wrong user action.

## Start stop elements

### implementation

current implementation has these gaze objects at either side of the screen.

### Questions

- are start and stop needed?
- Switch to start and pen up?
- Should start and stop be integrated into speed control?

## Speed adjustments

### Implementation

TBC

### Questions
- Find a single speed Sarah is comfortable with and lock?
- Allow speed change 1-10, using increment and decrement
- implement fine grain adjustment -5 to +5 with 0 stopping movement

## Straight line, initial starting direction

### Implementation

TBC

### Suggestion

- Centre top  has a dwell icon to open a menu
- Option to change direction, uses increment and decrement
- Two increment andecrement boxes, one to edit by 10 other 1
- circle with visual representation of chosen direction
- dwell to confirm and return to main window

### Questions
- Use of dwell appropriate?
- Does this introduce confusion?
- can we visually distinguish what is a dwell or gaze element?

## Curved lines

### Implementation

- Gaze elements -4 through +4

### Suggestion

- Introduce an edit window to change the level of curve
- increment and decrement elements in 10 and 1
- Visual element to demonstrate curve
- High, medium and low presets to allow for fast switching

### Questions

- How can we minimise steps to choose correct curve

## Future implementations

- Predictive line
- orient to start point



