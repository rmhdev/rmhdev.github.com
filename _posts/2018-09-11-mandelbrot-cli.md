---
layout:         post
title:          "The Mandelbrot set, step by step (2): CLI version"
date:           2018-09-11 05:00:00 +0700
categories:     posts
abstract:       "In this post we put into practice the theory of the Mandelbrot set, displaying it in the command-line interface"
image:          "/images/posts/2018-mandelbrot-cli.jpg"
image-alt:      "Artistic representation. An old computer, over a colorful abstract background, displays a low resolution version of the Mandelbrot set."
image-source:   https://github.com/rmhdev/rmhdev.github.com/tree/master/misc/illustrations/2018-mandelbrot-cli
image-caption:  "2018 rmhdev"
published:      true
---

Welcome to the second post of the series where I develop an app in the Go programming language 
that displays the Mandelbrot set.

## Objectives

In this post I will describe how to put into practice the theory behind the Mandelbrot set.
Then I will write a first version of the app that displays the 
set in the **Command Line Interface** (or CLI). 


## Requirements {#requirements}

* If you want to follow the steps of this tutorial, [install the Go environment][go-install].
* An **IDE** will help you with autocompletions, formatting, incorrect types... I decided to 
try GitHub's [Atom editor][atom-editor], but you can use your favorite one. 
Check the [official Go docs for plugins and tips][golang-editors]. 
* Also, the [code of the app][project-repo] is hosted on GitHub, so if you decide to follow the progress of this 
project [install git][install-git] and clone the repository:

{% highlight shell %}
git clone https://github.com/rmhdev/mandelbrot-step-by-step.git
{% endhighlight %}


## Configure the Mandelbrot set

As we saw in the last post, the Mandelbrot set consists of **complex numbers** that comply with some rules.
These complex numbers are numbers like `-1.2 + 0.5i`, where `-1.2` is the real part and `0.5i` is the imaginary part. 
To display the Mandelbrot set in a two dimensional cartesian plane like an image, we will use the real part as 
the `X` axis and the imaginary part and the `Y` axis. Both axis will be delimited by maximum and minimum values.

<figure class="image">
<img src="/images/mandelbrot/mandelbrot-wikipedia-bw.png" />
<figcaption><a href="https://commons.wikimedia.org/wiki/File:Mandelset_hires.png">Mandelbrot set</a>, from wikipedia (public domain)</figcaption>
</figure>

However in a digital image the `X` and `Y` axis are not measured by complex numbers but by **pixels**! 
That's why we are going to need some method to know which complex number `c` is represented by `pixel(x, y)`.

## From pixel to complex number

A good starting point for our app can be developing the next two methods:

* `toReal(xPixel)` calculates the real part of a complex number.
* `toImag(yPixel)` calculates the imaginary part of a complex number.

Let’s think of a real case scenario: we want to generate a `11x11` pixels image of a Mandelbrot set 
which limits are `[-2.5, 2.5]` for the real part (`X` axis) 
and `[-1.0, 1.0]` for the imaginary part (`Y` axis).

<figure class="image">
<img src="/images/mandelbrot/from-pixels-to-complex.jpg" />
<figcaption>Relation between pixels and complex numbers</figcaption>
</figure>

Looking at the image, it's easy to spot some cases that will help us check if our transformation is correct:

| Pixel coordinate     | Expected complex number     |
| -------------------- | --------------------------- |
| `(0, 0)`             | `-2.5 + 1.0i`               |
| `(10, 10)`           | `2.5 - 1.0i`                |
| `(5, 5)`             | `0 + 0i`                    |
| `(11, 4)`            | Error! `x` is out of bounds |
| `(-1, 0)`            | Error! `x` is out of bounds |
| `(0, 11)`            | Error! `y` is out of bounds |
| `(0, -1)`            | Error! `y` is out of bounds |


For the transformation, we need to know the **boundaries of both real and imaginary parts** of the Mandelbrot set.
We will also need the **width** and **height** of the resulting image in pixels. 
Let's create a type `Config` that groups all these values:

{% highlight golang %}
// config.go
package main

type Config struct {
  width   int
  height  int
  minReal float64
  maxReal float64
  minImag float64
  maxImag float64
}
{% endhighlight %}

