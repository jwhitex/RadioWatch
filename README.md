# RadioWatch

A web app built to test the workflow/features of developing in Angular 2.

## About

My first experience with Angular 2 framework (including redux/rx.js). There are some cool components here including: 
  - Expando Grid Implementation
  - Embeded Youtube Player
  - Video slider

My thanks to the local NPR station, [WUTC](http://www.wutc.org). They're evening music playlist is what was used to generate the youtube playlist.

### Learned:

- The video slider inside the grid row expanse is controlled by mouse wheel events. This should be handled differently. It is junk on mobile and on laptops. 
- Just use moment (js)...
- Focus less on building a grid capable of packaging.
- Don't Redux everything...huge waste of time if you don't need the features that Redux enables.

## Publish

*Relative Paths Do not Work https://github.com/dotnet/cli/issues/3833*

dotnet publish "...\RadioWatch\src\RadioWatch" -o "...\Docker\app-img\out" -c Release
