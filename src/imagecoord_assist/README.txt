# IMAGECOORD_ASSIST

## Problem
Getting the coordinates for bounding boxes is a pain.
I have to take a screenshot, open up a paint program, and manually map out the coordinates. Then I have to save that all to the filename. Ends up taking a little over a minute for each. 
This wasn't too big of an issue for small amounts, however, in this project I suspect that there will be hundreds. When further considering that I'm going to be redoing so many of these, a better system is needed. 

## Solution
The idea here is to record a video of running through dailes.
Then you can load it into html5 canvas and draw roi's directly on it. 
When satisfied, you download the result and have the reference immediately ready. 

## REFERENCES
http://jsfiddle.net/dsbonev/cCCZ2/ (play video from filesystem)
http://jsfiddle.net/on1kh4o0/ (video on canvas)
https://codepen.io/alperentalaslioglu/pen/yPGgvP (drawing on canvas)
https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas (mouse position on canvas)
https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image (download canvas as image)