---
layout:     post
title:      "The Mandelbrot set, step by step (1): introduction"
date:       2018-08-30 00:00:00 +0500
categories: mandelbrot introduction golang
abstract:   "First of a series of posts where I will build an app that displays the Mandelbrot set."
published:  true
---

During a trip back in July'18 I started learning the Go programming language by taking 
[the official tour of Go][a-tour-of-go]. Surprisingly, my experience ended up being better 
than expected and after some days I felt that I was starting to enjoy the language. 
That's why I decided to start a pet project 


## What is the Mandelbrot set? {#mandelbrot}

Let’s read the [formal definition on the Wikipedia][wikipedia-mandelbrot]:

> The Mandelbrot set is the set of values of `c` in the complex plane for which the orbit of `0` under iteration 
> of the quadratic map remains bounded. 

{% highlight shell %}
z(0)   = 0
z(n+1) = z(n)² + c
{% endhighlight %}

> That is, a complex number `c` is part of the Mandelbrot set if, when starting with `z(0)=0` 
> and applying the iteration repeatedly, the absolute value of `z(n)` remains bounded however large `n` gets.

Let's analyze this definition: 

### 1. It's a set of values in the complex plane

The complex numbers are numbers like `(1.2 + 0.5i)`, which have a real part (`1.2`) and an imaginary part (`0.5i`). 
Because there are infinite complex numbers, when representing the Mandelbrot set we will have to 
**select a sample** of them and check if they are part of the Mandelbrot set by applying the function seen above. 

But, **how do we generate that sample**? Given that an image is made by **pixels**, we will use them as our samples. 
For example, in a `9x9` image we will have `81` pixels; after a transformation, 
a set of `81` complex numbers will be ready for us.

### 2. The absolute value of `z(n)` remains bounded

Let’s see what it means by applying the function to some values. 
To simplify things we will use integer numbers, even though the mandelbrot set uses complex numbers.

|            | `n=0` | `n=1`  | `n=2` | `n=3` | `n=4` | `n=5` | `n=inf`     |
| ---------- | -----:| ------:| -----:| -----:| -----:| -----:| -----------:|
| **`c=1`**  | `0`   | `1`    | `2`   | `5`   | `26`  | `677` | Big!        |
| **`c=0`**  | `0`   | `0`    | `0`   | `0`   | `0`   | `0`   | `0`         |
| **`c=-1`** | `0`   | `-1`   | `0`   | `-1`  | `0`   | `-1`  | [`0`, `-1`] |

As you can see, when `c=0` or `c=-1` **the value of `z` never leaves a "bounded limit"**, 
and that's why they are part of the Mandelbrot set. But when `c=1` the values get bigger and bigger, 
diverging from a possible bounded limit. Therefore `c=1` is not part of the Mandelbrot set.

**What about the "bounded limit"?** Luckily, it is known that values inside the Mandelbrot set have 
a `z` less than or equal to 2. So, if we find that `z>2`, then we can say that the given point is outside the set.

### 3. Applying the iteration repeatedly

In theory, for every point in the set we should iterate infinite times through the function to check 
if `z` stays bounded. Given that we cannot do that, for practical purposes we will have to decide a 
**threshold value**. After reaching that maximum iteration we will decide that the point is outside 
the Mandelbrot set, even though we are not 100% sure of that.

## Conclusion

This has been a basic, over-simplified description of the Mandelbrot set. In the next posts we will use
this information to build step by step an app in the Go programming language that generates images of 
the Mandelbrot set. Stay tuned!


[a-tour-of-go]: https://tour.golang.org/list 
[wikipedia-mandelbrot]: https://en.wikipedia.org/wiki/Mandelbrot_set
[mandelbrot-image-bw]: /images/mandelbrot/mandelbrot-wikipedia-bw.png
