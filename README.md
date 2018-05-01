# RadioWatch

This is a web app I hosted for a while at RadioWatch.io. I have since taken it down. A successor to this project will be a spotify playlist integration using aws api/lambda that is slowly on its way.

## About

Building this app was my first experience with Angular 2 framework. There are some cool components here including: 
  - Expando Grid Implementation
  - Embeded Youtube Player
  - Video slider

Hats off to Cleveland, who hosts evening music at [wutc](http://www.wutc.org) in Chattanooga, TN. I pull from his playlist hosted at npr.

Things I should have done differently:

- The video slider inside the grid row expanse is controlled by mouse wheel events. This should be handled differently. It is crappy on mobile and on laptops the scroll just feels wonky. 
- Just use moment (js)...
- Focus less on building a grid capable of packaging. (Avoid useless features!)


## Publish

*Relative Paths Do not Work https://github.com/dotnet/cli/issues/3833*

dotnet publish "...\RadioWatch\src\RadioWatch" -o "...\Docker\app-img\out" -c Release
