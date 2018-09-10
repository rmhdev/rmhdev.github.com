---
layout:         post
title:          "The Mandelbrot set, step by step (1): introduction"
date:           2018-08-30 07:00:00 +0700
categories:     posts
abstract:       "First of a series of posts where I build an app that displays the Mandelbrot set, using the Go programming language"
image:          "/images/posts/2018-mandelbrot-intro.jpg"
image-alt:      "Artistic interpretation. Three man observe a blackboard filled with a zoomed and colorized representation if the Mandelbrot set, while a woman writes in a notebook."
image-source:   https://github.com/rmhdev/rmhdev.github.com/tree/master/misc/illustrations/2018-mandelbrot-intro
image-caption:  "2018 rmhdev"
published:      true
---

During a trip back in July'18 I started learning the Go programming language by taking 
[the official tour of Go][a-tour-of-go]. Although I had never tried it, it only took me a couple of days to
start feeling comfortable with its syntax and tools. That's why I decided to put into practice what I was 
learning by building a basic pet project that generates images of the Mandelbrot set. 
It's been an interesting process, I hope you enjoy it as much as I did!


## What is the Mandelbrot set? {#definition}

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

The complex numbers are numbers like `(1.2 + 0.5i)`, which have a real part (`1.2`), an imaginary part (`0.5i`) 
and where `i` is the square root of -1. 
Because there are infinite complex numbers, when representing the Mandelbrot set we will have to 
**select a sample** of them and check if they are part of the Mandelbrot set by applying the function seen above. 

But, **how do we generate that sample**? Given that an image is made by **pixels**, we will use them as our samples. 
For example, in a `9x9` image we will have `81` pixels; after a transformation, 
a set of `81` complex numbers will be ready for us.

### 2. The absolute value of `z(n)` remains bounded

Let’s see what it means by applying the function to some values. 
To simplify things we will use integer numbers, even though the mandelbrot set uses complex numbers.

|            | `n=0` | `n=1`  | `n=2` | `n=3` | `n=4` | `n=5` | `n=big`     |
| ---------- | -----:| ------:| -----:| -----:| -----:| -----:| -----------:|
| **`c=1`**  | `0`   | `1`    | `2`   | `5`   | `26`  | `677` | huge!       |
| **`c=0`**  | `0`   | `0`    | `0`   | `0`   | `0`   | `0`   | `0`         |
| **`c=-1`** | `0`   | `-1`   | `0`   | `-1`  | `0`   | `-1`  | [`0`, `-1`] |

As you can see, when `c=0` or `c=-1` **the value of `z` never leaves a "bounded limit"**, 
and that's why they are part of the Mandelbrot set. But when `c=1` the values get bigger and bigger, 
diverging from a possible bounded limit. Therefore `c=1` is **not** part of the Mandelbrot set.

#### What about the "bounded limit"? {#bounded-limit} 

Luckily, it is known that values inside the Mandelbrot set have 
an [absolute value][absolute-value] (*modulus*) of `z` less than or equal to 2.

{% highlight shell %}
z = a + bi
|z| = sqrt(z) = sqrt(a² + b²) 
{% endhighlight %}

In a complex number `(a + bi)`, if `sqrt(a² + b²)>2`, then we are sure that the complex number is not part of the Mandelbrot set.

### 3. Applying the iteration repeatedly

In theory, for every point in the set we should iterate infinite times through the function to check 
if `z` stays bounded. Given that we cannot do that, for practical purposes we will have to decide a 
**threshold value**. After reaching that maximum iteration we will decide that the point is inside 
the Mandelbrot set, even though we might not be 100% sure of that in some cases.

## Conclusion

This has been a basic, over-simplified description of the Mandelbrot set. In the next posts I will use
this information to build step by step an app in the Go programming language that generates images of 
this interesting set. Stay tuned!


[a-tour-of-go]: https://tour.golang.org/list 
[wikipedia-mandelbrot]: https://en.wikipedia.org/wiki/Mandelbrot_set
[mandelbrot-image-bw]: /images/mandelbrot/mandelbrot-wikipedia-bw.png
[absolute-value]: https://en.wikipedia.org/wiki/Absolute_value#Complex_numbers