Now let's add the `toReal(xPixel)` and `toImag(yPixel)` methods:

{% highlight golang %}
// config.go
package main

import (
  "errors"
  "fmt"
)

type Config struct {
  width   int
  height  int
  realMin float64
  realMax float64
  imagMin float64
  imagMax float64
}

func (c Config) toReal(x int) (float64, error) {
  if x >= c.width || x < 0 {
    return 0, errors.New("X is out of bounds")
  }
  size := ((c.realMax - c.realMin) / float64(c.width-1))

  return c.realMin + float64(x)*size, nil
}

func (c Config) toImag(y int) (float64, error) {
  if y >= c.height || y < 0 {
    return 0, errors.New("Y is out of bounds")
  }
  size := ((c.imagMax - c.imagMin) / float64(c.height-1))

  return c.imagMax - float64(y)*size, nil
}
{% endhighlight %}

Nice! The app is now able to transform every pixel of our image into a complex number. 
The next step will be detecting if these numbers are part of the Mandelbrot set.


## Is this number inside the Mandelbrot set?

To verify if a complex number is inside the set, we need to iterate the function we saw in the 
[previous post][mandelbrot-definition]:

{% highlight shell %}
z(0)   = 0
z(n+1) = z(n)² + c
{% endhighlight %}

To program the iteration, we must know the math behind complex numbers. A good tip: we will use 
the **perfect square formula**: `(a + b)² = a² + 2 * a * b + b²`

Let's see an example with `c=-0.75 + 0.75i`: 

{% highlight shell %}
z0 = 0

z1 = (z0)² + c
   = (0)² + (-0.75 + 0.75i) 
   = -0.75 + 0.75i

z2 = (z1)² + c
   = (-0.75 + 0.75i)² + c 
   = (-0.75)² + 2 * (-0.75) * 0.75i + (0.75i)² + c
   = -1.125i + (-0.75 + 0.75i)
   = -0.75 - 0.375i
 
z3 = (z2)² + c
   = ...
{% endhighlight %}

But, **when do we stop**? For a complex number `c`, in every iteration of the function we need to check the 
**absolute value** of z (`|z|`):

`|z| = |(a + bi)| = sqrt(a² + b²)`

* If `|z|` is greater than 2, then `c` is not part of the set.
* If after a maximum number of iterations `|z|` is not bigger than 2, then `c` is part of the set.

Let's see how the absolute value of some complex numbers varies through iterations: 

|      |                 | `n=0`  | `n=1`  | `n=2`  | `n=3`  | `n=4`  | `n=5`  |
| ---- | --------------- | ------:| ------:| ------:| ------:| ------:| ------:|
| *A*: | `-1.0 + 0.0i`   | `0.00` | `1.00` | `0.00` | `1.00` | `0.00` | `1.00` |
| *B*: | `-2.5 + 1.0i`   | `0.00` | `2.69` |        |        |        |        |
| *C*: | `-0.75 + 0.75i` | `0.00` | `1.06` | `0.84` | `1.35` | `2.37` |        |

For some complex numbers (like *A*) its absolute value never gets bigger than 2. But in other cases, 
like *B* and *C*, the continuous iteration makes them diverge at some point. Depending of the iteration, 
the complex number is part of the set or not. This is why defining a correct **threshold** is so important.

Let's create a `type` that is responsible for verifying if a complex number remains bounded after 
some iterations:

{% highlight golang %}
package main

import "math"

type Verifier struct {
  maxIterations int
}

func (v Verifier) isInside(realC float64, imagC float64) bool {
  realZ, imagZ, modulusZ := 0.0, 0.0, 0.0
  for i := 0; i < v.maxIterations; i++ {
    modulusZ = math.Sqrt(realZ*realZ + imagZ*imagZ)
    if modulusZ > 2 {
      return false
    }
    realZ, imagZ = v.next(realZ, imagZ, realC, imagC)
  }
  return true
}

func (v Verifier) next(realZ float64, imagZ float64, realC float64, imagC float64) (float64, float64) {
  realNew := realZ*realZ - imagZ*imagZ + realC
  imagNew := 2*realZ*imagZ + imagC
  
  return realNew, imagNew
}
{% endhighlight %}

