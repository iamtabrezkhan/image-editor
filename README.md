# ImageEditor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

> Host URL: http://boiling-earth.netlify.app/

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Features

- A panel that loads thumbnails from Picsum with pagination on scrolling.
- A blank canvas (9:16)
- Drag and drop images from the left panel to the canvas
- If the canvas is blank, then image should be added as a background of the entire canvas. In case image has a different aspect ration than the canvas, then fit the image inside the canvas by blurring the sides.
- If there is already a background image set, then new image should be added on top of the canvas, and should be added as per its aspect ratio

## Additional Features

- Key Bindings
  - `DELETE` key to delete an object from the canvas
- Toolbar
  - Option to add text
  - Delete button to delete an object from the canvas
  - Button to bring an object forward
  - Button to push an object backward
  - Dropdown to switch between aspect ratios
  - Button to download the canvas as an image

## Future Scope

- Use arrow keys to move an object on the canvas
- Undo and Redo feature
- Change background / background color
- Change text color
- Change text font
- Change font size
- Update canvas size on window resize
