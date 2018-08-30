---
layout:     post
title:      "The Mandelbrot set, step by step (2): introduction"
date:       2018-08-30 00:10:00 +0500
categories: mandelbrot golang stdout terminal
abstract:   "In this post I will build an app that displays the Mandelbrot set in the terminal"
published:  false
---

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

 
[go-install]: https://golang.org/doc/install
[atom-editor]: https://atom.io/
[golang-editors]: https://golang.org/doc/editors.html
[project-repo]: https://github.com/rmhdev/mandelbrot-step-by-step.git
[install-git]: https://help.github.com/articles/set-up-git/