Nice, we are almost there!

## Loop and print

Now all we need to do is loop through all the pixels of our "image" and print the result in
the CLI. Let's edit the main method: 

{% highlight golang %}
// main.go
package main

import "fmt"

func main() {
  config := Config{101, 51, -2.0, 0.5, -1.0, 1.0}
  verifier := Verifier{20}
  realC, imagC := 0.0, 0.0
  for y := 0; y < config.height; y++ {
    imagC, _ = config.toImag(y)
    for x := 0; x < config.width; x++ {
      realC, _ = config.toReal(x)
      if verifier.isInside(realC, imagC) {
        fmt.Print("*")
      } else {
        fmt.Print("·")
      }
    }
    fmt.Println("")
  }
}
{% endhighlight %}

And now, let's build the project and run the generated executable file:

{% highlight shell %}
cd mandelbrot-step-by-step/
go build
./mandelbrot-step-by-step
{% endhighlight %}

If you execute this code in your machine, the result should be what you see in the next image:

<figure class="image">
<img src="/images/mandelbrot/mandelbrot-cli.jpg" />
<figcaption>The Mandelbrot set, displayed in the command-line interface</figcaption>
</figure>

## Custom parameters

Unfortunately, the parameters of this Mandelbrot set are hardcoded inside the app. 
Let's add **command-line flags** to customize the result!

{% highlight golang %}
// main.go
package main

import (
  "flag"
  "fmt"
)

func main() {
  width := flag.Int("width", 101, "width")
  height := flag.Int("height", 41, "height")
  rMin := flag.Float64("realMin", -2.0, "Min real part")
  rMax := flag.Float64("realMax", 0.5, "Max real part")
  iMin := flag.Float64("imagMin", -1.0, "Min imaginary part")
  iMax := flag.Float64("imagMax", 1.0, "Max imaginary part")
  iterations := flag.Int("iterations", 50, "Max iterations")
  
  flag.Parse() // Don't forget this!
  
  config := Config{*width, *height, *rMin, *rMax, *iMin, *iMax}
  verifier := Verifier{*iterations}
  
  realC, imagC := 0.0, 0.0
  for y := 0; y < config.height; y++ {
    imagC, _ = config.toImag(y)
    for x := 0; x < config.width; x++ {
      realC, _ = config.toReal(x)
      if verifier.isInside(realC, imagC) {
        fmt.Print("*")
      } else {
        fmt.Print("·")
      }
    }
    fmt.Println("")
  }
}
{% endhighlight %}

Remember to rebuild the app:

{% highlight shell %}
go build
{% endhighlight %}

Now the app accepts **custom values** entered from the command line:

{% highlight shell %}
./mandelbrot-step-by-step -iterations=5
{% endhighlight %}

## Testing and Refactoring

If you take a look at the source code of the app, you'll find tests for most part of the code 
(look for `*_test.go` files). I've been following a **Test Driven Development** ([TDD][tdd]) approach, 
which means [writing tests before actually writing the code itself][test-first].
These tests provide a *safety net* to refactor the code without breaking things by accident.

Check the [`cc79a24`][cc79a24] commit (and the following ones) if you want to see a step-by-step TDD approach 
of how I've developed the `toReal(x)` method.

There are many improvements that could make the code clearer and more robust, but 
**at this point the app is good enough**: it does what we want (prints the Mandelbrot set in the CLI) 
and does is correctly. In the next post I will enhance the app while adding the ability 
to generate images in black and white.


[go-install]: https://golang.org/doc/install
[atom-editor]: https://atom.io/
[golang-editors]: https://golang.org/doc/editors.html
[project-repo]: https://github.com/rmhdev/mandelbrot-step-by-step.git
[install-git]: https://help.github.com/articles/set-up-git/
[mandelbrot-definition]: {% post_url 2018-08-30-mandelbrot-introduction %}#definition
[tdd]: https://en.wikipedia.org/wiki/Test-driven_development
[test-first]: http://www.extremeprogramming.org/rules/testfirst.html
[cc79a24]: https://github.com/rmhdev/mandelbrot-step-by-step/commit/cc79a24d9e7464507e21371c5142fa7fa578c058