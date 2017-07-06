# study-js-minesweeper
P5 javascript and gulp study

---
# Troubleshootings
## Gulp
It appears that gulp has some unusual behaviour when used globally. When used as a global install, gulp looks for a locally installed gulp to pass control to. Therefore a gulp global install requires a gulp local install to work.

Try running `npm link gulp` in your application directory (to create a local link to the globally installed Gulp module).