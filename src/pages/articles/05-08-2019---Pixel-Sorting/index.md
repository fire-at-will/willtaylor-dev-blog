---
title: Pixel Sorting
date: "2019-05-08T20:11:15+00:00"
layout: post
draft: false
path: "/posts/pixel-sorting/"
category: "Algorithms"
tags:
  - "Digital Art"
  - "Algorithms"
  - "Java"
description: "What is pixel sorting and how does it work? Let's find out."
---

![image](./image_original.jpg)

Like many dangerous things one comes across on the internet, I stumbled upon pixel sorting on a late evening Reddit session. A post from the [pixel sorting subreddit](https://www.reddit.com/r/pixelsorting) bubbled up to the top of my news feed and grabbed hold of my attention. The site was full of corrupt images, real pictures taken with a camera that looked like they were recovered from a fatally corrupted hard drive. Take a look at a few of them below.

<br>
<div class="row" style="height: 350px;">
  <div class="columnOneThird"><img src="/tree.jpg"/></div>
  <div class="columnOneThird"><img src="/example1.jpg"/></div>
  <div class="columnOneThird"><img src="/streetlight.jpg" /></div>
</div>
<br>

![pluto](/pluto_sorted.jpg)

I was *hooked*. It didn't take long for the programmer in me to cry out "I bet I could do this!". Surely it couldn't be that hard, right? I cracked open my IDE and got to work. Here's how I got it done.

<hr class="divider-line"/>

## Breaking Down the Problem
Basic pixel sorting is pretty straightforward. To perform the most basic pixel sort, we need to:
1. Break down an image into a matrix of pixels
2. Sort each row or column of the matrix by the color value of the pixels

It really is that simple. Once we get this down, we can make things a bit fancier to achieve what we see in the images at the top of the post.

## Sorting Pixels
Let's write some code! The Java method below takes in a `PixelBuffer` object, which is a wrapper around a 2 dimensional list of pixels. The function then iterates through and sorts each row of the pixel buffer and returns the sorted buffer.

```java{numberLines: true}
public PixelBuffer sortImageHorizontally(PixelBuffer pixelBuffer){

  // Iterate through each row in the buffer
  for(int y = 0; y < pixelBuffer.getHeight(); y++){
      List<Integer> row = pixelBuffer.getRow(y);  // Get the row
      row.sort(Comparator.naturalOrder());        // Sort the row
      pixelBuffer.setRow(y, row);       // Persist the sorted row             
  }

  return pixelBuffer;
}
```

Let's give our code a spin on this picture from a recent trip to Seattle.

<div class="row">
  <div class="columnHalf" style="margin-right: 1em;">
    <b>Before</b>
    <br>
    <br>
    <img src="/image_original.jpg">
  </div>
  <div class="columnHalf" style="margin-left: 1em;">
    <b>After</b>
    <br>
    <br>
    <img src="/image_sorted1.jpg">
  </div>
</div>

Pretty neat, huh? We can see that each row has been sorted by the pixel's color from darkest to lightest. The pixels from the original picture are still there - the Puget Sound is visible in the center of the picture and the sunset is just as vibrant as before. We can modify our code easily from here to sort the image vertically by columns as well.

```java{numberLines: true}
public PixelBuffer sortImageVertically(PixelBuffer pixelMatrix){

  // Iterate & sort the columns instead of the rows
  for(int x = 0; x < pixelMatrix.getWidth(); x++){
      List<Integer> column = pixelMatrix.getColumn(x);
      column.sort(Comparator.naturalOrder());
      pixelMatrix.setColumn(x, column);
  }

  return pixelMatrix;
}
```

![image sorted vertically](/image_sorted2.jpg)
*A few tweaks to our algorithm allow for vertical sorting.*

What we have so far looks impressive, but can we take it a little further? After all, these don't quite look like the pictures at the top of the page...

<hr class="divider-line"/>

## Introducing Sort Intervals!
Let's make things more interesting. What if instead of sorting an entire row at one time, we instead sorted *parts* of a row at a time? What would that look like?

The code below works just as the code above does, but it also breaks each row into multiple equal width sections and sorts each section individually.

```java{numberLines: true}
public PixelBuffer sortImageHorizontally(
  PixelBuffer pixelBuffer, 
  int numberOfIntervals, 
) {
  // Determine the width of each interval
  int intervalWidth = pixelBuffer.getWidth() / numberOfIntervals;

  // Iterate through the rows
  for(int y = 0; y < pixelBuffer.getHeight(); y++){
      List<Integer> row = pixelBuffer.getRow(y);
      List<Integer> newRow = new ArrayList<>();

      // Iterate through the intervals
      for(int i = 0; i < pixelBuffer.getWidth(); i = i + intervalWidth){
          // Ensure that we don't sort pixels that are not in the image
          int stoppingPoint = Math.min(i + intervalWidth, pixelBuffer.getWidth());
          
          // Get the sub interval from the row
          List<Integer> sortingInterval = row.subList(i, stoppingPoint);
          
          // Perform the sort
          sortingInterval.sort(Comparator.naturalOrder());

          newRow.addAll(sortingInterval);
      }
      
      pixelBuffer.setRow(y, newRow);
  }

  return pixelBuffer;
}
```

Adding this extra `for` loop to our algorithm raises the time complexity but the results speak for themselves:

<div class="row">
  <div class="columnHalf" style="margin-right: 1em;">
    <b>Horizontal</b>
    <br>
    <br>
    <img src="/image_sorted3.jpg">
  </div>
  <div class="columnHalf" style="margin-left: 1em;">
    <b>Vertical</b>
    <br>
    <br>
    <img src="/image_sorted4.jpg">
  </div>
</div>

## Pushing It Further: Variable Width Sort Intervals

Let's see how far we can take this! What if we added more variance to image to spice things up? The pictures above are a little too *predictable*, aren't they? Why not give each row a different number of sorting intervals? While we're at it, let's give the intervals a *random* width instead of the *constant* width they already have!

```java{numberLines: true}
public PixelBuffer sortImageHorizontally(
  PixelBuffer pixelBuffer, 
  boolean randomIntervals, 
  int maxNumberOfIntervals, 
  int numberOfIntervals, 
){
  for(int y = 0; y < pixelBuffer.getHeight(); y++){
      List<Integer> row = pixelBuffer.getRow(y);
      List<Integer> newRow = new ArrayList<>();

      // Determine the width of each interval. This can be static or 
      // dynamic
      int intervalWidth;
      if(randomIntervals){
          int dynamicNumberOfIntervals = (int) (Math.random() * maxNumberOfIntervals + 1);
          intervalWidth = pixelBuffer.getWidth() / dynamicNumberOfIntervals;
      } else {
          intervalWidth = pixelBuffer.getWidth() / numberOfIntervals;
      }

      // Iterate through the intervals
      for(int i = 0; i < pixelBuffer.getWidth(); i = i + intervalWidth){
          // Ensure that we don't sort pixels that are not in the image
          int stoppingPoint = Math.min(i + intervalWidth, pixelBuffer.getWidth());

          // Get the sub interval from the row
          List<Integer> sortingInterval = row.subList(i, stoppingPoint);

          // Perform the sort
          sortingInterval.sort(Comparator.naturalOrder());

          newRow.addAll(sortingInterval);
      }

      pixelBuffer.setRow(y, newRow);
  }

  return pixelBuffer;
}
```

Whew!! Our code is getting to be pretty long, isn't it? Despite the length, the results from this algorithm are absolutely **stunning**. Check it out:

![image sorted horizontally with variable sort intervals](/image_sorted5.jpg)


![image sorted horizontally with variable sort intervals](/image_sorted6.jpg)

The greater the value of the `maxNumberOfIntervals` input variable is, the smaller the individual intervals are, and thus the more like the sorted image will look more like the original image. 

![image sorted horizontally with variable sort intervals](/image_sorted7.jpg)
*This picture was sorted with a `maxNumberOfIntervals` of 400.*

<hr class="divider-line"/>

## Other Examples

### Seattle Space Needle
<br>
<div class="row">
  <div class="columnHalf" style="margin-right: 1em;">
    <img src="/example2.jpg">
    <p><i>Original</i></p>
  </div>
  <div class="columnHalf" style="margin-left: 1em;">
    <img src="/example2_sorted.jpg">
    <p><i>Sorted with <code>maxNumberOfIntervals=25</code></i></p>
  </div>
</div>

### Ferris Wheel
![Ferris Wheel](./example3_sorted.jpg)

<hr class="divider-line"/>

## Further Reading
The full source code for the project we've been working on in this article can be found in [TODO: this repo]() on my GitHub page. If you'd like to learn more about pixel sorting, do check out the dedicated [subreddit](https://www.reddit.com/r/pixelsorting).

Thanks for reading!